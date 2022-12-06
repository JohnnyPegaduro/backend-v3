import { Router } from "express";
import { fork } from "child_process"

const randomNumRouter = new Router ();

randomNumRouter.get("/", (req, res) =>{
    const forked = fork("./scripts/getRandomNum.js");
    const { cant } = req.query;
    let cantEnv;
    if (cant) {
        cantEnv = cant;
    } else {
        cantEnv = 100000000;
    }
    
    forked.send(cantEnv);

    forked.on("message", (message) => {
        res.send(message);
    });
});

export default randomNumRouter; 