const mongoose = require('mongoose')

const dbConnect = () => {
    const db_url = process.env.DB_URL
    console.log("DB: ",db_url)
    mongoose.set('strictQuery', false)
    try{
        mongoose.connect(db_url)
    }catch(error){
        console.err("Error conectando a la BD:", error)
    }
    //Listen events
    mongoose.connection.on("connected",() => console.log("Conectado a la BD"))
}

module.exports = dbConnect