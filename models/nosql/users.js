const mongoose = require("mongoose")
const UserScheme = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password:{
        type: String // TODO Guardaremos el hash
    },
    valCode:{
        type: Number,
        //require: false
        default: 111111
    },
    valCodeIntents:{
        type: Number,
        default: 3
    },
    userState:{
        type: String,
        default: "pending"
    },
    role:{
        type: ["user", "admin"], // es el enum de SQL
        default: "user"
    }},
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)

module.exports = mongoose.model("users", UserScheme)