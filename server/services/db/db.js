const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        const con = await mongoose.connect(process.env.DB_URI)
        console.log('🔅DB Connection Successful🔅');
    } catch (error) {
        console.log({message: error});
        process.exit(1);
    }
}

module.exports = connectDB;