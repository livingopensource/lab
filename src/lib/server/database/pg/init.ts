import { Sequelize } from "sequelize";
import { env } from "$env/dynamic/private";

const sequelize = new Sequelize(env.DBName ?? '', env.User ?? '', env.Password ?? '', {
    host: env.Host ?? '',
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
})

export {sequelize as DBConn}