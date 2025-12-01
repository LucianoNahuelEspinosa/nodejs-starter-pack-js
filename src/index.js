import 'module-alias/register.js';
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { corsOptions } from './config.js';

import logger from './middlewares/logger.js';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));
app.use(cors(corsOptions));
app.use(logger);

const server = createServer(app);
app.use("/api", routes);

server.listen(port, () => {
    console.info(`Server running on port ${port}`);
});