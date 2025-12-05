import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
    expires_at: "",
    quantity: 0,
  });

  const [image, setImage] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("type", form.type || "");
    fd.append("description", form.description || "");
    fd.append("expires_at", form.expires_at || "");
    fd.append("quantity", form.quantity);

    if (image) {
      fd.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const err = await res.text();
        console.log(err);
        alert("Erro ao criar produto");
        return;
      }

      alert("Produto criado com sucesso!");
      navigate("/products");

    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
    }
  }

  return (
    <div className="container">
      <h2>Adicionar Produto</h2>

      <form onSubmit={handleSubmit} className="product-form">
        
        <label>Nome</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Preço</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Tipo</label>
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
        />

        <label>Descrição</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Validade</label>
        <input
          type="date"
          name="expires_at"
          value={form.expires_at}
          onChange={handleChange}
        />

        <label>Quantidade</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          min="0"
        />

        <label>Imagem do produto</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        <button className="btn-save">
          Salvar
        </button>

      </form>
    </div>
  );
}
