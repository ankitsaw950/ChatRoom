import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Valid UserId is required");
  }

  let project;
  try {
    project = await projectModel.create({
      name,
      users: [userId],
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error code in MongoDB
      throw new Error("Project name already exists");
    }
    throw error;
  }

  return project;
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Valid UserId is required");
  }

  const allUsersProjects = await projectModel.find({ users: userId });

  return allUsersProjects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Valid ProjectId is required");
  }

  if (
      !Array.isArray(users) ||
      users.length === 0 ||
      !users.every((user) => 
      mongoose.Types.ObjectId.isValid(user))
    ) {
    throw new Error("Users must be an array of valid ObjectIds and not empty");
  }
  
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Valid UserId is required");
  }

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error("User not belong to the project");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    {
      $addToSet: {
        users: {
          $each: users.map(user => new mongoose.Types.ObjectId(user))
        }
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  return updatedProject;

}


export const getProjectById = async ({projectId}) =>{
  if (!projectId ||!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Valid ProjectId is required");
  }

  const project = await projectModel.findOne({_id:projectId}).populate('users')

  return project;

}

export const updateFileTree = async ({ projectId, fileTree }) => {
  if (!projectId) {
      throw new Error("projectId is required")
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid projectId")
  }

  if (!fileTree) {
      throw new Error("fileTree is required")
  }

  const project = await projectModel.findOneAndUpdate({
      _id: projectId
  }, {
      fileTree
  }, {
      new: true
  })

  return project;
}

