import Message from "../class/apiMensajes.js";
import {normalize,schema} from "normalizr";

const usersMessages = new Message("./data/mensajes.json")
let messages = await usersMessages.getAll()

export default async function socketMensajes(socket, sockets) {
    //* Normalización
    const authorSchema = new schema.Entity("authors", {}, {
        idAttribute: "email"
    });
    const postSchema = new schema.Entity("post", {
        author: authorSchema
    });
    const postsSchema = new schema.Entity("posts", {
        mensajes: [postSchema]
    })
    const normMessages = normalize(messages, postsSchema)


    //*EMISIÓN
    socket.emit("mensajes", normMessages);

    //*RECEPCIÓN
    socket.on("newMensaje", async (data) => {
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
        const authorSchema = new schema.Entity("authors", {}, {
            idAttribute: "email"
        });
        const postSchema = new schema.Entity("post", {
            author: authorSchema
        });
        const postsSchema = new schema.Entity("posts", {
            mensajes: [postSchema]
        })
        const normMessages = normalize(messages, postsSchema)

        //*Post emisión
        sockets.emit("mensajes", normMessages);
    })
}