import express from 'express'
import { PORT} from './config.js'
import logger  from 'morgan'
import ProductRoutes from './routes/products.routes.js'
import CategoriaRoutes from './routes/categorias.routes.js'
import { errorHandler } from './app/middlewares/errorHandler.js';
import helmet from 'helmet'

const server = express()


server.use(helmet());
server.use(logger('dev'));

server.use(express.json());
server.disable('x-powered-by'); //deshabilitar el header x-powered-by express
server.use(errorHandler);

server.get('/',(req,res)=>{
    res.send('Hello world')
})



//Rutas
server.use('/products',ProductRoutes);
server.use('/categories',CategoriaRoutes)


server.use((req,res)=>{
    res.status(404).send('Error 404, no hay contenido para este endpoint');
})

server.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})