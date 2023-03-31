const database = require("../db/index.js");
const { ComparePassword, GenerateAdminAccessToken, GenerateAdminRefreshToken } = require("../utils");
const { status } = require("../utils/status.js");

const Login = async (req, res) =>{
    const {name, password} = req.body;
    const query_text = `
        SELECT * FROM users WHERE role_id IN (2, 3) AND name = $1
    `
    try {
        const {rows} = await database.query(query_text, [name])
        if(!rows[0]){
            return res.status(422).send("incoorect credentials")
        }
        const user = rows[0]
        const compare = await ComparePassword(password, user.password)
        if(!compare){
            return res.status(422).send("incoorect credentials")
        }
        const data = {id:user.id, role_id:user.role_id, name:user.name}
        const access_token = await GenerateAdminAccessToken(data);
        const refresh_token = await GenerateAdminRefreshToken(data);
        return res.status(status.success).json({access_token, refresh_token, data})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetOrders = async (req, res) =>{
    const {id} = req.user
    const query_text = `
        SELECT o.id::text
            , status::integer
            , to_char(o.created_at, 'DD.MM.YYYY') AS created_at
            , (SELECT sum(price)::text FROM order_items oi WHERE oi.order_id = o.id) AS total
            , c.name 
        FROM orders o
        INNER JOIN user_sls_mans usm
            ON usm.sls_man_id = o.sls_man_id AND usm.user_id = ${id}
        INNER JOIN clients c
            ON c.id = o.client_id
    `
    try{
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    }catch(e){
        console.log(e)
        return res.status(status.error).send(false)
    }

}

const UpdateOrder = async (req, res) =>{
    const {id} = req.params;
    const {products, status_id} = req.body;
    console.log(req.body)
    console.log(products)
    const query_text = `
        WITH updated_order AS(
            UPDATE orders SET status = ${status_id} WHERE id = ${id}
         ) ${products?.length ? "," : ""} ${products?.map((item, index)=>`
            updated${index} AS (
                UPDATE order_items SET supervisor_count = ${item.sp_count} WHERE id = ${item.order_item_id}
            )
        `).join(",")}
         SELECT 1
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetOrderById = async (req, res) =>{
    const {id} = req.params
    const query_text = `
    SELECT 
        o.id
        , o.created_at
        , o.supervisor_observerd
        , o.status
        ,(SELECT json_agg(it) FROM (
            SELECT 
                i.name
                , oi.price
                , oi.count
                , oi.id AS order_item_id
                , oi.supervisor_count
            FROM items i
                INNER JOIN order_items oi
                    ON oi.item_id = i.id AND oi.order_id = o.id
        )it) AS items
    FROM orders o
        WHERE o.id = ${id}
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetClients = async (req, res) =>{
    const {id} = req.user;
    // const id = 4
    const query_text = `
        SELECT 
            c.name
            , c.phone_number
            , c.address
            , c.code
            , c.id
            , c.position[0] AS lat
            , c.position[1] AS lng
            , 15::text AS debit
            , 12::text AS kredit

        FROM clients c
        INNER JOIN sls_man_clients smc
            ON smc.client_id = c.id
        INNER JOIN user_sls_mans usm
            ON usm.user_id = ${id} AND usm.sls_man_id = smc.sls_man_id
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

module.exports = {
    Login,
    GetOrders,
    UpdateOrder,
    GetOrderById,
    GetClients
}