import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6,'Email must be at least 6 characters'],
        maxLength:[20,'Email must be at most not be longer than 6 characters'],
    },
    password:{
        type:String,
        select:false
    }
})

userSchema.statics.hashPassword = async  function(password){
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

userSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateJWT = function(){
    return jwt.sign(
        {email:this.email},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
    )
}

const User = mongoose.model('User',userSchema)

export default User