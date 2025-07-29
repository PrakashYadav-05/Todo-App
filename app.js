
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Dummy user
const user = {
  email: 'test@example.com',
  password: 'password123'
};

let todos = [{ id: 1, text: 'Learn Selenium' }];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === user.email && password === user.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Create todo
app.post('/api/todos', (req, res) => {
  const newTodo = { id: Date.now(), text: req.body.text };
  todos.push(newTodo);
  res.status(201).json(newTodo); // Use 201 for created
});

// Edit todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.text = req.body.text;
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length < initialLength) {
    res.status(204).send(); // 204 means "No Content"
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

if (require.main === module) {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
}

module.exports = app; // 👉 This line is key for testing
