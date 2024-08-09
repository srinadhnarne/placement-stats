import { generateToken, hashPassword, verifyUser } from '../middleWares/authMiddleWare.js';
import userModel from '../models/users.js'

export const signUpController = async (req,res)=>{
    const {name,email,password,security} = req.body;
    if(!name){
        return res.status(400).send({
            success:false,
            message:'Enter User Name'
        })
    }
    if(!email){
        return res.status(400).send({
            success:false,
            message:'Enter Email'
        })
    }
    const emailRegex = /^2021ugec[0-9]{3}@nitjsr.ac.in$/;
    if(!emailRegex.test(email)){
        return res.status(401).send({
            success:false,
            message:'Unauthorized Registration'
        });
    }
    if(!password){
        return res.status(400).send({
            success:false,
            message:'Enter Password'
        });
    }
    if(!security){
        return res.status(400).send({
            success:false,
            message:'Enter Security Answer'
        });
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser) {
        return res.status(400).send({
            success:false,
            message:'User already exists. Please Login!'
        })
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await new userModel({
        email,
        password:hashedPassword,
        security,
        name
    }).save();
    const token = await generateToken(newUser._id);
    return res.status(200).send({
        success:true,
        message:'User Registration Successful',
        user:{
            name,email,role:0
        },
        token
    })
}

export const loginController = async(req,res)=>{
    const {email,password} = req.body;
    // console.log(req.body);
    const existingUser = await userModel.findOne({email});
    if(!existingUser){
        return res.status(400).send({
            success:false,
            message:'Register to Login'
        })
    }
    const isAuthenticatedUser = await verifyUser(password,existingUser.password); 
    if(isAuthenticatedUser){
        const token = await generateToken(existingUser._id);
        return res.status(200).send({
            success:true,
            message:'Login Successful',
            user:{
                name:existingUser.name,email,role:existingUser.role
            },
            token
        })
    }
    else {
        return res.status(404).send({
            success:false,
            message:"Invalid Credentials"
        })
    }
}

export const forgotPasswordController = async (req,res)=>{
    const {email,security,password} = req.body;
    const emailRegex = /^2021ugec[0-9]{3}@nitjsr.ac.in$/;
    if(!emailRegex.test(email)){
        return res.status(400).send({
            success:false,
            message:'Invalid Credentials'
        });
    }
    try {
        const existingUser = await userModel.findOne({email});
        console.log(existingUser.security);
        if(!existingUser){
            return res.status(400).send({
                success:false,
                message:'Register to Login'
            })
        }
        if(existingUser.security===security) {
            const hashedPassword = await hashPassword(password);
            userModel.findByIdAndUpdate(existingUser._id,{
                password:hashedPassword
            })
            return res.status(201).send({
                success:true,
                message:'Password Reset Successful'
            })
        }else {
            return res.status(400).send({
                success:false,
                message:'Invalid Security Answer'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:'Error resetting password'
        })
    }
}