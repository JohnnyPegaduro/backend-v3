import { Router } from "express";
import path from "path";
import { cpus } from "os";
//import compression from "compression";

const infoRouter = new Router();

const argumentos = process.execArgv;
const plataforma = process.platform;
const version = process.version;
const memoria = process.memoryUsage();
const pathExe = process.execPath;
const processId = process.pid;
const carpeta = process.cwd();
const procesadores = cpus().length;

//* Sin compresión 179B
//* Con compresión 1.2KB
infoRouter.get("/info", (req, res) =>{
    res.render(path.join(process.cwd(), "/views/pages/info.ejs"), {
        argumentos: argumentos,
        plataforma: plataforma,
        version: version,
        memoria: memoria.rss,
        pathExe: pathExe,
        processId: processId,
        carpeta: carpeta,
        procesadores: procesadores,
    });
});

export default infoRouter;