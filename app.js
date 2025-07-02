const express = require("express")
const cors = require("cors")
require('dotenv').config();
const dbConnect = require('./config/mongo.js')
const usersRouter = require('./routes/users.js')
const storageRouter = require('./routes/storage.js')
const clientRouter = require('./routes/client.js')
const projectRoutes = require('./routes/projects.js')
const deliveryNoteRoutes = require('./routes/deliveryNote.js')
//const authRouter = require('./routes/auth.js')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./docs/Swagger.yaml');

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
app.use("/api/client", clientRouter)
app.use("/api/project", projectRoutes)
app.use("/api/deliverynote", deliveryNoteRoutes)
//app.use("/api/auth", authRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;