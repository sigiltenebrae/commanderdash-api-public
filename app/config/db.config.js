module.exports = {
    HOST: "192.168.1.15",
    USER: "mtgadmin",
    PASSWORD: "pinkfluffyunicorns",
    DB: "mtg-data",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};