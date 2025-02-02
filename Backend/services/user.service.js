import userModel from "../models/user.model.js"

export const createUser = async({
    email,password
})=>{
    if(!email || !password){
        throw new Error("Please provide email and password")
    }

    const existingUser = await userModel.findOne({email})
    if(existingUser){
        throw new Error("User already exists") // Changed from return new Error to throw new Error
    }

    const hashedPassword = await userModel.hashPassword(password)
    const newUser = new userModel({
        email,
        password:hashedPassword
    })

    await newUser.save(); // Ensure the new user is saved to the database

    return newUser
}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}