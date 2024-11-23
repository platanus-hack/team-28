import express from 'express';
import cors from 'cors';

import aiRouter from './openAi.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', aiRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
