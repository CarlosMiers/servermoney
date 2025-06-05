import express, { Application } from "express";
import cors from "cors";
import config from "./config/varenv";
import routesUsuarios from "./routes/users";
import routesClientes from "./routes/clientes";
import routesCajas from "./routes/cajas";
import routesProductos from "./routes/productos";
import routesPreventa from "./routes/preventa";
import routesVentas from "./routes/ventas";

const app: Application = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json({
  limit: "5mb"
}));

const basepath: string = config.basepath;

console.log(`Basepath: ${basepath}`);

app.use(`/${basepath}/v1/users`, routesUsuarios);

app.use(`/${basepath}/v1/cliente`, routesClientes);
app.use(`/${basepath}/v1/cliente/id`, routesClientes);

app.use(`/${basepath}/v1/caja`, routesCajas);
app.use(`/${basepath}/v1/caja/id`, routesCajas);

app.use(`/${basepath}/v1/producto`, routesProductos);
app.use(`/${basepath}/v1/producto/id`, routesProductos);
app.use(`/${basepath}/v1/preventa`, routesPreventa);
app.use(`/${basepath}/v1/preventa/id`, routesPreventa);
app.use(`/${basepath}/v1/preventa-listado`, routesPreventa);

app.use(`/${basepath}/v1/ventas`, routesVentas);
app.use(`/${basepath}/v1/ventas/id`, routesVentas);
app.use(`/${basepath}/v1/ventas-listado`, routesVentas);



app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;