import express, { Application } from "express";
import cors from "cors";
import config from "./config/varenv";

import routesUsuarios from "./routes/users";
import routesClientes from "./routes/clientes";
import routesCajas from "./routes/cajas";
import routesProductos from "./routes/productos";
import routesPreventa from "./routes/preventa";
import routesVentas from "./routes/ventas";
import routesConfig from "./routes/config";
import routesCobranzas from "./routes/cobranzas";

const app: Application = express();

// ✅ Configuración de CORS completamente abierta
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// ✅ También activar cors globalmente
app.use(cors());

// 📦 Body parser (JSON)
app.use(express.json({ limit: "5mb" }));

// 🛣️ Base path desde env
const basepath: string = config.basepath || 'serverapp';
console.log(`✅ Basepath configurado: /${basepath}`);

// 📌 Rutas API
app.use(`/${basepath}/v1/config`, routesConfig);
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
app.use(`/${basepath}/v1/cobranzas-listado`, routesCobranzas);


// ❌ Manejo de errores globales

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error interno no controlado:');
  console.error(err.stack); // stack trace detallado
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }), // opcional para ver desde frontend
  });
});



export default app;
