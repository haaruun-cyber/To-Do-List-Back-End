const { UserModel, validateUser, validateLogin } = require('../Model/UserModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//get all users (for testing purposes)
const getallusers = async (req,res) => {
    try{
        const users = await UserModel.find();
        res.send({ status: true, users: users });
    }catch(err) {
        res.send({ status: false, message: err.message });
    }
};


// Create a new user
const createuser = async (req,res) => {
    try{
        const { error } = validateUser(req.body);
        if(error) return res.send({ status: false, message: error.message });

        // Check if user already exists
        const CheckUserexists = await UserModel.findOne({ email:req.body.email });
        if(CheckUserexists) return res.send({ status: false, message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password, salt);

        req.body.password = hashedpassword;

        // Save user to database
        const newUser = new UserModel(req.body);
        await newUser.save();
        res.send({ status: true, message: `User created successfully ${newUser.username}` });
    }catch(err) {
        res.send({ status: false, message: err.message });
    }
};

//login
const loginuser = async (req,res) => {
    try{
        const { error } = validateLogin(req.body);
        if(error) return res.send({ status: false, message: error.message });

        // Check if user exists
        const user =  await UserModel.findOne({ email: req.body.email });
        if(!user) return res.send({ status: false, message: 'Invalid email or password' });

        // Compare password
        const validpassword = await bcrypt.compare(req.body.password, user.password);
        if(!validpassword) return res.send({ status: false, message: 'Invalid email or password' });

        //generate jwt token
        const token = jwt.sign({userId: user._id, username: user.username, email: user.email},process.env.JWT_SECRET, {expiresIn: '24h'});

        // Successful login
        res.send({ status: true, message: `Login successful. Welcome back ${user.username}`, token: token });
    }catch(err) {
        res.send({ status: false, message: err.message });
    }
}

module.exports = { createuser, loginuser, getallusers };