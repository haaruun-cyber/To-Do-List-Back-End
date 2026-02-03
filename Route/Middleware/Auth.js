const jwt = require('jsonwebtoken');
const { UserModel } = require('../../Model/UserModel');
require('dotenv').config();



// Authentication middleware
const Auth = (role = []) => {
    return async (req,res,next) => {
        try {
            const token = req.headers['token'];
            if(!token) return res.status(401).send({ status: false, message: 'Access Denied. No token provided' });

            jwt.verify(token, process.env.JWT_SECRET, async (err,decoded) => {
                if(err) return res.status(400).send({ status: false, message: 'Invalid token or expired' });

                const userdata = await UserModel.findById(decoded.userId);
                if(!userdata) return res.status(404).send({ status: false, message: 'User not found' });
                // console.log(role,userdata.role);
                // Check for roles
                if(!role.includes(userdata.role)){
                    return res.status(403).send({ status: false, message: 'Access denied. You do not have the required permissions' });
                }
                
                req.user = userdata;
                next();

                // // console.log(userdata);

            });
        } catch (error) {
            return res.status(400).send({ status: false, message: 'Invalid token' });
        }
    }
}

module.exports = Auth;