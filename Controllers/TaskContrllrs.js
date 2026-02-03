const { TaskModel, validateTask } = require('../Model/TaskModel');

//get all tasks
const getalltasks = async (req,res) => {
    try {
        const currentUserId = req.user._id;

        const tasks = await TaskModel.find({userid: currentUserId}).populate({ 
            path: 'userid', 
            select: 'username email -_id', 
            match: { _id: req.user.id } 
        });
        res.send({ status: true, tasks: tasks });
    }catch(err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const gettaskbyid = async (req, res) => {
    try {
        const taskid = req.params.id;
        const Task = await TaskModel.findById(taskid);
        if(!Task) return res.send({status: false, message:"No Task Ware Found With This ID"});
        res.send({status:true, task:Task})
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//get as category
const gettaskbycategory = async (req,res) => {
    try {
        const category = req.params.category;
        const currentUserId = req.user._id;
        const tasks = await TaskModel.find({ category,  userid: currentUserId }).populate({
            path: 'userid',
            select: 'username email -_id',
            match: { _id: req.user.id } 
        })
        if(tasks.length === 0) return res.status(404).send({ status: false, message: 'No tasks found in this category' });
        res.send({ status: true, tasks: tasks });
    }catch(err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

//create task
const createtask = async (req,res) => {
    try {
        const { error } = validateTask(req.body);
        if(error) return res.status(400).send({ status: false, message: error.message });
        req.body.userid = req.user._id; //assigning the user id from the token to the task being created
        const newTask = new TaskModel(req.body);
        await newTask.save();
        res.send({ status: true, message: 'Task created successfully', task: newTask });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//update task
const updatetask = async (req,res) => {
    try {
        const taskId = req.params.id;
        const { error } = validateTask(req.body);
        if(error) return res.status(400).send({ status: false, message: error.message });

        //check if task exists and belongs to user
        const task = await TaskModel.findById(taskId);
        if(!task) return res.status(404).send({ status: false, message: 'Task not found' });
        // if(task.userid.toString() !== req.body.userid) return res.status(403).send({ status: false, message: 'You are not authorized to update this task' });
        if(req.user._id.toString() !== task.userid.toString()) return res.status(403).send({ status: false, message: 'You are not authorized to update this task current user' });
        //check if current user is same as task owner
        // console.log(req.user._id.toString(), req.body.userid);
        // return;

        const updatedTask = await TaskModel.findByIdAndUpdate({_id: taskId, userid:req.body.userid}, req.body, { new: true });
        res.send({ status: true, message:'Task Updated successfully', task: updatedTask });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//delete task
const deletetask = async (req,res) => { 
    try {
        const taskId = req.params.id;
        const task = await TaskModel.findById(taskId);
        if(!task) return res.status(404).send({ status: false, message: 'Task not found' });
        //if(task.userid.toString() !== req.body.userid) return res.status(403).send({ status: false, message: 'You are not authorized to delete this task' });
        if(req.user._id.toString() !== task.userid.toString()) return res.status(403).send({ status: false, message: 'You are not authorized to delete this task current user' });
        
        const DeletedTask = await TaskModel.findByIdAndDelete(taskId);
        // if(!DeletedTask) return res.status(404).send({ status: false, message: 'Task not found' });
        res.send({ status: true, message: 'Task deleted successfully' });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { getalltasks, gettaskbyid, gettaskbycategory, createtask, updatetask, deletetask };