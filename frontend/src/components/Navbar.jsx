import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const navItems = [
  { label: "홈", to: "/" },
  { label: "도감" },
  { label: "계산", to: "/calculator" },
  { label: "샘플" },
  { label: "파티" },
];

function Navbar() {

  return (
    <nav className="navbar">
      <h1 className="navbar__title">Pokédemy</h1>
      <div className="navbar__links">
        {navItems.map((item) =>
          item.to ? (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `navbar__link${isActive ? " navbar__link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ) : (
            <span key={item.label} className="navbar__link navbar__link--disabled">
              {item.label}
            </span>
          )
        )}
      </div>
      <button type="button" className="navbar__login">
        로그인
      </button>
    </nav>
  );
}

export default Navbar;
