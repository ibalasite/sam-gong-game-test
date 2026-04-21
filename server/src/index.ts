import { Server } from 'colyseus';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
// import { SamGongRoom } from './rooms/SamGongRoom'; // will be added in next phase

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });

// gameServer.define('sam_gong', SamGongRoom); // placeholder

const PORT = parseInt(process.env.PORT || '2567', 10);
httpServer.listen(PORT, () => {
  console.log(`[Server] Colyseus listening on port ${PORT}`);
});

export { gameServer };
