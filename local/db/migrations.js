const ms_db = require("../../backend/db/mssql")

const FirmMigrations = async () =>{
    const ms_query = `
        SELECT * FROM L_CAPIFIRM
    `
    try {
        const result = await ms_db.query(ms_query);
        return result.recordset
    } catch (e) {
        console.log(e)
    }
};

const WareHouses = async ()=>{
    const ms_query = `
        SELECT * FROM L_CAPIWHOUSE
    `
    try {
        const result = await ms_db.query(ms_query);
        return result.recordset
    } catch (e) {
        console.log(e)

    }
}

const UnitsMigrations = async () =>{
    const ms_query_1 = `
        SELECT * FROM L_CAPIFIRM
    `
    try {
        const result = await ms_db.query(ms_query_1);
        const firms = result.recordset;
        // console.log(firms)
        let insert_units = []
        for await (const firm of firms){
            let nr = firm.NR < 10 ? `00`+firm.NR : firm.NR < 100 ? `0`+firm.NR : firm.NR
            // console.log(nr)
            const select_units = `
               SELECT DISTINCT UNITSETREF, NAME, LOGICALREF, CODE, LINENR
               FROM LG_${nr}_UNITSETL
            `    
            try {
                const resp = await ms_db.query(select_units);
                const units = resp.recordset
                let arr = [];
                // console.log(units)
                for await (const unit of units ){
                    // if(!arr.includes(unit.UNITSETREF)){
                        // arr.push(unit.UNITSETREF);
                        insert_units.push({...unit, firm_logical_ref:firm.LOGICALREF})
                    // }
                }
                // let insert_units_query = `
                //     INSERT INTO measurements (measurement, measure_code, firm_id, unitsetref, linenr) VALUES
                //     ${insert_units.map(item =>`('${item.NAME}', '${item.CODE}', ${firm.id}, ${item.UNITSETREF}, ${item.LINENR})` )} 
                // `
                // await database.query(insert_units_query, [])
            } catch (e) {
                console.log(e)
            }
        }
        return insert_units

    } catch (e) {
        
    }
} 

const CurrencyMigrations = async ()=>{
    const select_currency = `
    SELECT * 
    FROM L_CURRENCYLIST
    `    
    try {
        const resp = await ms_db.query(select_currency);
        const units = resp.recordset
        let arr = [];
       
    return resp.recordset
    } catch (e) {
        console.log(e)
    }
}

const ItemsMigrations = async ()=>{
    const ms_query_1 = `
        SELECT * FROM L_CAPIFIRM
    `
    try {
        const result = await ms_db.query(ms_query_1);
        const firms = result.recordset;
        let insert_items = []
        for await (const firm of firms){
            let nr = firm.NR < 10 ? `00`+firm.NR : firm.NR < 100 ? `0`+firm.NR : firm.NR
            // console.log(nr)
            const select_currency = `
            SELECT LI.CODE, LI.LOGICALREF, LI.NAME, LI.NAME,LI.UNITSETREF, LI.LOWLEVELCODES1, LP.PRICE, LP.CURRENCY, ${firm.LOGICALREF} AS firm_logical_ref
            FROM LG_${nr}_ITEMS LI
            INNER JOIN LG_${nr}_PRCLIST LP
                ON LP.CARDREF = LI.LOGICALREF
            WHERE SYSDATETIME() BETWEEN LP.BEGDATE AND LP.ENDDATE AND LI.CARDTYPE <> 22
            `    
            try {
                const resp = await ms_db.query(select_currency);
                const units = resp.recordset
                for await (const unit of units ){
                    insert_items.push(unit)
                }
            } catch (e) {
                console.log(e)
            }
        }
        return insert_items

    } catch (e) {
        console.log(e)   
    }
}

