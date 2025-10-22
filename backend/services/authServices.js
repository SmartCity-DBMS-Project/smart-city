const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';


function setUser(user){
    const token = jwt.sign(
      {email: user.email, role: user.role},
      JWT_SECRET
    );
    return token;
}

function getUser(token){
    if(!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch(error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
}
