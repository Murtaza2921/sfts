import http from "http";
import { app } from "./app";
import dotenv from 'dotenv';
const server = http.createServer(app);

// create server
dotenv.config();
server.listen(process.env.PORT, () => {
  console.log(`Server is connected with port ${process.env.PORT}`);
});
