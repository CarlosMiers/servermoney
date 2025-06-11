import app from './app';
import config from "./config/varenv";

app.listen(config.port, () => {
  //console.log(`Servidor corriendo: http://localhost:${config.port}`);
  console.log(`Servidor corriendo: http://192.168.0.100:${config.port}`);
});