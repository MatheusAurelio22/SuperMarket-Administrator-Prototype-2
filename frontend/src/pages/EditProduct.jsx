import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    type: "",
    description: "",
    expires_at: "",
    quantity: 0,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          alert("Erro ao carregar produto");
          return;
        }

        setProduct({
          name: data.name,
          price: data.price,
          type: data.type || "",
          description: data.description || "",
          expires_at: data.expires_at ? data.expires_at.slice(0, 10) : "",
          quantity: data.quantity || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Erro de conexão");
      }
    }

    fetchProduct();
  }, [id]);

  function handleChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function handleImage(e) {
    setImage(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name", product.name);
    fd.append("price", product.price);
    fd.append("type", product.type || "");
    fd.append("description", product.description || "");
    fd.append("expires_at", product.expires_at || "");
    fd.append("quantity", product.quantity);

    if (image) fd.append("image", image);

    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        alert("Erro ao atualizar produto");
        return;
      }

      alert("Produto atualizado com sucesso!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar atualização");
    }
  }

  if (loading) return <p className="loading">Carregando...</p>;

  return (
    <div className="form-card">
      <h2>Editar Produto</h2>

      <form onSubmit={handleSubmit} className="styled-form">
        <label>Nome:</label>
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />

        <label>Preço:</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Tipo:</label>
        <input name="type" value={product.type} onChange={handleChange} />

        <label>Descrição:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        />

        <label>Validade:</label>
        <input
          type="date"
          name="expires_at"
          value={product.expires_at}
          onChange={handleChange}
        />

        <label>Quantidade:</label>
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          required
        />

        <label>Nova imagem (opcional):</label>
        <input type="file" accept="image/*" onChange={handleImage} />

        <button type="submit" className="btn-primary">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
