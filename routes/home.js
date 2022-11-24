import { Router } from "express";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Users } from "../controller.js";
import path from "path";

const homeRouter = new Router();

const authMW = (req,res, next) =>{
    req.isAuthenticated() ? next () : res.send({error: true, msg: "Sin sesión"})
};

//* Estrategia de registro
passport.use("signup", new localStrategy ({
    passReqToCallback: true
}, (req, username, password, done) =>{
    const { email } = req.body;
    Users.findOne ({username}, (err, user)=> {
        if (user) return done(null, false);

    Users.create({username, password: hasPassword (password), email}, (err, user) => {
            if (err) return done(err);
            return done(null, user);
        })
    })
}))

//* Estrategia de login
passport.use("login", new localStrategy({}, ( username, password, done) =>{
    Users.findOne({username}, (err, user)=>{
        if (err) return done(err);
        if (!user) return done(null, false);
        if(!validatePass(password, user.password)) return done(null,false);
        return done(null, user);
    })
}))

//* Encriptación de contraseña
const hasPassword = (pass) =>{
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};

const validatePass = (pass, hashedPass) => {
    return bcrypt.compareSync(pass,hashedPass);
};

//* Almacenar la información
passport.serializeUser((user, done) => {
    done (null, user._id)
})

passport.deserializeUser((id, done)=>{
    Users.findById(id, done);
})

//* Rutas
homeRouter.get("/", (req, res) => {
    if (req.isAuthenticated()){
        const username = req.user.username;
        const email = req.user.email;
        res.render(path.join(process.cwd(), "/views/pages/home.ejs"), { username: username, email: email });
    } else {
        res.redirect("/login");
    }
});

homeRouter.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        res.render(path.join(process.cwd(), "/views/pages/login.ejs"));
    }
});

homeRouter.get("/signup", (req,res) => {
    res.render(path.join(process.cwd(), "/views/pages/signup.ejs"), {
        okRegister: "",
    });
})

homeRouter.post("/signup", passport.authenticate("signup", {failureRedirect:"/errorSignUp"}), (req,res) => {
    res.render(path.join(process.cwd(), "/views/pages/signup.ejs"), {
        okRegister: "¡Usuario registrado con éxito! Puede iniciar sesión",
    });
});

homeRouter.post("/login", passport.authenticate("login", {failureRedirect:"/errorLogin"}), (req, res) => {
    res.redirect("/");
});

homeRouter.get("/logout", (req, res) =>{
    const username = req.user.username;
    req.logout((err) =>{
        if (err) {
            return next (err);
        }
        res.render("pages/logout.ejs", { username: username });
    });
})

homeRouter.get("/datos", authMW, (req,res) =>{
    res.send({error: false, data:req.user})
})

homeRouter.get("/errorLogin", (req, res) => {
    res.render(path.join(process.cwd(), "/views/pages/errorLogin.ejs"));
})

homeRouter.get("/errorSignUp", (req, res) => {
    res.render(path.join(process.cwd(), "/views/pages/errorSignUp.ejs"));
})


export default homeRouter;