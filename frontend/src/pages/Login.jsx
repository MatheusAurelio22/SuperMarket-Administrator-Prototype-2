import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import styled from "styled-components";


const Container = styled.div`
  max-width: 380px;
  margin: 60px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #4b57e3;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #4b57e3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #3a46c0;
  }
`;


export default function Login() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  async function handle(e){
    e.preventDefault();
    
    try {
      const r = await login(email, password);

      console.log("Resposta do login:", r);

      if (r.token) {
        localStorage.setItem('token', r.token);
        nav('/products');
        return;
      }

      alert(r.message || "Falha no login");

    } catch (err) {
      console.error(err);
      alert("Erro ao conectar ao servidor");
    }
  }

  return (
    <Container>
      <Title>Login</Title>

      <form onSubmit={handle}>
        <Input 
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <Input 
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <Button type="submit">Entrar</Button>
      </form>

    </Container>
  );
}
