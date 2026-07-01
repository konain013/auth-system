 const mongoos=require('mongoose')
 
 const connectDB=async () =>{
    try {
        conn = await mongoos.connect(process.env.MONGODB_URL)
        console.log(`MongoDB connected : ${conn.connection.host}`);
         
    } catch (error) {
        console.log(error);
        process.exit(1)
        
        
    }
 }
 module.exports=connectDB
