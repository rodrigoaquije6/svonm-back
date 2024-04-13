import app from "./app.js";
import {conectarDB} from './config/db.js';


//Conectamos a la BD
conectarDB();
//aun no 
//app.use('/api/rol', require('./routes/rol'));

//Definimos ruta principal
/*app.get('/', (req, res) => {
    res.send("Hola mundo!");
})*/
app.listen(4000,() => {
    console.log("El servidor esta corriendo perfectamente")
})