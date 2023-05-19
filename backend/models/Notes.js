const mongoose = require("mongoose");
const { Schema } = mongoose;


const NotesSchema = new Schema({
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref : "User"
    },
    title: String, // String is shorthand for {type: String}
    description: String,
    tag: String,
    date: { type: Date, default: Date.now },
    
  });
  module.exports = mongoose.model("notes", NotesSchema);