const CategoriesMigrations = async () =>{
    const ms_query_1 = `
        SELECT * FROM L_CAPIFIRM
    `
    try {
        const result = await ms_db.query(ms_query_1);
        const firms = result.recordset;
        let insert_items = []
        for await (const firm of firms){
            let nr = firm.NR < 10 ? `00`+firm.NR : firm.NR < 100 ? `0`+firm.NR : firm.NR
            // console.log(nr)
            const select_currency = `
            SELECT  DISTINCT TOP 100000 

            LGMAIN.LOGICALREF, LGMAIN.CODE, LGMAIN.NAME, 
            LGMAIN.CARDTYPE, ${firm.LOGICALREF} AS firm_logical_ref,
            LGMAIN.ACTIVE, LGMAIN.CLASSTYPE, LGMAIN.LOWLEVELCODES1

                FROM 

                    LG_${nr}_ITEMS LGMAIN WITH(NOLOCK, INDEX = I${nr}_ITEMS_I6)
                LEFT OUTER JOIN 
                    LG_001_UNITSETF UNITSET WITH(NOLOCK) ON (LGMAIN.UNITSETREF  =  UNITSET.LOGICALREF) 
            LEFT OUTER JOIN 
                    LG_001_UNITSETL USLINE WITH(NOLOCK) ON (UNITSET.LOGICALREF  =  USLINE.UNITSETREF) AND (USLINE.MAINUNIT = 1)

                WHERE
                    (LGMAIN.CLASSTYPE = 20) AND (LGMAIN.ACTIVE = 0)
                    
                ORDER BY 
                    LGMAIN.CLASSTYPE, LGMAIN.ACTIVE, LGMAIN.CODE, LGMAIN.LOGICALREF, LGMAIN.LOWLEVELCODES1
            `    
            try {
                const resp = await ms_db.query(select_currency);
                const units = resp.recordsets[0]
                for await (const unit of units ){
                    insert_items.push(unit)
                }
            } catch (e) {
                console.log(e)
            }
        }
        return insert_items

    } catch (e) {
        console.log(e)   
    }
}

const GetStock = async (req, res) =>{
    const ms_query_1 = `
        SELECT * FROM L_CAPIFIRM
    `
    try {
        const result = await ms_db.query(ms_query_1);
        const firms = result.recordsets[0];
        let insert_items = []
        for await (const firm of firms){
            let nr = firm.NR < 10 ? `00`+firm.NR : firm.NR < 100 ? `0`+firm.NR : firm.NR
            // console.log(nr)
            const select_currency = `
                SELECT LG.INVENNO, LG.ONHAND, LG.STOCKREF,
                ${firm.LOGICALREF} AS firm_logical_ref
                FROM LG_${nr}_01_GNTOTST LG
                WHERE LG.INVENNO <> -1
            `    
            try {
                const resp = await ms_db.query(select_currency);
                const units = resp.recordsets[0]
                for await (const unit of units ){
                    insert_items.push(unit)
                }
            } catch (e) {
                console.log(e)
            }
        }
        return insert_items

    } catch (e) {
        console.log(e)   
    }
}

