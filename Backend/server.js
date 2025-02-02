import 'dotenv/config';
import http from 'http';
import app from './app.js';
import jwt from 'jsonwebtoken';
import {Server} from 'socket.io'
const port = process.env.PORT || 4000
import mongoose from 'mongoose'
import projectModel from "./models/project.model.js"
import  { generateResult } from "./services/ai.service.js"



const server = http.createServer(app);
const io =new Server(server,{
    cors :{
        origin:'*'
    }
});


io.use(async(socket,next) =>{
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1]

        const projectId = socket.handshake.query.projectId;

        if(!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid project id'))
        }

        socket.project = await projectModel.findById(projectId);

        if(!token) return next(new Error('unauthorized'))

        const decoded  = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded) {
            return next(new Error('Authentication failed'))
        }

        socket.user = decoded;
        next();
        
    } catch (error) {
        next(error)
    }
})

io.on('connection', socket =>  {

    socket.roomId = socket.project._id.toString()

    console.log('New user connected');
    socket.join(socket.roomId)

    socket.on('project-message', async data => {
        
        const message = data.message;

        const aiIsPresentInMessage = message.includes("@ai");
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if(aiIsPresentInMessage){
            // console.log("Ai is present in the message")
            // socket.emit('project-message', {
            //     message: 'AI is processing your message',
            // })


            const prompt = message.replace("@ai","");
            const result = await generateResult(prompt)


            // const cleanResult = JSON.stringify(result);
            // io.to(socket.roomId).emit("project-message", {
            //   message: cleanResult,  // Ensuring it's a proper JSON string
            //   sender: {
            //             _id: 'ai',
            //             email: "AI"
            //         }
            // });

            
            io.to(socket.roomId).emit("project-message",{
                message: result,
                sender: {
                    _id:'ai',
                    email: "AI"
                }
            })

            return ;

        }

       
    })

    socket.on('event', data => { /* … */ });
    socket.on('disconnect', () => { 
        console.log('User disconnected');
        socket.leave(socket.roomId);  // Remove user from room when they disconnect
     });
  });
 

server.listen(port,()=>{
    console.log(`Server is running on port : ${port}`)
})
