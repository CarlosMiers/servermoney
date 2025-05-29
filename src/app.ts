import express, { Application } from "express";
import cors from "cors";
import config from "./config/varenv";
import routesUsuarios from "./routes/usuarios";
import routesClientes from "./routes/clientes";
import routesProductos from "./routes/productos";
import routesPreventa from "./routes/preventa";

const app: Application = express();

app.use(express.json({
  limit: "5mb"
}));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

const basepath: string = config.basepath;

app.use(`/${basepath}/v1/users`, routesUsuarios);
app.use(`/${basepath}/v1/users/login`, routesUsuarios);
app.use(`/${basepath}/v1/cliente`, routesClientes);
app.use(`/${basepath}/v1/cliente/id`, routesClientes);
app.use(`/${basepath}/v1/producto`, routesProductos);
app.use(`/${basepath}/v1/producto/id`, routesProductos);
app.use(`/${basepath}/v1/preventa`, routesPreventa);
app.use(`/${basepath}/v1/preventa/id`, routesPreventa);
app.use(`/${basepath}/v1/preventa-listado`, routesPreventa);

export default app;