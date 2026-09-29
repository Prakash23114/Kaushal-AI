const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/backList.model.js")


/**
 * @name authMiddleware
 * @description authenticate the user, verifies the JWT token and attaches the user to the request object
 * @access Private
 */

async function authUser(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "please provide the token"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "token is blacklisted please login again"
        })
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    }catch(err){
        return res.status(401).json({
            message: "token is invalid"
        })
    }


}

module.exports = {authUser}