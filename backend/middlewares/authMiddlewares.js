const jwt = require('jsonwebtoken');
const { getUser } = require('../services/authServices')

function checkAuthentication(req, res, next){
    const token = req.cookies.token;
    if(!token) return res.status(401).json(({error: "Unauthorized"}));

    try {
        const user = getUser(token);
        req.user = user;
        next();
    } catch(error) {
        return res.status(403).json({ error: "Invalid token" });
    }
}

function authorizeRoles(roles = []){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({error: "User Not Logged in"});

    if(!roles.includes(req.user.role)) return res.end("Unauthorized");

    next();
  };
};

module.exports = {
    checkAuthentication,
    authorizeRoles
}