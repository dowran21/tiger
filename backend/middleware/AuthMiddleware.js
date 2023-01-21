const JWT = require ('jsonwebtoken')
require('dotenv').config()
const {status} = require ('../utils/status.js')
const database = require('../db/index.js')


const VerifyAdminAccessToken = async (req, res, next) =>{
    let token = req.headers.authorization
    // console.log(token)
    if (!token){
        return res.status(status.bad).send("Token not provided")
    }

    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.ADMIN_ACCESS_KEY, async (err, decoded) =>{
        if(err){
            console.log("I am in error")
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        req.user = decoded;
        next()
    });
}

const VerifyAdminRefreshToken = async (req, res, next) =>{
    let token = req.headers.authorization
    console.log(token)
    if (!token){
        return res.status(status.bad).send("Token not provided")
    }

    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.ADMIN_REFRESH_KEY, async (err, decoded) =>{
        if(err){
            console.log("I am in error")
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        req.user = decoded;
        next()
    });
}

const VerifyUserAccessToken = async (req, res, next) =>{
    let token = req.headers.authorization
    // console.log(req)
    if (!token){
        return res.status(450).send("Token not provided")
    }

    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.USER_ACCESS_KEY, async (err, decoded) =>{
        if(err){
            console.log("I am in error")
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        console.log(decoded)
        req.user = decoded;
        next()
    });
}

const VerifyUserAccessTokenNext = async (req, res, next) =>{
    let token = req?.headers?.authorization
    console.log(token)
    if (!token){
        next()
    }

    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.USER_ACCESS_KEY, async (err, decoded) =>{
        if(err){
            console.log("I am in error")
            console.log(err)
            next()
        }
        req.user = decoded;
        next()
    });
}

const VerifyUserRefreshToken = async (req, res, next) =>{
    let token = req.headers.authorization
    if (!token){
        return res.status(status.bad).send("Token not provided")
    }
    console.log(token)
    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.USER_REFRESH_KEY, async (err, decoded) =>{
        if(err){
            console.log("I am in error")
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        req.user = decoded;
        next()
    });
}

const VerifyCodeAccessToken = async (req, res, next) =>{
    let token = req.headers.authorization
    if (!token){
        return res.status(status.bad).send("Token not provided")
    }
    console.log(token)
    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.CODE_ACCESS_KEY, async (err, decoded) =>{
        if(err){
            console.log("I am in error")
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        console.log(decoded)
        req.user = decoded;
        next()
    });
}

const VerifyOperatorAccessToken = async (req, res, next) =>{
    let token = req.headers.authorization
    if (!token){
        return res.status(status.bad).send("Token not provided")
    }

    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.OPERATOR_ACCESS_KEY, async (err, decoded) =>{
        if(err){
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        req.user = decoded;
        next()
    });
}

const VerifyOperatorRefreshToken = async (req, res, next) =>{
    let token = req.headers.authorization
    if (!token){
        return res.status(status.bad).send("Token not provided")
    }

    token = token.replace("Bearer ", "")
    JWT.verify(token, process.env.OPERATOR_REFRESH_KEY, async (err, decoded) =>{
        if(err){
            console.log(err)
            return res.status(status.forbidden).send("forbidden");
        }
        req.user = decoded;
        next()
    });
}

const VerifyIsAdmin = async (req, res, next) =>{
    role_id = req.user.role_id;
    if(role_id == 1){
        next()
    }else{
        return res.status(status.forbidden).send("forbidden");
    }
}

module.exports = {
    VerifyAdminAccessToken,
    VerifyUserAccessToken,
    VerifyUserRefreshToken,
    VerifyCodeAccessToken,
    VerifyOperatorRefreshToken,
    VerifyOperatorAccessToken,
    VerifyAdminRefreshToken,
    VerifyIsAdmin,
    VerifyUserAccessTokenNext,
}