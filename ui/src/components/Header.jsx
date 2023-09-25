import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/principleSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [signin, setSignin] = useState("Signin");
  const [showMenu, setShowMenu] = useState(false); // Add state for mobile menu

  const handleLoginSignup = () => {
    if (signin === "Sign In") {
      setSignin("Sign Up");
    } else {
      setSignin("Sign In");
    }
  };

  const handleLogout = () => {
    // Dispatch the logout action to update the login state
    dispatch(logout());
    // Redirect the user to the home screen
    navigate("/");
    toast.success("User logged out");
  };

  const toggleMobileMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMobileMenu = () => {
    setShowMenu(false);
  };

  return (
    <header>
      <div className="bg-orange-500 text-slate-100 ">
        <div className="flex justify-between p-4 items-center w-full h-10 bg-orange-500 text-slate-100">
          <div className="text-xl font-bold hover:cursor-pointer p-2">
            {isLoggedIn ? (
              "College Games"
            ) : (
              <Link to="/"> College Games </Link>
            )}
          </div>

          <div className="hidden md:flex space-x-5">
            <Link to="/students" className="text-sm font-semibold" onClick={closeMobileMenu}>
              Students
            </Link>
            <Link to="/colleges" className="text-sm font-semibold" onClick={closeMobileMenu}>
              Colleges
            </Link>
            <Link to="/competetion" className="text-sm font-semibold" onClick={closeMobileMenu}>
              Competetions
            </Link>
          </div>

          <div className="text-xl font-bold hover:cursor-pointer">
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <Link to={signin === "Sign In" ? "/" : "/sign-up"} onClick={closeMobileMenu}>
                <button onClick={handleLoginSignup}>{signin}</button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div
            className="md:hidden cursor-pointer text-3xl"
            onClick={toggleMobileMenu}
          >
            ☰
          </div>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="md:hidden bg-white text-black py-2">
            <Link
              to="/students"
              className="block px-4 py-2 text-sm font-semibold"
              onClick={closeMobileMenu}
            >
              Students
            </Link>
            <Link
              to="/colleges"
              className="block px-4 py-2 text-sm font-semibold"
              onClick={closeMobileMenu}
            >
              Colleges
            </Link>
            <Link
              to="/competetion"
              className="block px-4 py-2 text-sm font-semibold"
              onClick={closeMobileMenu}
            >
              Competetions
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
