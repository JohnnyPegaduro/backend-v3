import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import homeRouter from "./routes/home.js";
import { normalize, schema, } from 'normalizr'
import Message from "./class/apiMensajes.js";
import Product from "./class/productClass.js";
import connection from "./configMySql.js";
import randomRouter from "./routes/random.js";
import { DBConnect } from "./controller.js";
import passport from "passport";

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer)
const usersMessages = new Message("./data/mensajes.json")
const producto = new Product (connection, "productos")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://Johnny:4321@codercluster.nvlvgso.mongodb.net/?retryWrites=true&w=majority",
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

//Passport
app.use(passport.initialize());
app.use(passport.session());

io.on("connection", async (socket) => {
  console.log("Usuario conectado")

  //* PRODUCTOS
  const products = await producto.getAll()
    socket.emit("productos", products)

    socket.on("new-product", async data =>{
        await producto.save(data.title, data.price, data.thumbnail);
        const products = await producto.getAll()
        io.sockets.emit("productos", products)
    })
  
  //* CHAT
  let messages = await usersMessages.getAll()
  //* Normalización
  const authorSchema = new schema.Entity("authors",{}, {idAttribute: "email"});
  const postSchema = new schema.Entity("post", { author: authorSchema });
  const postsSchema = new schema.Entity("posts", { mensajes: [postSchema] })
  const normMessages = normalize(messages, postsSchema)

  //*EMISIÓN
  socket.emit("mensajes", normMessages);

  //*RECEPCIÓN
  socket.on("newMensaje", async (data) =>{
      const date = new Date().toLocaleString();
      await usersMessages.save(
          date,
          data.text,
          data.email,
          data.lastName,
          data.age,
          data.alias,
          data.avatar
      );

      messages = await usersMessages.getAll();

      //*Normalización
      const authorSchema = new schema.Entity("authors",{}, {idAttribute: "email"});
      const postSchema = new schema.Entity("post", { author: authorSchema });
      const postsSchema = new schema.Entity("posts", { mensajes: [postSchema] })
      const normMessages = normalize(messages, postsSchema)
      
      //*Post emisión
      io.sockets.emit("mensajes", normMessages);
  })
})

// rutas
app.use(homeRouter);
app.use(randomRouter);

DBConnect (()=> {
  const connectedServer = httpServer.listen(8080, () => {
    console.log(
      `Servidor http escuchando en el puerto ${connectedServer.address().port}`
    );
  });
  connectedServer.on("error", (error) =>
    console.log(`Error en servidor ${error}`)
  );
})

