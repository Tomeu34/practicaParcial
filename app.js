const express = require("express")
const cors = require("cors")
require('dotenv').config();
const dbConnect = require('./config/mongo.js')
const usersRouter = require('./routes/users.js')
const storageRouter = require('./routes/storage.js')
//const authRouter = require('./routes/auth.js')

dbConnect()

const app = express()

//Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
app.use(cors())
app.use(express.json())
app.use(express.static("storage"))
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})

app.use("/api/users", usersRouter)
app.use("/api/storage", storageRouter)
//app.use("/api/auth", authRouter)