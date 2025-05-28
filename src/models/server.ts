import cors from "cors";
import express, { Application } from "express";
import routesUsuarios from "../routes/usuarios";
import routesClientes from "../routes/clientes";
import routesProductos from "../routes/productos";
import { UserModel } from "./usuarios";
import routesPreventa from "../routes/preventa";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3001";
    this.midlewares();
    this.routes();
    this.dbConnect();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Aplicación corriendo en el puerto " + this.port);
    });
  }

  routes() {
    this.app.use("/api/v1/users", routesUsuarios);
    this.app.use("/api/v1/users/login", routesUsuarios); // Verifica esta ruta
    this.app.use("/api/v1/cliente", routesClientes);
    this.app.use("/api/v1/cliente/id", routesClientes);
    this.app.use("/api/v1/producto", routesProductos);
    this.app.use("/api/v1/producto/id", routesProductos);
    this.app.use("/api/v1/preventa", routesPreventa);
    this.app.use("/api/v1/preventa/id", routesPreventa);
    this.app.use("/api/v1/preventa-listado", routesPreventa);
  }

  midlewares() {
    // Configuración de CORS para permitir que el frontend de localhost 8100 acceda
    this.app.use(
      cors({
        origin: "*", // Permite solicitudes solo desde este origen
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Cabeceras permitidas
        preflightContinue: false, // No pasar a la siguiente función
        optionsSuccessStatus: 204, // Código de estado exitoso para las respuestas OPTIONS
      })
    );

    // Configuración para procesar solicitudes JSON
    this.app.use(express.json());

    // Responder correctamente a las solicitudes OPTIONS
    this.app.options("*", (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
      res.status(204).send(); // Responde con el código 204 (sin contenido)
    });
  }

  async dbConnect() {
    try {
      await UserModel.sync();
    } catch (error) {
      console.log("Error de conexión a la Base de Datos", error);
    }
  }
}

export default Server;
