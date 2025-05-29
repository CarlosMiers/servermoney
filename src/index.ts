import app from './app';
import config from "./config/varenv";

app.listen(config.port, () => {
  console.log(`Servidor corriendo: http://localhost:${config.port}`);
});