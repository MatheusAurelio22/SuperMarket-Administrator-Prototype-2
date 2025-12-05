import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__title">Supermarket Admin</div>

      <nav className="header__nav">
        <Link to="/products">Produtos</Link>
        <Link to="/promotions">Promoções</Link>
        <Link to="/users">Usuários</Link>
      </nav>
    </header>
  );
}
