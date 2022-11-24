import knex from "knex";
import connection from "./configMySql.js";
const KnexMySql = new knex (connection);


KnexMySql.schema
    .createTable("productos", (table) => {
        table.increments("id")
        table.string("title")
        table.integer("price")
        table.string("thumbnail")
    }).then (() =>{
        console.log("Tabla de productos creada!")
    }).catch (e => console.log(e))
    .finally(()=> KnexMySql.destroy());
