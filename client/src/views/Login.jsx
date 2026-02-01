import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router";
import Button from "./../components/Button";
import Input from "./../components/Input";
import Navbar from "./../components/Navbar";
import { setPageTitle } from "./../utils";

function Login() {
  useEffect(() => {
    setPageTitle("Login - TinyTours");
  }, []);

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const checkUserLogin = async () => {
    const response = await axios.post("http://localhost:8080/login", loginUser);

    console.log(response.data);

    if (response.data.success) {
      toast.success(response.data.message, { id: "loginSuccess" });
      setLoginUser({
        email: "",
        password: "",
      });

      const { jwtToken, data } = response.data;

      localStorage.setItem("userJwtToken", jwtToken);
      localStorage.setItem("userData", JSON.stringify(data));

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      toast.error(response.data.message, { id: "loginError" });
    }
  };

  return (
    <div>
      <Navbar />

      <div className="w-75 block mx-auto mt-10">
        <Input
          type="email"
          placeholder="Email"
          value={loginUser.email}
          onChange={(e) => {
            setLoginUser({ ...loginUser, email: e.target.value });
          }}
        />

        <Input
          type="password"
          placeholder="Password"
          value={loginUser.password}
          onChange={(e) => {
            setLoginUser({ ...loginUser, password: e.target.value });
          }}
        />

        <Button title="Login" onClick={checkUserLogin} />

        <Link to="/signup" className="my-2 block text-blue-500">
          Don't have an account? Signup
        </Link>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
