//importamos express para empezar a desarrollar las apis

import cors from "cors";
import express, { Application } from "express";
import routesUsuarios from '../routes/usuarios';
import routesClientes from '../routes/clientes';
import routesProductos from '../routes/productos';
import { UserModel } from './usuarios';
import routesPreventa from '../routes/preventa';


class Server {
    private app: Application;
    private port: string;
    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Aplicacion corriendo en el puerto " + this.port);
        })
    }

    routes() {
        this.app.use('/api/v1/users', routesUsuarios);
        this.app.use('/api/v1/users/login', routesUsuarios);
        
        this.app.use('/api/v1/cliente', routesClientes);
        this.app.use('/api/v1/cliente/id', routesClientes);
        
        this.app.use('/api/v1/producto', routesProductos);
        this.app.use('/api/v1/producto/id', routesProductos);

        this.app.use('/api/v1/preventa', routesPreventa);
        this.app.use('/api/v1/preventa/id', routesPreventa);

        this.app.use('/api/v1/preventa-listado', routesPreventa);        
        
    }

    midlewares() {
        // Configurar cabeceras y cors
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });

        //parseo body
        this.app.use(express.json());
        //Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await UserModel.sync()
        } catch (error) {
            console.log("Error de conexion a Base de Datos", error);
        }
    }

}


export default Server;