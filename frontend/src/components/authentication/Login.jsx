import { useState } from "react";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { Toaster,toaster } from "@/components/ui/toaster"
import { LuEye, LuEyeClosed } from "react-icons/lu";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevents form reload
    //console.log({ name, email, password });
    if (!email || !password) {
                  toaster.create({
            title: "Please Fill all the fields!",
            type: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
    return;
  }
  //console.log({ name, email, password, pic });
  try{
    const config ={
      headers:{
        "Content-type":"application/json",
      },
    };
    
    const {data} = await axios.post("/api/user/login",{email,password},config);
          toaster.create({
            title: "Login successful!",
            type: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
  localStorage.setItem('userInfo',JSON.stringify(data));
setTimeout(() => {
  navigate('/chats');
}, 500);
  }
  catch(error)
  {
                    if (error.response && error.response.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Display each validation error as a separate toast
          error.response.data.errors.forEach((errMsg) => {
            toaster.create({
              title: "Validation Error",
              description: errMsg,
              type: "error",
              duration: 2000,
              isClosable: true,
              position: "bottom",
            });
          });
        } else if (error.response.data.message) {
          // Display the error message from the server
          toaster.create({
            title: "Error",
            description: error.response.data.message,
            type: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
        } else {
          // Fallback for unexpected error structures
          toaster.create({
            title: "Error",
            description: "An unexpected error occurred.",
            type: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
        }
      } else {
        // Display a generic error message
        toaster.create({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          type: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  return (
        <>
            <Toaster />
    <div style={{
        textAlign:'start',
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "2px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        background: "whiteAlpha.200",
      }}>
    <form
      onSubmit={handleSubmit}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      {/* Email Field */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          required
        />
      </div>

      {/* Password Field */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showPassword ? <LuEye/>:<LuEyeClosed/>  }
          </button>
        </div>
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom:"10px",
          borderRadius: "4px",
          border: "none",
          background: "#5ad04c",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
      {/* Submit Button */}
      <button
        type="button"
        onClick={()=>{
            setEmail("guest@example.com")
            setPassword("12345678")
          }} 
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "none",
          background: '#920000',
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Get Guest Credentials
      </button>
      </div>
      </>
  );
};

export default Login;
