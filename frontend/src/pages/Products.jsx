import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  color: #333;
`;

const AddButton = styled.button`
  background: #4b57e3;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-bottom: 25px;
  font-size: 16px;

  &:hover {
    background: #3a46c0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th {
    background: #f4f5ff;
    padding: 12px;
    text-align: left;
    color: #333;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  tr:hover td {
    background: #fafafa;
  }
`;

const EditBtn = styled(Link)`
  background: #ffa500;
  padding: 6px 12px;
  border-radius: 6px;
  color: #fff;
  text-decoration: none;
  margin-right: 10px;

  &:hover {
    background: #cc8400;
  }
`;

const DeleteBtn = styled.button`
  background: #e74c3c;
  padding: 6px 12px;
  border-radius: 6px;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const PromoTag = styled.span`
  background: #ff4444;
  color: #fff;
  padding: 3px 6px;
  font-size: 11px;
  border-radius: 4px;
  margin-left: 6px;
`;

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert("Erro ao excluir produto");
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container>
      <Title>Lista de Produtos</Title>

      <AddButton onClick={() => navigate("/products/add")}>
         Adicionar Produto
      </AddButton>

      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>

                <td>
                  {p.promo_price ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#777" }}>
                        R$ {Number(p.price).toFixed(2)}
                      </span>

                      <br />

                      <span style={{ color: "#d9534f", fontWeight: "bold" }}>
                        R$ {Number(p.promo_price).toFixed(2)}
                      </span>

                      <PromoTag>PROMO</PromoTag>
                    </>
                  ) : (
                    <>R$ {Number(p.price).toFixed(2)}</>
                  )}
                </td>

                <td>{p.quantity ?? "—"}</td>

                <td>
                  <EditBtn to={`/products/edit/${p.id}`}>Editar</EditBtn>
                  <DeleteBtn onClick={() => deleteProduct(p.id)}>
                    Excluir
                  </DeleteBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
