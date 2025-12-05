import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import { Link } from "react-router-dom";
import "./users.css";

export default function Users() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers(token).then(setList);
  }, []);

  return (
    <div className="users-container">
      <h2 className="title">Usuários</h2>

      <div className="actions-card">
        <Link to="/users/1" className="primary-btn">
          Ver usuário (exemplo)
        </Link>
      </div>

      <div className="users-list">
        {list.map((u) => (
          <div key={u.id} className="user-item">
            <span className="user-name">{u.name}</span>
            <span className="user-email">{u.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
