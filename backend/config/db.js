const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected "))
    .catch(err => {
        console.log("MongoDB connection error ", err.message);
        process.exit(1);
    });
}
module.exports = connectDB;