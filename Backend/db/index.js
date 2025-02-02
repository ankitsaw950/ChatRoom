import mongoose from 'mongoose';

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("mongoDB is connected")
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default connectDB