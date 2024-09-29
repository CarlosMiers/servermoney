import dotenv from 'dotenv';
import Server from "./models/server";

//configuramos dotenv

dotenv.config();

//se instancia la clase server
const server = new Server();
server.listen();
