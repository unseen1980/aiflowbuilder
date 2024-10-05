const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

let pipelines = [];

app.post('/api/pipelines', (req, res) => {
  const pipeline = req.body;
  pipeline.id = Date.now().toString();
  pipelines.push(pipeline);
  res.json(pipeline);
});

app.get('/api/pipelines', (req, res) => {
  res.json(pipelines);
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});