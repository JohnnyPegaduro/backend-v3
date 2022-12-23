import knex from 'knex';
import logger from "../config/configLog4Js.js";


class Product {
    constructor(connection, table) {
        this.KnexProducts = knex(connection);
        this.table = table;
    }

    async getAll () {
        try {
            return await this.KnexProducts.select("*").from(this.table)
        }
        catch (e) {
            logger.error(`Api de productos: ${e}`);
        }
    }

    async save (title, price, thumbnail){
        try {
            const newProduct = {
                title,
                price,
                thumbnail
            }
            return await this.KnexProducts.insert(newProduct).into(this.table)
        } catch (e) {
            logger.error(`Api de productos: ${e}`);
        }
    }
}


export default Product;