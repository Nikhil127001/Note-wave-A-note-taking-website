const mongoose = require("mongoose");
const Mongodb_uri = "mongodb+srv://mongo_edu:qNUQUJqTCILygXV8@cluster0.inl2t7c.mongodb.net/iNotebook";

const connectToMongoose =()=>{
    mongoose.connect(Mongodb_uri)

    console.log("you are connected to MongoDb successfully")

}
module.exports = connectToMongoose