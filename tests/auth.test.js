import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../server'; // importa o app do seu server.js

describe('Teste da API Hedonia', () => {
  it('GET / deve retornar mensagem de status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hedonia API Online');
  });

it('POST /auth/login com dados válidos deve retornar token', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'teste@hedonia.com',
      password: '123456'
    });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('token');
  expect(res.body.message).toBe('Login bem-sucedido');
});

it('POST /auth/login com dados inválidos deve retornar erro 401', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'naoexiste@hedonia.com',
      password: 'senhaerrada'
    });

  expect(res.statusCode).toBe(401);
  expect(res.body).toHaveProperty('error');
 });
  it('POST /auth/register com dados válidos deve retornar sucesso', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Usuário Teste',
        email: 'novo@hedonia.com',
        password: 'senha123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuário registrado com sucesso');
  });

  it('POST /auth/register com campos faltando deve retornar erro 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'semnome@hedonia.com',
        password: 'senha123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /auth/register com email já registrado deve retornar erro 409', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Outro Usuário',
        email: 'teste@hedonia.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe('Email já registrado');
  });

});