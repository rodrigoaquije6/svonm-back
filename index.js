const express = require('express');
const conectarDB = require('./config/db');
const cors = require("cors");
const multer = require('multer');

//Creamos el servidor
const app = express();

//Conectamos a la BD
conectarDB();
app.use(cors())

// Configuración de Multer para almacenar archivos en el directorio 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Aquí especificas el directorio donde se almacenarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Aquí especificas cómo se nombrarán los archivos
    }
});

const upload = multer({ storage: storage });

// Manejador de errores de Multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        res.status(400).json({ error: 'Error al subir archivo' });
    } else {
        next();
    }
});

app.use(express.json());

app.use('/api/rol', require('./routes/rol'));

app.use('/api/montura', require('./routes/montura'));

//Definimos la ruta para manejar la subida de archivos
app.post('/upload', upload.single('imagen'), (req, res) => {
    // La imagen subida está disponible en req.file
    res.send('Imagen subida exitosamente');
});

//Definimos ruta principal
/*app.get('/', (req, res) => {
    res.send("Hola mundo!");
})*/

app.listen(4000, () => {
    console.log("El servidor esta corriendo perfectamente")
})