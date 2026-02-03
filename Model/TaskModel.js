const mongoose = require('mongoose');
const joi = require('joi');

const TaskSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User ID is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    category: {
        type: String,
        enum: ['WORK', 'PERSONAL', 'STUDY', 'SHOPPING', 'OTHER'],
        default: 'OTHER',
    }
}, { timestamps: true });

const TaskModel = mongoose.model('tasks', TaskSchema);

const validateTask = (body) => {
    const schema = joi.object({
        userid: joi.string(),
        title: joi.string().required(),
        description: joi.string().required(),
        status: joi.string().valid('pending', 'in-progress', 'completed'),
        category: joi.string().valid('WORK', 'PERSONAL', 'STUDY', 'SHOPPING', 'OTHER').optional(),
    });
    return schema.validate(body);
}

module.exports = { TaskModel, validateTask };