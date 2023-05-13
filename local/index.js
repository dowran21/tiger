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
        url:"http://localhost:5003/api/admin/get-orders",

    })
    await CreateOrder(response.data.rows)

}

const task = cron.schedule("* * * * *", ()=>{
    GetOrders()
})
const MigrateFirms = async ()=>{
    // console.log("hello")
    const firms = await FirmMigrations()
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/firm-migrate",
        data:{firms}
    })
}

const WhMigrations = async ()=>{
    // console.log("hello wh");
    const wh = await WareHouses()
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/wh-migrate",
        data:{wh}
    })
}

const UnitMigrate = async ()=>{
    console.log("hello unit");
    const units = await UnitsMigrations();
    // console.log(units)
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/unit-migrate",
        data:{units}
    })
}

const CurrencyMigrate = async (req, res) =>{
    // console.log("hell om");
    const currencies = await CurrencyMigrations()
    // console.log(currencies)
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/currency-migrate",
        data:{currencies}
    })
}

const CategoryMigrations = async (req, res) =>{
    console.log("categories -- hello")
    const categories = await CategoriesMigrations();
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/category-migrate",
        data:{categories}
    })
}

const ItemMigrate = async (req, res) =>{
    console.log("sdkfhdk s");
    const items = await ItemsMigrations();
    // console.log(items)
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/item-migrate",
        data:{items}
    })
}

const StockMigrate = async (req, res) =>{
    const stocks = await GetStock();
    // console.log(stocks)
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/stock-migrate",
        data:{stocks}
    })
} 

const GetClient = async ()=>{
    const clients = await GetClients();
    // console.log(clients);
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/client-migrate",
        data:{clients:clients.filter(item=>item.CODE !== 'я')}
    })
}

const SalesManMigrate = async ()=>{
    const sls_mans = await SalesMansMigrate();
    await axios({
        method:"post",
        url:"http://localhost:5003/api/admin/sls-man-migrate",
        data:{sls_mans}
    })
}

MigrateFirms();
WhMigrations();
CurrencyMigrate();
UnitMigrate()

CurrencyMigrate()
// task.start();;
const task_2 = cron.schedule("* * * * *", async ()=>{
    ItemMigrate()
    SalesManMigrate()
    GetClient()
    StockMigrate()
    CategoryMigrations()
})

task_2.start()



MigrateFirms()

app.listen(PORT, ()=>console.log("listenng for port"))


