const database = require("../db/index.js")
const {status} = require("../utils/status.js")
const {GenerateAdminAccessToken, GenerateAdminRefreshToken} = require("../utils/index")
const path = require("path")
const admin = require("firebase-admin");
require("dotenv").config()

const FIREBASE_DATABASE_URL = "https://tiger-561c8-default-rtdb.firebaseio.com";
const account = require(process.env.PATH_TO_PUSH)

admin.initializeApp({
    credential: admin.credential.cert(account),
    databaseURL:FIREBASE_DATABASE_URL
})


const UserLogin = async (req, res) =>{
    // console.log(response)
    const {name, password} = req.body;
    console.log(req.body)
    const query_text = `
        SELECT * FROM sales_mans WHERE name = '${name}' AND password = '${password}'
    `
    try {
        const {rows} = await database.query(query_text)
        if(!rows.length){
            const message = "Telefon ýa-da parol ýalňyş" 
            return res.status(status.notfound).json({message, status:404})
        }
        const user = {id:rows[0]?.id, name:rows[0]?.name, code:rows[0]?.code}
        const access_token = await GenerateAdminAccessToken(user)
        const refresh_token = await GenerateAdminRefreshToken(user)
        return res.status(status.success).json({access_token, refresh_token, data:user})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const LoadUser = async (req, res) =>{
    const user = req.user;
    const access_token = await GenerateAdminAccessToken(user)
    const refresh_token = await GenerateAdminRefreshToken(user)
    return res.status(status.success).json({access_token, refresh_token, data:user})
}

const GetUserClients = async (req, res) =>{
    const id = req.user.id;
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
            ON smc.client_id = c.id AND smc.sls_man_id = ${id}
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetProducts = async (req, res)=>{
    const {page, limit, search, category_id} = req.query
    let offSet = ``
    if(page && limit){
        offSet = `OFFSET ${(page-1)*limit} LIMIT ${limit}`
    }
    let wherePart = ``
    if(search){
        wherePart += `AND i.name ~* '${search}'`
    }
    if(category_id){
        wherePart += ` AND i.category_id = ${category_id}`
    }else{
        wherePart += ` AND i.category_id IS NULL`
    }
    const user_id = req.user?.id;
    const query_text = `
        SELECT i.name, i.code, m.measurement, price, i.stock, c.code AS currency_name, i.id::integer, 0::integer AS count
        FROM items i
            INNER JOIN measurements m
                ON m.id = i.measurement_id AND i.firm_id = m.firm_id
            INNER JOIN currency c
                ON c.id = i.currency AND c.firm_id = i.firm_id
            INNER JOIN sls_man_firms sl
                ON sl.firm_id = i.firm_id AND sl.sls_man_id = ${user_id}
            WHERE i.id > 0 ${wherePart}
        ${offSet}
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetFirms = async (req, res) =>{
    const query_text = `
        SELECT id AS value, name AS label, code FROM firms
    `
    try {
        const {rows} = await database.query(query_text, [])
        // let firms = {}
        // rows.map(item => firms[item.id] = `${item.code} ${item.name} `)
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const CreateOrder = async (req, res) =>{
    let {orders} = req.body;
    // orders = orders[0]
    const {id} = req.user
    console.log(orders)
    orders.map(async (order) => {
        const {products, client_id, created_at, discount} = order;
        const sls_man_id = req.user.id;
        // console.log(req.body)
        console.log(products, client_id)
        const query_text = `
            WITH inserted AS (
                INSERT INTO orders (client_id, firm_id, supervisor_id, sls_man_id, status, created_at, discount)
                VALUES (${client_id}, (SELECT firm_id FROM sls_man_firms WHERE sls_man_id = ${sls_man_id} LIMIT 1), 
                    (SELECT user_id FROM user_sls_mans WHERE sls_man_id = ${sls_man_id}), ${sls_man_id}, 0, ${created_at ? `'${created_at}'::date` : "'now()'"}
                    , ${discount}
                    ) RETURNing *
            ), inserted_products AS (
                INSERT INTO order_items(item_id, order_id, price, count)
                VALUES ${products?.map(item=>`(${item.id}, (SELECT id FROM inserted), (SELECT price FROM items WHERE id = ${item.id}), ${item.count})`)}
            ) SELECT id FROM inserted
        `
        try {
            const {rows} = await database.query(query_text, [])
            const select_query = `
                SELECT * FROM users u 
                    INNER JOIN user_sls_mans usm
                        ON usm.sls_man_id = ${id} AND usm.user_id = u.id 
            `
            const us = await database.query(select_query, [])
            if(us[0]){
                const token = us[0]?.fcm_token;
                const title = "Sargyt geldi";
                const body = `Sargydy gormegi sizden hayysh edyarin`;
                const data = {title:"hello", body:"hello", destination:"hello"}
                const message = {data, notification: {body, title}}
                admin.messaging().sendToDevice(token, message)
            } 
            console.log(rows[0].id)
        } catch (e) {
            console.log(query_text)
            console.log(e)
            // continue m;
        }
    })
    return res.status(status.success).send(true)
        
}

const GetOrders = async (req, res) =>{
    // const {id} = req.params;
    const {id} = req.user
    const query_text = `
        SELECT o.id::text
            , status::integer
            , to_char(o.created_at, 'DD.MM.YYYY') AS created_at
            , (SELECT sum(price)::text FROM order_items oi WHERE oi.order_id = o.id) AS total
            , c.name 
        FROM orders o
        INNER JOIN clients c
            ON c.id = o.client_id 
        WHERE sls_man_id = ${id} AND o.status <> 2
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }

}

const GetOrderByID = async (req, res) =>{
    const {id} = req.params;
    const query_text = `
        SELECT 
            o.id
            , o.created_at
            , o.supervisor_observerd
            , o.status
            , o.discount
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

const EditOrder = async (req, res) =>{
    const {id} = req.params;
    const products = req.body;
    console.log(req.body)
    console.log(products)
    const query_text = `
        WITH ${products?.map((item, index)=>`
            updated${index} AS (
                UPDATE order_items SET count = ${item.count} WHERE id = ${item.order_item_id}
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

const GetCategories = async (req, res) =>{
    const query_text = `
        SELECT * FROM categories
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
    UserLogin,
    LoadUser,
    GetUserClients,
    GetProducts,
    GetFirms,
    CreateOrder,
    GetOrders,
    GetOrderByID,
    EditOrder,
    GetCategories
}