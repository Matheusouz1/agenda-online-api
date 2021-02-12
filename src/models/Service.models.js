const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type: String,
    },
    price:{
        type:Number,
        default:0
    },
    duration:{
        type: Number,
        required:true
        //numero em milisegundo que se demora pra executar aquele serviço
    },
    image:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;