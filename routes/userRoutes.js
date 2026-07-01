 const express = require('express')
 const authmiddleware=require('../middleware/authMiddleware')
 const authorize = require ('../middleware/authorize')

 const routes = express.Router()

 const {
    registerUser,
    getUsers,
    getUserById,
    loginUser,
    deleteUser,
} = require('../controllers/userController')

 routes.post('/register',registerUser)
 routes.post('/login',loginUser)
 routes.get('/users',authmiddleware, authorize('admin'), getUsers,)
 routes.get('/profile',authmiddleware,(req,res)=>{
    return res.status(200).json(
        {
            success:true,
            message:'profile accessed',
            user:req.user
        }
    )
})
 routes.get('/:id',authmiddleware , authorize('admin') , getUserById )
 routes.delete('/:id',authmiddleware, authorize('admin'), deleteUser )



 module.exports = routes;
