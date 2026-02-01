import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import { getUserData, logoutUser } from "../utils";
import imgLogo from "./../assets/logo.png";
import Avatar from "./Avatar";
import Button from "./Button";

function Navbar() {
  const [userData, setUserData] = useState({});

  const fetchUserData = () => {
    const data = getUserData();
    console.log("Fetched user data:", data);
    setUserData(data);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="bg-blue-300 px-4 py-2 flex justify-around items-center">
      <div>
        <Link to="/">
          <img src={imgLogo} alt="Logo" className="h-8 inline-block" />
          <span>Tiny Tours</span>
        </Link>
      </div>

      <div>
        {userData?.name ? (
          <div className="flex items-center">
            <Avatar name={userData.name} />
            Hello, {userData.name}!
            <Button variant="tertiary" title="Logout" onClick={logoutUser} />
          </div>
        ) : (
          <Link
            className="bg-white text-blue-500 px-3 py-1 rounded mr-2"
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default Navbar;
