import app from "./app.js";
import {conectarDB} from './config/db.js';


//Conectamos a la BD
conectarDB();
//aun no 
//app.use('/api/rol', require('./routes/rol'));
//app.use('/api/trabajador', require('./routes/trabajador'));
//app.use('/api/montura', require('./routes/montura'));
//app.use('/api/crear-marca', require('./routes/crear-marca'));

//Definimos ruta principal
/*app.get('/', (req, res) => {
    res.send("Hola mundo!");
})*/

app.listen(4000, () => {
    console.log("El servidor esta corriendo perfectamente")
})