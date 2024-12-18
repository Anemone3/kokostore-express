import express from 'express'
import { PORT} from './config.js'
import cors from 'cors';
import logger  from 'morgan';
import multer from 'multer';
import ProductRoutes from './routes/products.routes.js'
import CategoriaRoutes from './routes/categorias.routes.js'
import UserRoutes from './routes/users.routes.js'
import  OrderRoutes from './routes/orders.routes.js'
import { errorHandler } from './app/middlewares/errorHandler.js';
import helmet from 'helmet'


const app = express()

const upload = multer({dest: 'uploads/'})
app.use(cors());

app.use(helmet());
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.disable('x-powered-by'); //deshabilitar el header x-powered-by express
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.send('Hello world')
})


app.post('/api/upload', upload.single('file'),(req,res)=>{
    console.log(req.file)
    res.send('upload')
})
//Rutas
app.use('/products',ProductRoutes);
app.use('/categories',CategoriaRoutes)
app.use('/users',UserRoutes)
app.use('/order',OrderRoutes)
app.use((req,res)=>{
    res.status(404).send('Error 404, no hay contenido para este endpoint');
})

app.listen(PORT, ()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})