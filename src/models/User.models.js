const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    company_name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        select:false
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
    },
    whatsapp:{
        type:String,
        required:true,
        unique:true,
    },
    company_link:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    abertura:{
        type:Number,
        required:true,
        //hora de abertura em milisegundos --> ex: 12:30 = 43.200.000 + 1.800.000
    },
    fechamento:{
        type:Number,
        required:true,
        //hora de abertura em milisegundos --> ex: 12:30 = 43.200.000 + 1.800.000
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    adress:{
        type:String,
        required:true
    },
    CEP:{
        type:String,
        required:true
    },
    company_bio:{
        type:String,
    },
    category:{
        type: String,
        required:true
    },
    Status:{
        type:String,
        default:"TEST",
    },
    profile_picture:{
        type:String
    }
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next()
});

const User = mongoose.model('User', UserSchema);

module.exports = User;