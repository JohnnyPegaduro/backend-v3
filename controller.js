import mongoose from "mongoose";

export const DBConnect = (cb) =>{
    mongoose.connect ("mongodb+srv://Johnny:4321@codercluster.nvlvgso.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true},
        (err)=> {
            console.log("Conectado!");
            if (err) {
                console.log(err)
            }
            cb();
        })
}

export const Users = mongoose.model("users", {
    username: String,
    password: String,
    email: String,
});