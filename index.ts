import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Route for fetching to-do list data
app.get('/todos', (req, res) => {
  const todos = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dummy-data', 'todos.json'), 'utf8'));
  res.json(todos);
});

// Route for updating to-do list data
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const updatedTodo = req.body;

  const todos = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dummy-data', 'todos.json'), 'utf8'));
  const updatedTodos = todos.map((todo: any) => (todo.id === id ? updatedTodo : todo));
  fs.writeFileSync(path.resolve(__dirname, 'dummy-data', 'todos.json'), JSON.stringify(updatedTodos, null, 2));

  res.json(updatedTodo);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});




















// PRIMER ZA MONGO
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log('MongoDB database connection established successfully');
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
