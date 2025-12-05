import React, { useEffect, useState } from "react";
import { getProducts, applyPromo, removePromo } from "../services/api";

export default function Promotions() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    getProducts(token).then(setProducts);
  }, []);

  async function apply() {
    const token = localStorage.getItem("token");
    const r = await applyPromo(selected, { type, value }, token);
    alert(r.message || "Promoção aplicada!");

    const list = await getProducts(token);
    setProducts(list);
  }

  async function remove() {
    const token = localStorage.getItem("token");
    const r = await removePromo(selected, token);
    alert(r.message || "Promoção removida!");

    const list = await getProducts(token);
    setProducts(list);
  }

  return (
    <div className="form-card">
      <h2>Gerenciar Promoções</h2>

      <form className="styled-form">
        <label>Produto:</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">-- selecione --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - R$ {p.price}
            </option>
          ))}
        </select>

        <label>Tipo da Promoção:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="percent">Percentual (%)</option>
          <option value="value">Desconto Fixo (R$)</option>
        </select>

        <label>Valor:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === "percent" ? "Ex: 10 para 10%" : "Ex: 5 para R$ 5"}
        />

        <div className="btn-group">
          <button type="button" className="btn-primary" onClick={apply}>
            Aplicar Promoção
          </button>

          <button type="button" className="btn-danger" onClick={remove}>
            Remover Promoção
          </button>
        </div>
      </form>
    </div>
  );
}
