import Logo from '../../shared/logo/Logo';
import './Header.css';

const Header: React.FC = () => {
  return (
    <nav>
      <Logo />

      <h1>FInding Falcone!</h1>

      <div className="header-nav">
        <button className="action-btn">Rules</button>|<div>Home</div>
      </div>
    </nav>
  );
};

export default Header;
