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

const FirmMigrations = async (req, res) =>{
    const {firms} = req.body;
    // console.log(firms)
    const query_text = `
        INSERT INTO firms (code, name, logical_ref  )
        VALUES ${firms.map(item=>`(${item.NR}, '${item.NAME}', ${item.LOGICALREF})`).join(",")}
        ON CONFLICT (logical_ref) DO NOTHING 
    `
    try{
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    }catch(e){
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const WareHouseMigration = async (req, res) =>{
    const {wh} = req.body;
    
    const query_text = `
        INSERT INTO warehouses(code, firm_id, name, logical_ref) VALUES 
        ${wh.map(item=> `(${item.NR}, (SELECT id FROM firms WHERE code = ${item.FIRMNR}), '${item.NAME}', ${item.LOGICALREF})`)}
        ON CONFLICT (logical_ref) DO NOTHING
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const UnitMigrations = async (req, res) =>{
    const {units} = req.body;
    // console.log(units)
    let insert_units_query = `
        INSERT INTO measurements (measurement, measure_code, firm_id, unitsetref, linenr) VALUES
        ${units.map(item =>`('${item.NAME}', '${item.CODE}', 
            (SELECT id FROM firms WHERE logical_ref = ${item.firm_logical_ref}), ${item.UNITSETREF}, ${item.LINENR})` 
            ).join(",")} 
    `
    try {
        console.log(insert_units_query)
        await database.query(insert_units_query, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }

}

const CurrencyMigrations = async (req, res) =>{
    const {currencies} = req.body;
    const query_text = `
        INSERT INTO currency(logical_ref,  type, code, name)
        VALUES ${currencies.map(item=>`(${item.LOGICALREF},  ${item.CURTYPE}, '${item.CURCODE}', '${item.CURNAME}' )`).join(",")}
    `
    try {
        console.log(query_text)
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const CategoryMigrations = async (req, res) =>{
    const {categories} = req.body;
    const query_text = `    
        INSERT INTO categories (name, logical_ref, lowlevelcode, firm_id) VALUES 
        ${categories?.map(item=> `('${item.NAME}', ${item.LOGICALREF}, ${item.LOWLEVELCODES1}, 
        (SELECT id FROM firms WHERE logical_ref = ${item.firm_logical_ref})
        )`).join(",")}    
        ON CONFLICT (firm_id, logical_ref) DO NOTHING 
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const AddItems = async (req, res) =>{
    const {items} = req.body;
    const query_text = `
        INSERT INTO items (code, logical_ref, name, firm_id, measurement_id, category_id, price, currency) VALUES 
        ${items.map(item => `('${item.CODE}', ${item.LOGICALREF}, '${item.NAME}', \
        (SELECT id FROM firms WHERE logical_ref = ${item.firm_logical_ref}), 
        (SELECT m.id FROM measurements m WHERE m.unitsetref = ${item.UNITSETREF} AND firm_id = (SELECT id FROM firms WHERE logical_ref = ${item.firm_logical_ref})), 
        (SELECT id FROM categories WHERE lowlevelcode = ${item.LOWLEVELCODES1} ), ${item.PRICE}, 
        (SELECT id FROM currency WHERE type = ${item.CURRENCY} LIMIT 1))
        `).join(",")}
        ON CONFLICT (firm_id, logical_ref) DO UPDATE SET category_id = EXCLUDED.category_id, price = EXCLUDED.price
    `
    try {
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const StockMigrate = async (req, res) =>{
    const {stocks} = req.body;
    const query_text = `
        INSERT INTO wh_items(product_id, wh_id, stock)
        VALUES ${stocks?.map(item=>`
        ((SELECT i.id FROM items i WHERE i.logical_ref = ${item.STOCKREF} 
                AND i.firm_id = (SELECT f.id FROM firms f WHERE f.logical_ref = ${item.firm_logical_ref} )),
            (SELECT w.id FROM warehouses w WHERE w.code = ${item.INVENNO} AND w.firm_id = (SELECT f.id FROM firms f WHERE f.logical_ref = ${item.firm_logical_ref} )),
            ${item.ONHAND}
        )
        `).join(",")}
        ON CONFLICT (product_id, wh_id) DO UPDATE SET stock = EXCLUDED.stock
    `
    try {
        // console.log(query_text)
        await database.query(query_text, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const GetOrders = async (req, res) =>{
    console.log('hello')
    const query_text = `
        SELECT 
            o.id
            , (SELECT c.logical_ref FROM clients c WHERE c.id = o.client_id) AS client_ref
            , (SELECT sm.logical_ref FROM sales_mans sm WHERE sm.id = o.sls_man_id) AS sales_man_ref
            , (SELECT f.code FROM firms f WHERE f.id = o.firm_id) AS firm_code
            , o.discount
            , (SELECT sum(price*count)::text FROM order_items oi WHERE oi.order_id = o.id) AS total
            , (SELECT json_agg(ite) FROM (
                SELECT 
                    i.logical_ref
                    , oi.price 
                    , oi.count
                FROM order_items oi
                    INNER JOIN items i
                        ON i.id = oi.item_id AND i.firm_id = o.firm_id
                WHERE oi.order_id = o.id
            )ite) AS items
        FROM orders o
        WHERE o.status = 2 AND delivered = false
    `
    try {
        const {rows} = await database.query(query_text, [])
        if(rows?.length){
            await database.query(`UPDATE orders SET delivered = true WHERE id IN (${rows?.map(item=>item.id).join(",")})`);
        }
        return res.status(status.success).json({rows:rows.filter(item=>item.items?.length)})
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const Migrations = async (req, res) =>{
    const discount = 150;
    const client = 16
    const accountRef = 337
    const discounted = 337
    const grostotal = 1770
    const nettotal = 5400
    const sales_man_ref = 5;
    const trnet = 3;
    const insert_query = `
    INSERT INTO LG_001_01_ORFICHE 
    (
        "LOGICALREF"
        ,"TRCODE"
        ,"FICHENO"
        ,"DATE_"
        ,"TIME_"
        ,"DOCODE"
        ,"SPECODE"
        ,"CYPHCODE"
        ,"CLIENTREF"
        ,"RECVREF"
        ,"ACCOUNTREF"
        ,"CENTERREF"
        ,"SOURCEINDEX"
        ,"SOURCECOSTGRP"
        ,"UPDCURR"
        ,"ADDDISCOUNTS"
        ,"TOTALDISCOUNTS"
        ,"TOTALDISCOUNTED"
        ,"ADDEXPENSES"
        ,"TOTALEXPENSES"
        ,"TOTALPROMOTIONS"
        ,"TOTALVAT"
        ,"GROSSTOTAL"
        ,"NETTOTAL"
        ,"REPORTRATE"
        ,"REPORTNET"
        ,"GENEXP1"
        ,"GENEXP2"
        ,"GENEXP3"
        ,"GENEXP4"
        ,"EXTENREF"
        ,"PAYDEFREF"
        ,"PRINTCNT"
        ,"BRANCH"
        ,"DEPARTMENT"
        ,"STATUS"
        ,"CAPIBLOCK_CREATEDBY"
        ,"CAPIBLOCK_CREADEDDATE"
        ,"CAPIBLOCK_CREATEDHOUR"
        ,"CAPIBLOCK_CREATEDMIN"
        ,"CAPIBLOCK_CREATEDSEC"
        ,"CAPIBLOCK_MODIFIEDBY"
        ,"CAPIBLOCK_MODIFIEDDATE"
        ,"CAPIBLOCK_MODIFIEDHOUR"
        ,"CAPIBLOCK_MODIFIEDMIN"
        ,"CAPIBLOCK_MODIFIEDSEC"
        ,"SALESMANREF"
        ,"SHPTYPCOD"
        ,"SHPAGNCOD"
        ,"GENEXCTYP"
        ,"LINEEXCTYP"
        ,"TRADINGGRP"
        ,"TEXTINC"
        ,"SITEID"
        ,"RECSTATUS"
        ,"ORGLOGICREF"
        ,"FACTORYNR"
        ,"WFSTATUS"
        ,"SHIPINFOREF"
        ,"CUSTORDNO"
        ,"SENDCNT"
        ,"DLVCLIENT"
        ,"DOCTRACKINGNR"
        ,"CANCELLED"
        ,"ORGLOGOID"
        ,"OFFERREF"
        ,"OFFALTREF"
        ,"TYP"
        ,"ALTNR"
        ,"ADVANCEPAYM"
        ,"TRCURR"
        ,"TRRATE"
        ,"TRNET"
        ,"PAYMENTTYPE"
        ,"ONLYONEPAYLINE"
        ,"OPSTAT"
        ,"WITHPAYTRANS"
        ,"PROJECTREF"
        ,"WFLOWCRDREF"
        ,"UPDTRCURR"
        ,"AFFECTCOLLATRL"
        ,"POFFERBEGDT"
        ,"POFFERENDDT"
        ,"REVISNR"
        ,"LASTREVISION"
        ,"CHECKAMOUNT"
        ,"SLSOPPRREF"
        ,"SLSACTREF"
        ,"SLSCUSTREF"
        ,"AFFECTRISK"
        ,"TOTALADDTAX"
        ,"TOTALEXADDTAX"
        ,"APPROVE"
        ,"APPROVEDATE"
    )
    VALUES (
        (SELECT MAX(LASTREF) FROM LG_001_01_ORFICHESEQ WHERE ID = 1 ) + 1,
        1,
        000000000000000005,
        SYSDATETIME(),
        'DENEME-01',
        NULL,
        NULL,
        ${client},
        0,
        ${accountRef},
        0,
        0,
        0,
        0,
        ${discount},
        ${discount},
        ${discounted},
        0,
        0,
        0,
        0,
        0,
        ${grostotal},
        ${nettotal},
        0,
        0,
        null,
        null,
        null,
        null,
        0,
        0,
        0,
        0,
        0,
        2,
        SYSDATETIME(),
        18,
        19,
        34,
        0,
        null,
        0,
        0,
        0,
        ${sales_man_ref},
        null,
        null,
        1,
        0,
        null,
        0,
        0,
        2,
        0,
        0,
        0,
        0,
        null,
        0,
        0,
        null,
        0,
        null,
        0, 
        0,
        0,
        0,
        0,
        0,
        0,
        ${trnet},
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        NULL,
        NULL,
        '',
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        NULL     
    `
    console.log(query_text)
}

const ClientMigrations = async (req, res) =>{
    const {clients} = req.body;
    const insert_clients = `
                    INSERT INTO clients (logical_ref, phone_number, address, card_type, firm_id, code, name)
                    VALUES ${clients.map(item => `
                        (${item.LOGICALREF}, ${item.TELNR1 ? `'${item.TELNR1.replaceAll("'", "''")}'` :`NULL` }, ${item.ADDR1 ? `'${item.ADDR1?.replaceAll("'", "''")}'` :`NULL` }
                        , ${item.CARDTYPE}, (SELECT id FROM firms WHERE logical_ref = ${item.firm_logical_ref}), '${item.CODE?.replaceAll("'", "''")}', '${item.DEFINITION_?.replaceAll("'", "''")}'
                        )
                    `).join(",")}
                `
    try {
        // console.log(insert_clients)
        await database.query(insert_clients, [])
        return res.status(status.success).send(true)
    } catch (e) {
        console.log(e)
        return res.status(status.error).send(false)
    }
}

const SLSManMigration = async (req, res) =>{
    const {sls_mans} = req.body;
    const insert_query = `
        INSERT INTO sales_mans (logical_ref, code, name, spec_code) 
        VALUES ${sls_mans.map(item=>`(${item.LOGICALREF}, '${item.CODE}', '${item.DEFINITION_}', '${item.SPECODE}' )`).join(",")}
    `
    try {
        await database.query(insert_query, [])
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
    ChangeSlsManFirm,
    CategoryMigrations,
    Migrations,
    FirmMigrations,
    GetOrders,
    WareHouseMigration,
    UnitMigrations,
    CurrencyMigrations,
    AddItems,
    StockMigrate,
    ClientMigrations,
    SLSManMigration
}