const sequelize = new Sequelize("node-1", "root", "Brown27A1", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
