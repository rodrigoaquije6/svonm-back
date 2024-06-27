import mongoose from 'mongoose'
import { DB_MONGO } from './config.js';

export const conectarDB= async () => {

    try{

        await mongoose.connect(DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        })
        console.log('BD Conectada');
        

    } catch (error) {
        console.log(error);
        process.exit(1); //Detenemos la app
    }

}
