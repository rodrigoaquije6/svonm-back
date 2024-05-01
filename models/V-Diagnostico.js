import mongoose from "mongoose";

const VDiagnosticoSchema= mongoose.Schema({
    fila:{
        type:String,
        required:true
    },
    malestar:{
        type:String,
        required:true
    },
    problema:{
        type:String,
        required:true
    },
});

export default mongoose.model("Diagnostico",VDiagnosticoSchema);

/*import mongoose from "mongoose";

const VDiagnosticoSchema = mongoose.Schema({

fila:{
    type:String,
    required:true
},
malestar:{
    type:String,
    required:true
},
problema:{
    type:String,
    required:true
}
});

export default mongoose.model("Diagnostico", VDiagnosticoSchema);*/