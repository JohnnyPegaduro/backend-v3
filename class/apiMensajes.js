import fs from "fs";

class Message {
    constructor (file){
        this.file = file;
    }

    //* ver mensajes
    async getAll(){
        try {
            const data = await fs.promises.readFile(this.file, "utf-8");
            const mensajes = JSON.parse(data);
            return mensajes;
        } catch (e){
            console.log(e);
        }
    }

    //* crear mensaje
    async save(date, text, email, name, lastName, age, alias, avatar) {
        try {
            const data = await fs.promises.readFile(this.file, "utf-8");
            const dataParse = JSON.parse(data);
            const newId = dataParse.mensajes.length +1;
            const newMessage = {
                id: `${newId}`,
                date,
                text,
                author: {
                    email,
                    name,
                    lastName,
                    age,
                    alias,
                    avatar
                },
            }
            dataParse.mensajes.push(newMessage);
            const dataString = JSON.stringify(dataParse);
            await fs.promises.writeFile(this.file, dataString);
        } catch (e) {
            console.log(e);
        }
    }
}

export default Message;