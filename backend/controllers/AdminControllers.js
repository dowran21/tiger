const database = require("../db/index.js");
const { ComparePassword, GenerateAdminAccessToken, GenerateAdminRefreshToken, HashPassword } = require("../utils/index.js");
const {status} = require("../utils/status")

const Login = async (req, res) =>{
    const {name, password} = req.body;
    const query_text = `
        SELECT * FROM users WHERE name = '${name}'
    `
    try {
        const {rows} = await database.query(query_text, [])
        const user = rows[0];
        if(!user?.id)
            return res.status(status.notfound).send(false)

        let comp = await ComparePassword(password, user.password)
        if(!comp)
            return res.status(status.notfound).send(false)
        let data = {role_id:user.role_id, id:user.id, name:user.name}
        const access_token = await GenerateAdminAccessToken(data);
        const refresh_token = await GenerateAdminRefreshToken(data);
        return res.status(status.success).json({access_token,refresh_token, data})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const LoadAdmin = async (req, res) =>{
    console.log("hello")
    let data = req.user;
    data = {role_id:data.role_id, id:data.id, name:data.name}
    const access_token = await GenerateAdminAccessToken(data);
    const refresh_token = await GenerateAdminRefreshToken(data);
    return res.status(status.success).json({access_token,refresh_token, data})
}

const GetClients = async (req, res) =>{
    const query_text = `
        SELECT c.id, c.logical_ref, c.phone_number, c.address, c.name, f.name AS firm_name 
        FROM clients c
        INNER JOIN firms f
            ON f.id = c.firm_id 
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}   

const GetClientInfo = async (req, res) =>{
    const {id} = req.params;
    const query_text =`
        SELECT c.id, c.phone_number, c.logical_ref, c.address, c.name, c.position[0] AS lat, c.position[1] AS lng
        FROM clients c
        WHERE id = ${id}
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({data:rows[0]})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const UpdateLocation = async (req, res) =>{
    const {id} = req.params;
    const {lat, lng} = req.body;
    const query_text = `
        UPDATE clients SET position = '(${lat}, ${lng})' WHERE id = ${id}
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const AddOperator = async (req, res) =>{
    const {name, password, role_id} = req.body;
    const hash = await HashPassword(password);
    const query_text = `
        INSERT INTO users (name, password, role_id) VALUES ($1, $2, $3)
        RETURNING name, role_id
    `
    try {
        const {rows} = await database.query(query_text, [name, hash, role_id])
        return res.status(status.success).json(rows[0])
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetUsers = async (req, res) =>{
    const query_text = `
        SELECT id, name, role_id 
        FROM users
        WHERE role_id IN (2, 3)
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetSalesMans = async (req, res) =>{
    const {id} = req.params 
    
    const query_text = `
        SELECT (SELECT json_agg(out) FROM (
            SELECT sm.id, sm.name FROM sales_mans sm
            LEFT JOIN user_sls_mans usm
                ON sm.id = usm.sls_man_id
            WHERE usm.id IS NULL
        )out) AS not_included,
            (SELECT json_agg(ins) FROM (
                SELECT sm.id, sm.name, usm.id AS usm_id FROM sales_mans sm
                INNER JOIN user_sls_mans usm
                    ON sm.id = usm.sls_man_id 
            )ins) AS included
    `
    try {
        // console.log(query_text)
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json(rows[0])
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const AddSalesMans = async (req, res) =>{
    const {id} = req.params;
    const data = req.body;
    console.log(data)
    const query_text = `
        INSERT INTO user_sls_mans (user_id, sls_man_id) 
        VALUES ${data.map(item=> `(${id}, ${item.id})`).join(",")}
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).send(false)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const DeleteUSM = async (req, res) =>{
    const {id} = req.params;
    const query_text = `
        DELETE FROM user_sls_mans WHERE id = ${id}
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetSalesManagerForMod = async (req, res) =>{
    const query_text = `
        SELECT 
            s.id
            , s.logical_ref
            , s.name
            , s.code
            , (SELECT firm_id FROM sls_man_firms WHERE sls_man_id = s.id LIMIT 1)
            , (SELECT wh_id FROM sls_man_whs WHERE sls_man_id = s.id LIMIT 1) AS wh_id
        FROM sales_mans s
    
        `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const ChangeSlsManWh = async (req, res) =>{
    const {id} = req.params;
    const {value} = req.body;
    console.log(req.body)
    console.log(id)
    const query_text = `
        INSERT INTO sls_man_whs (wh_id, sls_man_id) 
        VALUES( ${value}, ${id})
        ON CONFLICT (sls_man_id) DO UPDATE SET wh_id = ${value} 
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetWhs = async (req, res) =>{
    const query_text = `
        SELECT id AS value, name AS label, firm_id FROM warehouses
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json({rows})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const UpdateSlsManFirm = async (req, res) =>{
    const {id} = req.params;
    const data = req.body;
    const query_text = `
        UPDATE sls_man_firms SET firm_id = ${data} WHERE sls_man_id = ${id}
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(false)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }

}

const GetClientsForMod = async (req, res) =>{
    const query_text = `

    `
}

const GetSlsManClients = async (req, res) =>{
    const {id} = req.params;
    const query_text = `
        SELECT (SELECT json_agg(out) FROM (
            SELECT c.id, c.name 
            FROM clients c
            LEFT JOIN sls_man_clients slc
                ON slc.client_id = c.id
            WHERE slc.id IS NULL
        )out) AS not_included,
            (SELECT json_agg(ins) FROM (
                SELECT c.id, c.name, slc.id AS usm_id 
                FROM clients c
                INNER JOIN sls_man_clients slc
                    ON c.id = slc.client_id AND slc.sls_man_id = ${id} 
            )ins) AS included
    `
    try {
        const {rows} = await database.query(query_text, [])
        return res.status(status.success).json(rows[0])
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const AddClientsToSlsMan = async (req, res) =>{
    const {id} = req.params;
    const data = req.body
    const query_text = `
        INSERT INTO sls_man_clients (client_id, sls_man_id)
        VALUES ${data.map(item=>`(${item.id}, ${id})`)}
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const DeleteClientFromSls = async (req, res) =>{
    const {id} = req.params
    console.log("hello")
    const query_text = `
        DELETE FROM sls_man_clients WHERE id = ${id}
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const ChangeSlsManFirm = async (req, res) =>{
    const {id} = req.params;
    const {value} = req.body;
    // console.log(value)
    // console.log(id)
    const query_text = `
        INSERT INTO sls_man_firms (sls_man_id, firm_id)
        VALUES (${id}, ${value})
        ON CONFLICT (sls_man_id) DO UPDATE SET firm_id = ${value}
    ` 
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

module.exports = {
    Login,
    LoadAdmin,
    GetClients,
    GetClientInfo,
    UpdateLocation,
    AddOperator,
    GetUsers,
    GetSalesMans,
    AddSalesMans,
    DeleteUSM,
    GetSalesManagerForMod,
    UpdateSlsManFirm,
    GetWhs,
    ChangeSlsManWh,
    GetSlsManClients,
    AddClientsToSlsMan,
    DeleteClientFromSls,
    ChangeSlsManFirm
}