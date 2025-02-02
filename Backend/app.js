import morgan from 'morgan'
import express from 'express'
import connectDB from './db/index.js'
import cookieParser from "cookie-parser"
import cors from 'cors'

// Routes
import userRoutes from "./routes/user.routes.js"
import projectRoutes from "./routes/project.routes.js"
import aiRoutes from "./routes/ai.routes.js"

connectDB()
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))



app.use(cookieParser())

app.use('/users',userRoutes)
app.use('/project',projectRoutes)
app.use('/ai',aiRoutes)
app.get('/',(req,res)=>{
    res.send("Hello World!")
})

export default app


/*


firstly this application should be for every user.

While registering to the application the user will be asked to create the account as simple user or developer user.

if user clicks on the simple user then he will be directed to a page where there will be a top nav bar in that there will be the app logo, and three dot (by clicking on it there will more functionality to user like edit his profile , privacy setting , notification setting , invite friend to this app), then there will be a search bar from where he can directly search for registered user, and then if he the another user appear than the he can click on his profile and start for his chatting for that a new dashboard appears that only his the receiver user name , will appear on it and profile pic of him and whether he is active or not . and in down side the input field for message and a send icon .  and he can copntinue chatting if he comes back then the message remains saved for the next time .


if user select the developer profile then he will be redirected to a page where he will get much similar interface and but in this case he can search for project and after getting the project he can click on the project and ask for joining , a message will be triggered to the owner in notification that someone wants to be added in the particular project then if the owner allows for joining  then he can get into that project .   

and in this case if the different users are chatting and wants any help then they can chat with the ai for help and all the results will be available to the all user of the group .


there will we option for the simple user to shift to the developer profile . and as it is bascially focused for the developer so while communicating with the ai . the interface should be modified . 

currently the interface is like complete screen width and in that there are two portion one is for messaging and the other for if the ai provides any result like for application or website creation , then that case different file structure appear and all the code remains in separate for all files ( simply the functionlaity as a code-editor) and there is run button on the top for running these files if there is a  a file like create server of express then there is two files , app.js and package,json and if i click a run button then the node modules are installed on the browser and angain i click on the run the ser starts runnig ,  so what more could be changed so that it could be better for the mobile user also and for laptop user , and waht more changes could be made according to u make it a really good application  


*/