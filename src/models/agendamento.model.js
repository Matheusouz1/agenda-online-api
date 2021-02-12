const mongoose = require("mongoose");

const AgendamentoSchema = new mongoose.Schema({
    horarioI:{
        type:Number,
        required:true,
    },
    horarioF:{
        type:Number,
        required:true
    },
    observacao:{
        type: String,
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"client",
        required:true,
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:true,
    },
    status:{
        type:String,
        default:"PENDDING"
        //pedding, confirmed, finalized
    },
});

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

module.exports = Agendamento;