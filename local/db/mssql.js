const mssql = require("mssql");


const sqlConfig = {
    user: "dowran",
    password: "61123141dow",
    database: "rustem",
    server: 'localhost',
    port:1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
  }
// const pool = new mssql.ConnectionPool(sqlConfig)
module.exports = {
    async query (query_text) {
        const pool = await mssql.connect(sqlConfig)
        return await pool.request().query(query_text)
    }
}