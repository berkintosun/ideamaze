const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema

const ideaSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

mongoose.model('ideas',ideaSchema);