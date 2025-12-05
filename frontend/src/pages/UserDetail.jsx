import React, { useEffect, useState } from "react";
import { getUser, uploadUserPhoto } from "../services/api";
import { useParams } from "react-router-dom";
import "./userDetail.css";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUser(id, token).then(setUser);
  }, [id]);

  async function upload(e) {
    e.preventDefault();

    if (!file) {
      alert("Selecione uma foto antes de enviar.");
      return;
    }

    const token = localStorage.getItem("token");
    const r = await uploadUserPhoto(id, file, token);

    alert(r.message || "Foto atualizada!");

    const u = await getUser(id, token);
    setUser(u);
  }

  if (!user) return <div className="loading">Carregando...</div>;

  return (
    <div className="user-detail-container">
      <div className="user-card">
        <div className="user-info">
          <h2>{user.name}</h2>
          <p className="email">{user.email}</p>

          {user.photo ? (
            <img
              src={`http://localhost:4000${user.photo}`}
              alt="Foto do usuário"
              className="user-photo"
            />
          ) : (
            <div className="no-photo">Sem foto</div>
          )}
        </div>

        <form className="upload-form" onSubmit={upload}>
          <label className="label">Enviar nova foto:</label>

          <input
            type="file"
            className="file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="primary-btn">Enviar</button>
        </form>
      </div>
    </div>
  );
}
