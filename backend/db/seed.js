const database = require('./index.js')
const {HashPassword} = require('../utils/index.js')
const CreateAdmin = async () => { 
    const password = '61123141dow';
    const hashed_password = await HashPassword(password);
    const query_text = `
        INSERT INTO users(role_id, name, password)
            VALUES (1, 'Dowran', '${hashed_password}' )
    `
    try {
        await database.query(query_text, [])
    } catch (e) {
        console.log(e)
        throw e
    }
}

CreateAdmin()