const CreateOrder = async (orders) =>{

    const discount = 150;
    const client = 16
    const accountRef = 337
    const discounted = 337
    const grostotal = 1770
    const nettotal = 5400
    const sales_man_ref = 5;
    const trnet = 3;
    for await (const order of orders ) {
        let nr = order.firm_code < 10 ? `00`+order.firm_code : order.firm_code < 100 ? `0`+order.firm_code : order.firm_code
        const query_text = `
        INSERT INTO LG_${nr}_01_ORFICHE 
        (
            [LOGICALREF]
          ,[TRCODE]
          ,[FICHENO]
          ,[DATE_]
          ,[TIME_]
          ,[DOCODE]
          ,[SPECODE]
          ,[CYPHCODE]
          ,[CLIENTREF]
          ,[RECVREF]
          ,[ACCOUNTREF]
          ,[CENTERREF]
          ,[SOURCEINDEX]
          ,[SOURCECOSTGRP]
          ,[UPDCURR]
          ,[ADDDISCOUNTS]
          ,[TOTALDISCOUNTS]
          ,[TOTALDISCOUNTED]
          ,[ADDEXPENSES]
          ,[TOTALEXPENSES]
          ,[TOTALPROMOTIONS]
          ,[TOTALVAT]
          ,[GROSSTOTAL]
          ,[NETTOTAL]
          ,[REPORTRATE]
          ,[REPORTNET]
          ,[GENEXP1]
          ,[GENEXP2]
          ,[GENEXP3]
          ,[GENEXP4]
          ,[EXTENREF]
          ,[PAYDEFREF]
          ,[PRINTCNT]
          ,[BRANCH]
          ,[DEPARTMENT]
          ,[STATUS]
          ,[CAPIBLOCK_CREATEDBY]
          ,[CAPIBLOCK_CREADEDDATE]
          ,[CAPIBLOCK_CREATEDHOUR]
          ,[CAPIBLOCK_CREATEDMIN]
          ,[CAPIBLOCK_CREATEDSEC]
          ,[CAPIBLOCK_MODIFIEDBY]
          ,[CAPIBLOCK_MODIFIEDDATE]
          ,[CAPIBLOCK_MODIFIEDHOUR]
          ,[CAPIBLOCK_MODIFIEDMIN]
          ,[CAPIBLOCK_MODIFIEDSEC]
          ,[SALESMANREF]
          ,[SHPTYPCOD]
          ,[SHPAGNCOD]
          ,[GENEXCTYP]
          ,[LINEEXCTYP]
          ,[TRADINGGRP]
          ,[TEXTINC]
          ,[SITEID]
          ,[RECSTATUS]
          ,[ORGLOGICREF]
          ,[FACTORYNR]
          ,[WFSTATUS]
          ,[SHIPINFOREF]
          ,[CUSTORDNO]
          ,[SENDCNT]
          ,[DLVCLIENT]
          ,[DOCTRACKINGNR]
          ,[CANCELLED]
          ,[ORGLOGOID]
          ,[OFFERREF]
          ,[OFFALTREF]
          ,[TYP]
          ,[ALTNR]
          ,[ADVANCEPAYM]
          ,[TRCURR]
          ,[TRRATE]
          ,[TRNET]
          ,[PAYMENTTYPE]
          ,[ONLYONEPAYLINE]
          ,[OPSTAT]
          ,[WITHPAYTRANS]
          ,[PROJECTREF]
          ,[WFLOWCRDREF]
          ,[UPDTRCURR]
          ,[AFFECTCOLLATRL]
          ,[POFFERBEGDT]
          ,[POFFERENDDT]
          ,[REVISNR]
          ,[LASTREVISION]
          ,[CHECKAMOUNT]
          ,[SLSOPPRREF]
          ,[SLSACTREF]
          ,[SLSCUSTREF]
          ,[AFFECTRISK]
          ,[TOTALADDTAX]
          ,[TOTALEXADDTAX]
          ,[APPROVE]    
          ,[APPROVEDATE]
        ) OUTPUT inserted.*
        VALUES (
            (SELECT MAX(LOGICALREF) + 1 FROM LG_${nr}_01_ORFICHE ),
            1,
            '00000' + CAST ((SELECT MAX(LOGICALREF) + 1 FROM LG_${nr}_01_ORFICHE) AS VARCHAR(500)) ,
            SYSDATETIME(),
            54654,
            'DENEME-01',
            NULL,
            NULL,
            ${order.client_ref},
            0,
            ${accountRef},
            0,
            0,
            0,
            0,
            ${order.discount},
            ${order.discount},
            ${order.discount ? order.total*order.discount/100 : null},
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
            4,
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
            ${order.sales_man_ref},
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
            NULL)  
            
        `
        try {
            const resp = await ms_db.query(query_text);
            // console.log(resp)
            const result = resp.recordset;
            // console.log(result)
            const logicalRef = result[0].LOGICALREF
            const count = 15;
            // const price = 150
            // const measurement = 24
            // // const index = 1
            // const measurement2 = 6
            // const currency = 158
            // const pricelistref = 26 
            const insert_line = order.items.map((item, index)=>`
            INSERT INTO LG_${nr}_01_ORFLINE
            (     [LOGICALREF]
                ,[STOCKREF]
                ,[ORDFICHEREF]
                ,[CLIENTREF]
                ,[LINETYPE]
                ,[PREVLINEREF]
                ,[PREVLINENO]
                ,[DETLINE]
                ,[LINENO_]
                ,[TRCODE]
                ,[DATE_]
                ,[TIME_]
                ,[GLOBTRANS]
                ,[CALCTYPE]
                ,[CENTERREF]
                ,[ACCOUNTREF]
                ,[VATACCREF]
                ,[VATCENTERREF]
                ,[PRACCREF]
                ,[PRCENTERREF]
                ,[PRVATACCREF]
                ,[PRVATCENREF]
                ,[PROMREF]
                ,[SPECODE]
                ,[DELVRYCODE]
                ,[AMOUNT]
                ,[PRICE]
                ,[TOTAL]
                ,[SHIPPEDAMOUNT]
                ,[DISCPER]
                ,[DISTCOST]
                ,[DISTDISC]
                ,[DISTEXP]
                ,[DISTPROM]
                ,[VAT]
                ,[VATAMNT]
                ,[VATMATRAH]
                ,[LINEEXP]
                ,[UOMREF]
                ,[USREF]
                ,[UINFO1]
                ,[UINFO2]
                ,[UINFO3]
                ,[UINFO4]
                ,[UINFO5]
                ,[UINFO6]
                ,[UINFO7]
                ,[UINFO8]
                ,[VATINC]
                ,[CLOSED]
                ,[DORESERVE]
                ,[INUSE]
                ,[DUEDATE]
                ,[PRCURR]
                ,[PRPRICE]
                ,[REPORTRATE]
                ,[BILLEDITEM]
                ,[PAYDEFREF]
                ,[EXTENREF]
                ,[CPSTFLAG]
                ,[SOURCEINDEX]
                ,[SOURCECOSTGRP]
                ,[BRANCH]
                ,[DEPARTMENT]
                ,[LINENET]
                ,[SALESMANREF]
                ,[STATUS]
                ,[DREF]
                ,[TRGFLAG]
                ,[SITEID]
                ,[RECSTATUS]
                ,[ORGLOGICREF]
                ,[FACTORYNR]
                ,[WFSTATUS]
                ,[NETDISCFLAG]
                ,[NETDISCPERC]
                ,[NETDISCAMNT]
                ,[CONDITIONREF]
                ,[DISTRESERVED]
                ,[ONVEHICLE]
                ,[CAMPAIGNREFS1]
                ,[CAMPAIGNREFS2]
                ,[CAMPAIGNREFS3]
                ,[CAMPAIGNREFS4]
                ,[CAMPAIGNREFS5]
                ,[POINTCAMPREF]
                ,[CAMPPOINT]
                ,[PROMCLASITEMREF]
                ,[REASONFORNOTSHP]
                ,[CMPGLINEREF]
                ,[PRRATE]
                ,[GROSSUINFO1]
                ,[GROSSUINFO2]
                ,[CANCELLED]
                ,[DEMPEGGEDAMNT]
                ,[TEXTINC]
                ,[OFFERREF]
                ,[ORDERPARAM]
                ,[ITEMASGREF]
                ,[EXIMAMOUNT]
                ,[OFFTRANSREF]
                ,[ORDEREDAMOUNT]
                ,[ORGLOGOID]
                ,[TRCURR]
                ,[TRRATE]
                ,[WITHPAYTRANS]
                ,[PROJECTREF]
                ,[POINTCAMPREFS1]
                ,[POINTCAMPREFS2]
                ,[POINTCAMPREFS3]
                ,[POINTCAMPREFS4]
                ,[CAMPPOINTS1]
                ,[CAMPPOINTS2]
                ,[CAMPPOINTS3]
                ,[CAMPPOINTS4]
                ,[CMPGLINEREFS1]
                ,[CMPGLINEREFS2]
                ,[CMPGLINEREFS3]
                ,[CMPGLINEREFS4]
                ,[PRCLISTREF]
                ,[AFFECTCOLLATRL]
                ,[FCTYP]
                ,[PURCHOFFNR]
                ,[DEMFICHEREF]
                ,[DEMTRANSREF]
                ,[ALTPROMFLAG]
                ,[VARIANTREF]
                ,[REFLVATACCREF]
                ,[REFLVATOTHACCREF]
                ,[PRIORITY]
                ,[AFFECTRISK]
                ,[BOMREF]
                ,[BOMREVREF]
                ,[ROUTINGREF]
                ,[OPERATIONREF]
                ,[WSREF]
                ,[ADDTAXRATE]
                ,[ADDTAXCONVFACT]
                ,[ADDTAXAMOUNT]
                ,[ADDTAXACCREF]
                ,[ADDTAXCENTERREF]
                ,[ADDTAXAMNTISUPD]
                ,[ADDTAXDISCAMOUNT]
                ,[EXADDTAXRATE]
                ,[EXADDTAXCONVF]
                ,[EXADDTAXAMNT]
                ,[EUVATSTATUS]
                ,[ADDTAXVATMATRAH]) 
                VALUES (
                    (SELECT MAX(LOGICALREF) + 1 FROM LG_${nr}_01_ORFLINE ),
                    ${item.logical_ref},
                    ${logicalRef},
                    ${order.client_ref},
                    0,
                    0,
                    0,
                    0,
                    ${index+1},
                    1,
                    SYSDATETIME(),
                    446566,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    '',
                    '',
                    ${item.count},
                    (SELECT PRICE FROM LG_${nr}_PRCLIST WHERE CARDREF = ${item.logical_ref} AND ACTIVE = 0),
                    ${item.count}*(SELECT PRICE FROM LG_${nr}_PRCLIST WHERE CARDREF = ${item.logical_ref} AND ACTIVE = 0),
                    0,
                    0,
                    ${discount},
                    (SELECT PRICE FROM LG_${nr}_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 0)*${discount/100},
                    0,
                    0,
                    0,
                    0,
                    0,
                    '',
                    (SELECT LOGICALREF FROM LG_001_UNITSETL WHERE UNITSETREF = (SELECT UNITSETREF FROM LG_${nr}_ITEMS WHERE LOGICALREF = ${item.logical_ref})),
                    (SELECT UNITSETREF FROM LG_${nr}_ITEMS WHERE LOGICALREF = ${item.logical_ref}),
                    1,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    '2023-05-06 00:00:00.000',
                    (SELECT CURRENCY FROM LG_${nr}_PRCLIST WHERE CARDREF = ${item.logical_ref} AND ACTIVE = 0),
                    (SELECT PRICE FROM LG_${nr}_PRCLIST WHERE CARDREF = ${item.logical_ref} AND ACTIVE = 0),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    ${sales_man_ref},
                    1,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    '',
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    (SELECT LOGICALREF FROM LG_${nr}_PRCLIST WHERE CARDREF = ${item.logical_ref} AND ACTIVE = 1),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                );
            `).join(";")
            // console.log(insert_line)
            await ms_db.query(insert_line)
        } catch (e) {
            console.log(e)
        }
    }
 
    // console.log(query_text)
}

