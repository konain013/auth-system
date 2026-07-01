 const express=require('express')
const userRoutes=require('./routes/userRoutes')

 const dotenv=require('dotenv')//read env file

 const connectDB=require('./config/db')

 dotenv.config()//env file k values ko process ma dalna

 const app=express();
  app.use(express.json())
  
 app.use('/api/users',userRoutes)



 const PORT=process.env.PORT || 3000

 connectDB();

 app.listen(PORT,()=>{
    console.log(`Server is Running on port ${PORT}`);
    
 })
