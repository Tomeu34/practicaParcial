const request = require('supertest');
const app = require('./app'); // Asegúrate de exportar tu app de Express
let jwtToken;

// Antes de todos los tests: crea un usuario y obtén token
beforeAll(async () => {
  const res = await request(app)
    .post('/api/user/register')
    .send({
      email: 'tomeu@gmail.com',
      password: '12345678',
    });
    //console.log(res.body)
  jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODY1ODE1ZmI3ZThiZGU0ZTdmZTdmYWUiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzUxNDgyNzE5LCJleHAiOjE3NTE2NTU1MTl9.ONIi-MN5AXSsXMjpx2CSQhVZD2nI4vRmQFzWqCURnxI";
});

describe('User Endpoints', () => {
  test('Login correcto', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'tomeu@gmail.com',
      password: '12345678',
    });

    //expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Validar usuario con código incorrecto', async () => {
    const res = await request(app)
      .put('/api/user/validate')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ code: '000000' });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('Obtener usuario con token', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });
});

describe('Client Endpoints', () => {
  let clientId;

  test('Crear cliente', async () => {
    const res = await request(app)
      .post('/api/client')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Cliente Test' });

    expect(res.statusCode).toBe(201);
    clientId = res.body._id;
  });

  test('Obtener todos los clientes', async () => {
    const res = await request(app)
      .get('/api/client')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('Obtener cliente por ID', async () => {
    const res = await request(app)
      .get(`/api/client/${clientId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Cliente Test');
  });
});