const GetClients = async (req, res) =>{
    const ms_query_1 = `
        SELECT * FROM L_CAPIFIRM
    `
    try {
        const result = await ms_db.query(ms_query_1);
        const firms = result.recordset;
        let insert_items = []
        for await (const firm of firms){
            let nr = firm.NR < 10 ? `00`+firm.NR : firm.NR < 100 ? `0`+firm.NR : firm.NR
            // console.log(nr)
            const select_currency = `
                SELECT LOGICALREF, CARDTYPE, TELNRS1, ADDR1, CODE, ${firm.LOGICALREF} AS firm_logical_ref FROM LG_${nr}_CLCARD
            `    
            try {
                const resp = await ms_db.query(select_currency);
                const units = resp.recordset
                for await (const unit of units ){
                    insert_items.push(unit)
                }
            } catch (e) {
                console.log(e)
            }
        }
        return insert_items

    } catch (e) {
        console.log(e)   
    }
}

const SalesMansMigrate = async () =>{
    const select_query = `
    SELECT * FROM LG_SLSMAN
    ` 
    try {
        const resp = await ms_db.query(select_query);
        return resp.recordset        
    } catch (error) {
        console.log(error)        
    }
    // console.log(resp)
}

module.exports = {
    FirmMigrations,
    WareHouses,
    UnitsMigrations,
    CurrencyMigrations,
    ItemsMigrations,
    CategoriesMigrations,
    GetStock,
    CreateOrder,
    GetClients  ,
    SalesMansMigrate
}