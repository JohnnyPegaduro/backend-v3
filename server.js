import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import socketProductos from "./socket/productos.js";
import socketMensajes from "./socket/mensajes.js";
import homeRouter from "./routes/home.js";
import randomRouter from "./routes/randomProducts.js";
import { DBConnect } from "./config/configMongo.js";
import passport from "passport";
import * as dotenv from "dotenv";
import ParseArgs from "minimist";
import infoRouter from "./routes/info.js";
import randomNumRouter from "./routes/randomNumbers.js";
import cluster from "cluster";
import { cpus } from "os";
import logger from "./config/configLog4Js.js";

dotenv.config();

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}.nvlvgso.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    }),
    secret: "secreto",
    resave: false,
    saveUninitialized: false,
    //ttl: 600000,
    cookie: {
      maxAge: 600000,
    },
  })
);

//*Passport
app.use(passport.initialize());
app.use(passport.session());

//* Logger
app.use((req, res, next) => {
  logger.info(`Request ${req.method} at ${req.url}`)
  next();
});

//* Socket ---
io.on("connection", async (socket) => {
  console.log("Usuario conectado")
  socketProductos(socket, io.sockets);
  socketMensajes(socket, io.sockets);
})

//* Rutas
app.use(homeRouter);
app.use(randomRouter);
app.use(infoRouter);
app.use("/api/randoms", randomNumRouter);

//* Logger para rutas inexistentes
app.all("*", (req, res, next) => {
  logger.warn(`Failed request ${req.method} at ${req.url}`);
  res.send({ error:true }).status(500);
  next();
})

//* Modo como parámetro
const options= {
  alias: {
    m: "MODO",
  },
  default: {
    MODO: "FORK",
  }
}

const argv = process.argv.slice(2);
const { MODO } = ParseArgs(argv, options)
const PORT = process.env.PORT || 8080

const cpu = cpus().length;

if (MODO == "CLUSTER") {
  if (cluster.isPrimary) {
    console.log(`Primary: ${process.pid}`);

    //Fork workers
    for (let i = 1; i <= cpu; i++){
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker with PID ${worker.process.pid} DOWN`);
      cluster.fork();
    })
  } else {
    DBConnect (()=> {
      const connectedServer = httpServer.listen(PORT, () => {
        console.log(
          `Servidor http escuchando en el puerto ${PORT} en modo ${MODO} en el worker ${process.pid}`
        );
      });
      connectedServer.on("error", (error) =>
        console.log(`Error en servidor ${error}`)
      );
    })
  }
} else {
  DBConnect (()=> {
    const connectedServer = httpServer.listen(PORT, () => {
      console.log(
        `Servidor http escuchando en el puerto ${PORT} en modo ${MODO}`
      );
    });
    connectedServer.on("error", (error) =>
      console.log(`Error en servidor ${error}`)
    );
  })
}


