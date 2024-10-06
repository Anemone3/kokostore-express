import express from 'express'
import { PORT} from './config.js'
import logger  from 'morgan'
import ProductRoutes from './routes/products.routes.js'
import CategoriaRoutes from './routes/categorias.routes.js'
import { errorHandler } from './app/middlewares/errorHandler.js';
import helmet from 'helmet'

const app = express()


app.use(helmet());
app.use(logger('dev'));

app.use(express.json());
app.disable('x-powered-by'); //deshabilitar el header x-powered-by express
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.send('Hello world')
})



//Rutas
app.use('/products',ProductRoutes);
app.use('/categories',CategoriaRoutes)


app.use((req,res)=>{
    res.status(404).send('Error 404, no hay contenido para este endpoint');
})

app.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})