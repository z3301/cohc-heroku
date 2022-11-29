const jwt = require('jsonwebtoken');
const User = require("../models/user");

async function requireAuth(req, res, next) {
    try{
    // read token off cookieParser
    const token = req.cookies.Authorization;
    console.log("token: ", token);

    // decode the token 
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);

    // check expiration
    if (decoded.exp < Date.now()) return res.status(401).send("Token expired");
    console.log("Token is valid"); 


    // find user decoded sub
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).send("User not found");
    
    // attach user to req.user
    req.user = user;

    // continue on
    next();
    } catch (error) {
        console.log(error);
        res.sendStatus(401);
    }
}

module.exports = requireAuth;