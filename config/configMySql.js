import * as dotenv from "dotenv";
dotenv.config();

const db_client = process.env.DB_CLIENT_SQL || "mysql2"
const db_host = process.env.DB_HOST_SQL || "localhost"
const db_port = Number(process.env.DB_PORT_SQL) || 3306
const db_user = process.env.DB_USER_SQL || "root"
const db_name = process.env.DB_NAME_SQL || "bd_productos"
const db_password = process.env.DB_PASSWORD || "1234back"

const connection = {
    client: `${db_client}`,
    connection: {
        host:`${db_host}`,
        port: `${db_port}`,
        user: `${db_user}`,
        database: `${db_name}`,
        password: `${db_password}`,
    },
};


export default connection;
