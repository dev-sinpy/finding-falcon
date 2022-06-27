import LogoImage from '../../assets/images/logo.png';
import './Logo.css';

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img className="logoImg" src={LogoImage} alt="logo" />
    </div>
  );
};

export default Logo;
