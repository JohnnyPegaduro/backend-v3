import Product from "../class/productClass.js";
import connection from "../config/configMySql.js";

const producto = new Product(connection, "productos");

export default async function socketProductos(socket, sockets) {
    const products = await producto.getAll()
    socket.emit("productos", products)

    socket.on("new-product", async data => {
        await producto.save(data.title, data.price, data.thumbnail);
        const products = await producto.getAll()
        sockets.emit("productos", products)
    })
}