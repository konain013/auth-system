const jwt = require('jsonwebtoken') 
const authmiddleware = (req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader){
        return res.status(401).json(
            {
                success:false,
                message:'Acess denied,no token provided'
            }
        )
    }
    const token = authHeader.split(" ")[1]
    try {
        
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decode
        // console.log(req.user)
        next()
    } catch (error) {
        return res.status(401).json(
            {
                success:false,
                messege:'Invalid or expire token'
            }
        )
        
    }
    
}
module.exports=authmiddleware