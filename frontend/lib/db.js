import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

let pool;

export const createConnection = async () => {
  if (!pool) {
    const caCertPath = path.join(process.cwd(),"frontend", "certs", "ca.pem");

    pool = mysql.createPool({
      host: process.env.HOST,           // e.g. smartcitydb-shaikmuzammil1427-eac2.e.aivencloud.com
      port: Number(process.env.PORT),   // 21941
      user: process.env.USER,           // avnadmin
      password: process.env.PASSWORD,   // your password
      database: process.env.DB_NAME,    // defaultdb
      ssl: {
        ca: fs.readFileSync(caCertPath),  // required for Aiven SSL
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log("MySQL connection pool established (Aiven)");
  }
  return pool;
};
