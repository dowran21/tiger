// const dbconst = require('../utils/consts.js')
const Pool = require('pg').Pool;

const pool = new Pool(
{
  user:  'dowran',
  host:  'localhost',
  database:  'tiger',
  password:  '61123141dow',
  port:  5432,
});    
  
   
module.exports = {
  pool,
  async query(text, params) {
    const res = await pool.query(text, params)
    // console.log(res)
    return res
  },
  async queryTransaction(query_list){
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
    try {
      await client.query('BEGIN');
      let response = [];
      for (const {text, params} of query_list) {
        const {rows} = await client.query(text, params);
        response = response.concat(rows);
      }
      await client.query('COMMIT');
      return response;
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }  
};

