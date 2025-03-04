import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import * as projectService from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        // console.log(name);

        const loggedInUser = await userModel.findOne({email : req.user.email})

        // console.log(loggedInUser)

        if (!loggedInUser) {
            return res.status(401).json({ error: "Unauthorized user" });
        }
        const userId = loggedInUser._id;
        // console.log("UserId: ", userId);
        
        const newProject = await projectService.createProject({name, userId});
    
        res.status(201).json(newProject);
    } catch (error) {
        console.log("Error  while Creating the project (catch block ):",error)
        res.status(400).send(error.message)        
    }


};


export const getAllProject = async(req,res) =>{
    try {
       
        const loggedInUser = await userModel.findOne({email:req.user.email});
        
        if(!loggedInUser){
            return res.status(401).json({error: "User with this email doesnot exist , so cant find the user"})
        }

        const userId =  loggedInUser._id;

        const allUsersProjects = await projectService.getAllProjectsByUserId({userId})

        return res.status(200).json({projects : allUsersProjects})


    } catch (error) {
        console.log(error)
        res.status(404).json({error : error.message})
    }
}

export const addUserToProject = async(req,res) =>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try {
        const { projectId ,users} = req.body
        
        const loggedInUser = await userModel.findOne({email:req.user.email})

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })
        return res.status(200).json({project,})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message
        })
    }


}


export const getProjectById = async(req,res) =>{
    const {projectId} = req.params


    try {

        const project = await projectService.getProjectById({projectId})

        return res.status(200).json({
            project
        })
        
    } catch (error) {
        console.log(error)
        res.status(404).json({error:error.message
        })
    }


}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}