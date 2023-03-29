require("dotenv").config()

const express = require("express")
const app = new express();
const PORT = process.env.PORT;
const morgan = require("morgan")
const cors = require("cors")
const UserRouter = require("./routers/UserRouter")
const AdminRouter = require("./routers/AdminRouter")
const path = require("path")
const SupervisorRouter = require("./routers/SupervisorRouter")

app.use(morgan("dev"))

app.use(express.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.urlencoded({limit: '50mb', extended : true}));

const allowedOrigins = ['http://localhost:3000', 'http://95.85.127.250:5003' ];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false); 
        }
        return callback(null, true);
        },
    credentials: true
}));

app.use(express.static(path.join(__dirname, "build")))

app.use("/api/user", UserRouter);
app.use('/api/admin', AdminRouter)
app.use("/api/supervisor", SupervisorRouter)

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, ()=>console.log(`listening on port ${PORT}`))