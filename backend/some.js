const mssql = require("./db/mssql");

const Migrations = async (req, res) =>{
    const discount = 150;
    const client = 16
    const accountRef = 337
    const discounted = 337
    const grostotal = 1770
    const nettotal = 5400
    const sales_man_ref = 5;
    const trnet = 3;
    const query_text = `
    
    INSERT INTO LG_001_01_ORFICHE 
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
        (SELECT MAX(LOGICALREF) + 1 FROM LG_001_01_ORFICHE ),
        1,
        '00000' + CAST ((SELECT MAX(LOGICALREF) + 1 FROM LG_001_01_ORFICHE) AS VARCHAR(500)) ,
        SYSDATETIME(),
        54654,
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
        NULL)  
        
    `
    try {
        const resp = await mssql.query(query_text);
        console.log(resp)
        const result = resp.recordset;
        console.log(result)
        const logicalRef = result[0].LOGICALREF
        const count = 15;
        const price = 150
        const measurement = 24
        const index = 1
        const measurement2 = 6
        const currency = 158
        const pricelistref = 26 
        const insert_line = `
        INSERT INTO LG_001_01_ORFLINE
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
                (SELECT MAX(LOGICALREF) + 1 FROM LG_001_01_ORFLINE ),
                ${logicalRef},
                ${logicalRef},
                ${client},
                0,
                0,
                0,
                0,
                ${index},
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
                ${count},
                (SELECT PRICE FROM LG_001_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 1),
                ${count}*(SELECT PRICE FROM LG_001_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 1),
                0,
                0,
                ${discount},
                (SELECT PRICE FROM LG_001_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 1)*${discount/100},
                0,
                0,
                0,
                0,
                0,
                '',
                ${measurement},
                ${measurement2},
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
                (SELECT CURRENCY FROM LG_001_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 1),
                (SELECT PRICE FROM LG_001_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 1),
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
                (SELECT LOGICALREF FROM LG_001_PRCLIST WHERE CARDREF = ${logicalRef} AND ACTIVE = 1),
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
        `
        // console.log(insert_line)
        await mssql.query(insert_line)
    } catch (e) {
        console.log(e)
    }
    // console.log(query_text)
}

Migrations()

SELECT i.name, i.code, m.measurement, price, wi.stock::integer,  i.id::integer, 0::integer AS count
        FROM items i
            INNER JOIN measurements m
                ON m.id = i.measurement_id AND i.firm_id = m.firm_id
            INNER JOIN sls_man_firms sl
                ON sl.firm_id = i.firm_id AND sl.sls_man_id = 1
            INNER JOIN sls_man_whs smw
                ON smw.sls_man_id = 1
            INNER JOIN wh_items wi
                ON wi.product_id = i.id AND smw.wh_id = wi.id 
            
            WHERE i.id > 0 