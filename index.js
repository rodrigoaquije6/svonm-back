const express = require('express');
const conectarDB = require('./config/db');
const cors = require("cors");

//Creamos el servidor
const app = express();

//Conectamos a la BD
conectarDB();
app.use(cors())

app.use(express.json());

app.use('/api/rol', require('./routes/rol'));
app.use('/api/tipoProducto', require('./routes/tipoProducto'));
app.use('/api/producto', require('./routes/producto'));

//Definimos ruta principal
/*app.get('/', (req, res) => {
    res.send("Hola mundo!");
})*/

app.listen(4000,() => {
    console.log("El servidor esta corriendo perfectamente")
})