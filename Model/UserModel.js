const mongoose = require('mongoose');
const joi = require('joi');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);

const validateUser = (body) => {
    const schema = joi.object({
        username: joi.string().required(),
        email: joi.string().email({ tlds:{ allow: false}}).required(),
        password: joi.string().required(),
        role: joi.string().valid('user', 'admin'),
    });
    return schema.validate(body);
}

const validateLogin = (body) => {
    const schema = joi.object({
        email: joi.string().email({ tlds:{ allow: false}}).required(),
        password: joi.string().required(),
    });
    return schema.validate(body);
}

module.exports = { UserModel, validateUser, validateLogin };