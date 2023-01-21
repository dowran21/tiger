const database = require("./index")
const ms_db = require("./mssql")
// const database = require("./index")

const Migrations = async () =>{
    const query_text = `SELECT * FROM L_CAPIFIRM`;
    try {
        const res = await ms_db.query(query_text);
        const firms = res.recordsets[0];
        // console.log(firms) // LOGICALREF, NR, NAME
        let insert_firms = `
            INSERT INTO firms (code, name, logical_ref) VALUES 
            ${firms.map(item => `(${item.NR}, '${item.NAME}', ${item.LOGICALREF})`)}
        `
        // await database.query(insert_firms, []); //need this for migrations
        // insert of warehouse
        let select_query = `
            SELECT * FROM L_CAPIWHOUSE
        `
        try {
            const resp = await ms_db.query(select_query);
            const wh = resp.recordsets[0]
            // console.log(wh)
            let insert_warehouses = `
                INSERT INTO warehouses(code, firm_id, name, logical_ref) VALUES 
                ${wh.map(item=> `(${item.NR}, (SELECT id FROM firms WHERE code = ${item.FIRMNR}), '${item.NAME}', ${item.LOGICALREF})`)}
            `            
            // await database.query(insert_warehouses);
        } catch (e) {
            console.log(e)
            
        }
        // insert of units
        let unit_firms = [];
        try {
            const select_firms = `
                SELECT * FROM firms
            `
            const {rows} = await database.query(select_firms, [])
            unit_firms = rows;
        } catch (e) {
            console.log(e)
        }
        for await (const firm of unit_firms){
            let nr = firm.code < 10 ? `00`+firm.code : firm.code < 100 ? `0`+firm.code : firm.code
            // console.log(nr)
            const select_units = `
               SELECT DISTINCT UNITSETREF, NAME, LOGICALREF, CODE, LINENR
               FROM LG_${nr}_UNITSETL
            `    
            try {
                const resp = await ms_db.query(select_units);
                const units = resp.recordsets[0]
                const insert_units = [];
                let arr = [];
                for await (const unit of units ){
                    if(!arr.includes(unit.UNITSETREF)){
                        arr.push(unit.UNITSETREF);
                        insert_units.push(unit)
                    }
                }
                let insert_units_query = `
                    INSERT INTO measurements (measurement, measure_code, firm_id, unitsetref, linenr) VALUES
                    ${insert_units.map(item =>`('${item.NAME}', '${item.CODE}', ${firm.id}, ${item.UNITSETREF}, ${item.LINENR})` )} 
                    `
                // await database.query(insert_units_query, [])
            } catch (e) {
                console.log(e)
            }
        }
        //------------------------------------------ insert of items ------------------------------------------//
        for await (const firm of unit_firms){
            let nr = firm.code < 10 ? `00`+firm.code : firm.code < 100 ? `0`+firm.code : firm.code;
            const select_items_query = `
                SELECT * FROM LG_${nr}_ITEMS
            `
            try {
                const resp = await ms_db.query(select_items_query);
                let products = resp.recordsets[0];
                products = products.filter(item=> item.NAME?.length > 0)
                const insert_items = `
                    INSERT INTO items (code, logical_ref, name, firm_id, measurement_id) VALUES 
                    ${products.map(item => `('${item.CODE}', ${item.LOGICALREF}, '${item.NAME}', ${firm.id}, 
                    (SELECT m.id FROM measurements m WHERE m.unitsetref = ${item.UNITSETREF} AND firm_id = ${firm.id}))
                    `).join(",")}
                `
                // console.log(insert_items)
                if(products.length > 0){
                    // await database.query(insert_items, [])
                }
            } catch (e) {
                console.log(e)
            }
        }
        try {
            let select_periods = `
                SELECT *  FROM L_CAPIPERIOD
            `
            let periods = []
            try {
                const resp = await ms_db.query(select_periods);
                periods = resp.recordsets[0]
                let insert_period = `
                    INSERT INTO firm_periods (start_date, end_date, firm_id, logical_ref, code) 
                    VALUES ${periods.map(item=>
                        {
                            const begin = new Date(item.BEGDATE);
                            const end = new Date(item.ENDDATE);
                            // console.log(begin)
                            return `('${begin.getFullYear()}-${begin.getMonth()+1}-${begin.getDate()}'::date,'${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()}'::date , (SELECT id FROM firms 
                                WHERE code = ${item.FIRMNR}), ${item.FIRMNR}, ${item.NR})`}
                                )}
                `
                // console.log(insert_period)
                // await database.query(insert_period, [])
            } catch (e) {
                console.log(e)
            }
            //// insert clients
        } catch (e) {
            
        }
        try {
            for await (const firm of unit_firms){
                let nr = firm.code < 10 ? `00`+firm.code : firm.code < 100 ? `0`+firm.code : firm.code;
                const resp = await ms_db.query( `
                    SELECT * FROM LG_${nr}_CLCARD
                `);
                // console.log(resp)
                const clients = resp?.recordsets[0].filter(item => item.CODE!=='я');
                const insert_clients = `
                    INSERT INTO clients (logical_ref, phone_number, address, card_type, firm_id, code, name)
                    VALUES ${clients.map(item => `
                        (${item.LOGICALREF}, ${item.TELNR1 ? `'${item.TELNR1.replaceAll("'", "''")}'` :`NULL` }, ${item.ADDR1 ? `'${item.ADDR1.replaceAll("'", "''")}'` :`NULL` }
                        , ${item.CARDTYPE}, ${firm.id}, '${item.CODE?.replaceAll("'", "''")}', '${item.DEFINITION_.replaceAll("'", "''")}'
                        )
                    `).join(",")}
                `
                // console.log(insert_clients)
                if(clients.length){
                    // await database.query(insert_clients, [])
                }
                

            }
        } catch (e) {
            console.log(e)
        };
        try {
            const select_query = `
                SELECT * FROM LG_SLSMAN
            ` 
            const resp = await ms_db.query(select_query);
            // console.log(resp)
            const sls_mans = resp?.recordsets[0];
            const insert_query = `
                INSERT INTO sales_mans (logical_ref, code, name, spec_code) 
                VALUES ${sls_mans.map(item=>`(${item.LOGICALREF}, '${item.CODE}', '${item.DEFINITION_}', '${item.SPECODE}' )`).join(",")}
            `
            try {
                // await database.query(insert_query, [])
            } catch (e) {
                console.log(e)
            }

        } catch (e) {
            console.log(e)
        }
        try {
            for await (const firm of unit_firms){
                // console.log(firm)
                let nr = firm.code < 10 ? `00`+firm.code : firm.code < 100 ? `0`+firm.code : firm.code;
                const select_query = `
                    SELECT * FROM LG_${nr}_01_GNTOTST WHERE INVENNO = 0
                `
                const resp = await ms_db.query(select_query)
                const res = resp?.recordsets[0]
                // console.log(resp)
                
                if(res.length){
                    console.log("hello")
                    const query_text_3 = `
                        WITH ${res.map((item, index) => `
                            updated_${index} AS (
                                UPDATE items SET stock = ${item.ONHAND} WHERE logical_ref = ${item.STOCKREF} AND firm_id = ${firm.id}
                            )
                        `).join(",")} SELECT 1
                    `
                    try {
                        // const {rows} = await database.query(query_text_3, [])
                        // console.log(rows)
                    } catch (e) {
                        console.log(e)   
                    }

                }
            }
        } catch (e) {
            console.log(e)
        }
        try {
            const select_query_4 = `
                SELECT * FROM L_CURRENCYLIST
            `
            const resp = await ms_db.query(select_query_4);
            const res = resp?.recordsets[0];
            const insert_cur = `
                INSERT INTO currency(logical_ref, firm_id, type, code, name)
                VALUES ${res.map(item=>`(${item.LOGICALREF}, (SELECT id FROM firms WHERE code = ${item.FIRMNR}), ${item.CURTYPE}, '${item.CURCODE}', '${item.CURNAME}' )`).join(",")}
            `
            // await database.query(insert_cur, [])
        } catch (e) {
            console.log(e)
        }
        try {
            for await (const firm of unit_firms){
                let nr = firm.code < 10 ? `00`+firm.code : firm.code < 100 ? `0`+firm.code : firm.code;
                const price_query = `
                    SELECT * FROM LG_${nr}_PRCLIST
                `
                const resp = await ms_db.query(price_query);
                const res = resp.recordsets[0];
                try {
                    const insert_price = `
                        WITH ${res.map((item, index)=>`
                            updated_${index} AS (
                                UPDATE items SET price = ${item.PRICE} , 
                                    currency = ${firm.id == 2 ? 320 : 158}
                                WHERE logical_ref = ${item.CARDREF} AND firm_id = ${firm.id} 
                            )
                        `).join(",")} SELECT 1
                    `
                    // console.log(insert_price)
                    // await database.query(insert_price, [])
                } catch (e) {
                    console.log(e)
                }
            }
            
        } catch (e) {
            console.log(e)   
        }
        try {
            for await (const firm of unit_firms){
                let nr = firm.code < 10 ? `00`+firm.code : firm.code < 100 ? `0`+firm.code : firm.code;
                const stock_query = `
                    SELECT * FROM LG_${nr}_01_GNTOTST
                `
                try {
                    const resp = await ms_db.query(stock_query);
                    const res = resp.recordsets[0];
                    if(res.length){
                        const insert_stock = `
                            INSERT INTO  wh_items (product_id, wh_id, stock)
                            VALUES ${res.map(item=>`((SELECT id FROM items WHERE logical_ref=${item.STOCKREF} AND firm_id = ${firm.id}), 
                                (SELECT id FROM warehouses WHERE code = ${item.INVENNO} AND firm_id = ${firm.id}), ${item.ONHAND})`)}
                        `
                        console.log(insert_stock)
                        const {rows} = await database.query(insert_stock, [])
                        
                    }
                } catch (e) {
                    console.log(e)
                }
                
            }
        } catch (e) {
            console.log(e)
        }   
    } catch (e) {
        console.log(e)
    }
}

Migrations()