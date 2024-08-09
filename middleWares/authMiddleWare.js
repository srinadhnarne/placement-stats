import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import userModel from '../models/users.js'

export const verifyUser = async (password,encrypted)=>{
    return await bcrypt.compare(password,encrypted);
}

export const hashPassword = async (password)=>{
    const hashed = await bcrypt.hash(password,10);
    return hashed;
}

export const generateToken = async (id)=>{
    return JWT.sign({_id:id},process.env.JWT_SECRET_KEY,{expiresIn:'1hr'});
}

export const verifyToken = async (req,res,next)=>{
    const {authorization} = req.headers;
    // console.log(authorization);
    try{
        const decoded = JWT.verify(authorization,process.env.JWT_SECRET_KEY);
        // console.log(decoded);
        req._id=decoded._id;
        next();
    } catch (error){
        // console.log(error);
        if(error instanceof (JWT.TokenExpiredError)){
            // console.log('Expired')
            return res.status(401).send({
                success:false,
                message:"Please login again!"
            })
        }
        else if(error instanceof (JWT.JsonWebTokenError)){
            return res.status(401).send({
                success:false,
                message:"Please login !"
            })
        }
    }
}

export const isAdmin = async (req,res,next)=>{
    const {_id} = req;
    // console.log(_id);
    const isAdm = await userModel.findById(_id).select('role');
    if(isAdm.role===1) return next();
    return res.status(401).send({
        success:false,
        message:'You are not authorized to Edit'
    })
}