// const mysql = require("mysql2");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-1", "root", "Brown27A1", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-1",
//   password: "Brown27A1",
// });

// module.exports = pool.promise();
// https://api.army.mil/e2/c/images/2020/11/19/118ede88/max1200.jpg
