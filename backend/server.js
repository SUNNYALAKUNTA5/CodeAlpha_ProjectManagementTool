const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoute');
const projectRoutes = require('./routes/projectRoute');
const taskRoutes = require('./routes/taskRoute');
const commentRoutes = require('./routes/commentRoute');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev")); // tiny, short, common, combined, dev
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});