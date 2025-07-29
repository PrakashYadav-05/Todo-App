
// const request = require('supertest');
// const { expect } = require('chai');
// const app = require('./app'); // Update path if your server file is elsewhere

// describe('Backend API Tests', () => {
//   let createdTodoId;

//   // ✅ LOGIN TESTS
//   it('Login with valid credentials', async () => {
//     const res = await request(app)
//       .post('/api/login')
//       .send({ email: 'test@example.com', password: 'password123' });

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property('message', 'Login successful');
//   });

//   it('Login with invalid credentials', async () => {
//     const res = await request(app)
//       .post('/api/login')
//       .send({ email: 'wrong@example.com', password: 'wrongpass' });

//     expect(res.status).to.equal(401);
//     expect(res.body).to.have.property('error', 'Invalid credentials');
//   });

//   // ✅ GET TODOS
//   it('Get all todos', async () => {
//     const res = await request(app).get('/api/todos');
//     expect(res.status).to.equal(200);
//     expect(res.body).to.be.an('array');
//   });

//   // ✅ CREATE
//   it('Add a new todo', async () => {
//     const res = await request(app)
//       .post('/api/todos')
//       .send({ text: 'Test todo item' });

//     expect(res.status).to.equal(200); // Or 201 if backend is updated
//     expect(res.body).to.have.property('id');
//     createdTodoId = res.body.id;
//   });

//   // ✅ UPDATE
//   it('Update a todo item', async () => {
//     const res = await request(app)
//       .put(`/api/todos/${createdTodoId}`)
//       .send({ text: 'Updated todo item' });

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property('message', 'Todo updated');
//   });

//   // ✅ DELETE
//   it('Delete a todo item', async () => {
//     const res = await request(app).delete(`/api/todos/${createdTodoId}`);
//     expect(res.status).to.equal(200); // Or 204 if backend is updated
//   });
// });

const request = require('supertest');
const app = require('./app');
const { expect } = require('chai');

describe('Backend API Tests', () => {
  let todoId; // Store ID for update/delete

  it('Login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('Login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@example.com', password: 'wrongpass' });

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
    expect(res.body).to.have.property('message');
  });

  it('Get all todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Add a new todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ text: 'Write API tests' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.text).to.equal('Write API tests');

    todoId = res.body.id; // Save ID for update/delete
  });

  it('Update a todo item', async () => {
    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ text: 'Updated todo text' });

    expect(res.status).to.equal(200);
    expect(res.body.text).to.equal('Updated todo text');
  });

  it('Delete a todo item', async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`);
    expect(res.status).to.equal(204); // No content
  });
});