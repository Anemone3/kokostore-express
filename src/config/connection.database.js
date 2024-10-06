import pg from 'pg'
import fs from 'fs'
import dotenv from 'dotenv';
const { Pool } = pg
dotenv.config();


export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('src/certs/ca.crt').toString()
  }
})

pool.connect((err, client, release) => {
    if(err){
        console.log("Error de conexion",err.stack);
    }else{
        console.log("Conexión exitosa");
        release()
    }
}) 