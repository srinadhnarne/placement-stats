import mongoose from "mongoose";

const placementSchema = new mongoose.Schema({
    "RegNo": {
        type:String,
        required:true,
        unique:true
    }, 
    "Name": {
        type:String,
        required:true
    }, 
    "InternCompany": {
        type:String,
        default:null
    }, 
    "Stipend": {
        type:String,
        default:null
    }, 
    "InternStatus": {
        type:Boolean,
        default:null
    }, 
    "PlacementCompany": {
        type:String,
        default:null
    }, 
    "CTC": {
        type:String,
        default:null
    },
    "PlacementStatus": {
        type:Boolean,
        default:null
    },
},{timestamps:true});

export default mongoose.model('placements',placementSchema);