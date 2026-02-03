const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
const userRoutes = require('./Route/UserRoute.js');
const taskRoutes = require('./Route/TaskRoute.js');

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);


//test
app.get('/',(req,res)=>{
    res.send('API is running...');
});


app.listen(process.env.PORT || 3005, () => {
    console.log(`Server running on port ${process.env.PORT || 3005}`);
});