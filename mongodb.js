import mongoose from "mongoose";

const ConnectDB =()=>{
    mongoose.connect(`${process.env.MONGO_CONNECTION_STRING}`).
    then(()=>console.log('Server Connected to DB!!')).
    catch ((error)=> {
        console.log(error);
    })
}

export default ConnectDB;