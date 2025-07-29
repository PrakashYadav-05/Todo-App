import React, { useState, useEffect } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setLoggedIn(true);
      fetchTodos();
    } else {
      alert('Invalid credentials');
    }
  };

  const fetchTodos = async () => {
    const res = await fetch('http://localhost:5000/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    const res = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    });
    const newItem = await res.json();
    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  const updateTodo = async (id) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => (t.id === id ? updated : t)));
    setEditId(null);
    setEditText('');
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input
          id="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br /><br />
        <input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br /><br />
        <button id="login-button" onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Todo List</h2>
      <input
        placeholder="New Todo"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button onClick={() => updateTodo(todo.id)}>Save</button>
              </>
            ) : (
              <>
                {todo.text}{' '}
                <button onClick={() => {
                  setEditId(todo.id);
                  setEditText(todo.text);
                }}>Edit</button>{' '}
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
