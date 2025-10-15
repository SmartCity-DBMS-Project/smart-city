const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { formatDOB } = require("../utils/formatDOB")

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const salt = 10;

async function handleLogin(req, res) {
    try{
        const data = req.body;
        console.log("F1");
        const loginInfo = await prisma.login.findUnique({
          where: {
            email: data.email,
          },
          select: {
            citizen_id: true,
            password: true,
            role: true,
            citizen: {
              select: {
                dob: true,
              },
            },
          },
        });

        console.log("F2");

        let isAuthenticated = false;

        if(!loginInfo) {
            console.log("Email doesn't exist");
            return res.status(500).json({error: "Email doesn't exist"});
        }

        if(loginInfo.password){
            isAuthenticated = await bcrypt.compare(data.password, loginInfo.password);
            console.log("logged in");
            // isAuthenticated = data.password === loginInfo.password;
        }
        else{
            const dobPassword = formatDOB(loginInfo.citizen.dob);
            isAuthenticated = data.password === dobPassword;
            // isAuthenticated = await bcrypt.compare(data.password, dobPassword);
        }

        if(!isAuthenticated) { return res.status(500).json({error: "Incorrect Password, try dob if not having password"}); }

        const token = jwt.sign(
          {email: data.email, role: loginInfo.role},
          JWT_SECRET
        );
        
        return res.status(200).json({message: "Login successful", token: token, role: loginInfo.role});
    } catch(error) {
        console.log(error);
        return res.status(500).json({error: "Unknown error occured"});
    }
}

async function handlePasswordChange(req, res) {
  try {
    const { email } = req.params;
    const data = req.body;
    
    const newHashedPassword = await bcrypt.hash(data.password, salt)

    const updatedUser = await prisma.login.update({
      where: {
        email: email,
      },
      data: {
        password: newHashedPassword,
      },
    });

    console.log("New password: ", updatedUser);
    return res.status(200).json({message: "Password updated successfully"});

  } catch(error) {
    console.log("Error: ", error);
    return res.status(500).json({error: "Unable to change password"});
  }
}

module.exports = {
    handleLogin,
    handlePasswordChange
}