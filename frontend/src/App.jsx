import { Routes, Route, Link, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Promotions from './pages/Promotions';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Header from "./components/Header";

import './styles.css';

export default function App() {
  const token = localStorage.getItem('token');
  const isAuth = Boolean(token);

  return (
    <>
      {isAuth && <Header />}

      <main style={{ padding: "20px" }}>
        <Routes>

          {}
          <Route path="/" element={<Login />} />

          {}
          <Route
            path="/products"
            element={isAuth ? <Products /> : <Navigate to="/" />}
          />
          <Route
            path="/products/add"
            element={isAuth ? <AddProduct /> : <Navigate to="/" />}
          />
          <Route
            path="/products/edit/:id"
            element={isAuth ? <EditProduct /> : <Navigate to="/" />}
          />

          {}
          <Route
            path="/promotions"
            element={isAuth ? <Promotions /> : <Navigate to="/" />}
          />

          {}
          <Route
            path="/users"
            element={isAuth ? <Users /> : <Navigate to="/" />}
          />
          <Route
            path="/users/:id"
            element={isAuth ? <UserDetail /> : <Navigate to="/" />}
          />

        </Routes>
      </main>
    </>
  );
}
