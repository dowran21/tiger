require("dotenv").config();

const express = require("express");

const axios = require("axios");
const {time} = require("./const.json");
const PORT = 4800

const app = new express()
const mssql = require("./db/mssql");
const { CreateOrder, FirmMigrations, WareHouses, UnitsMigrations, CurrencyMigrations, CategoriesMigrations, ItemsMigrations, GetStock, GetClients, SalesMansMigrate } = require("./db/migrations");

const cron = require("node-cron");

const GetOrders = async ()=>{
    const response = await axios({
        method:"get",
        url:"http://216.250.9.138:4003/api/admin/get-orders",

    })
    await CreateOrder(response.data.rows)

}

const task = cron.schedule("* * * * *", ()=>{
    GetOrders()
})
task.start()
const MigrateFirms = async ()=>{
    // console.log("hello")
    const firms = await FirmMigrations()
     axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/firm-migrate",
        data:{firms}
    })
}

const WhMigrations = async ()=>{
    // console.log("hello wh");
    const wh = await WareHouses()
     axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/wh-migrate",
        data:{wh}
    })
}

const UnitMigrate = async ()=>{
    console.log("hello unit");
    const units = await UnitsMigrations();
    // console.log(units)
     axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/unit-migrate",
        data:{units}
    })
}

const CurrencyMigrate = async (req, res) =>{
    // console.log("hell om");
    const currencies = await CurrencyMigrations()
    // console.log(currencies)
     axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/currency-migrate",
        data:{currencies}
    })
}

const CategoryMigrations = async (req, res) =>{
    console.log("categories -- hello")
    const categories = await CategoriesMigrations();
    axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/category-migrate",
        data:{categories}
    })
}

const ItemMigrate = async (req, res) =>{
    console.log("sdkfhdk s");
    const items = await ItemsMigrations();
    // console.log(items)
    axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/item-migrate",
        data:{items}
    })
}

const StockMigrate = async (req, res) =>{
    const stocks = await GetStock();
    // console.log(stocks)
    axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/stock-migrate",
        data:{stocks}
    })
} 

const GetClient = async ()=>{
    const clients = await GetClients();
    // console.log(clients);
    axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/client-migrate",
        data:{clients:clients.filter(item=>item.CODE !== 'я')}
    })
}

const SalesManMigrate = async ()=>{
    const sls_mans = await SalesMansMigrate();
    console.log("sales man migrate")
    axios({
        method:"post",
        url:"http://216.250.9.138:4003/api/admin/sls-man-migrate",
        data:{sls_mans}
    })
}

ItemMigrate()

WhMigrations();
SalesManMigrate()
try {
    // MigrateFirms();
// CurrencyMigrate();
// UnitMigrate()

// CurrencyMigrate()
} catch (e) {
    
}
StockMigrate()
// GetClient()
// task.start();;
const task_2 = cron.schedule("* * * * *", async ()=>{
    try {
        ItemMigrate()
        SalesManMigrate()
        // GetClient()
        StockMigrate()
        CategoryMigrations()
    } catch (error) {
        
    }
    
})

task_2.start()



MigrateFirms()

app.listen(PORT, ()=>console.log("listenng for port"))


