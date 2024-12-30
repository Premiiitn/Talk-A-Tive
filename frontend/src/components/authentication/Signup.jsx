/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster,toaster } from "@/components/ui/toaster";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Ref for file input
  const fileInputRef = useRef(null);

  const handleFileUpload = (picFile) => {
    if (!picFile) {
      toaster.create({
        title: "Please select an image file.",
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      resetFileInput();
      return;
    }

    if (picFile.type === "image/jpeg" || picFile.type === "image/png") {
      const data = new FormData();
      data.append("file", picFile);
      data.append("upload_preset", "Talk-A-Tive");
      data.append("cloud_name", "diaxqtnt2");

      fetch("https://api.cloudinary.com/v1_1/diaxqtnt2/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          toaster.create({
            title: "Image uploaded successfully!",
            type: "success",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((err) => {
          toaster.create({
            title: "Failed to upload the image.",
            type: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom",
          });
          resetFileInput();
        });
    } else {
      toaster.create({
        title: "Only JPEG or PNG images are allowed.",
        type: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      resetFileInput();
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
    setPic(null); // Clear the state for the uploaded picture
  };

const handleSubmit = async (e) => {
  e.preventDefault(); 

  if (!name || !email || !password || !confirmPassword ) {
    toaster.create({
      title: "Please fill in all fields!",
      type: "error",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  if (password !== confirmPassword) {
    toaster.create({
      title: "Passwords do not match!",
      type: "warning",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Prepare the payload
    const payload = pic
      ? { name, email, password, pic }
      : { name, email, password };

    // Make the registration request
    const response = await axios.post("/api/user", payload, config);

    // Extract the data from the response
    const userData = response.data;

    // **Store the user data (including the token) in localStorage**
    localStorage.setItem('userInfo', JSON.stringify(userData));

    // **Set the default Authorization header for Axios**
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

    // **Display success toaster**
    toaster.create({
      title: "Signup successful!",
      type: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });

    // **Navigate to /chats**
    navigate('/chats');
  } catch (error) {
    console.log(error);

    // Check if the error response contains validation errors
    if (error.response && error.response.data && error.response.data.errors) {
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
      <form
        onSubmit={handleSubmit}
        style={{
          textAlign: "start",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "20px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "whiteAlpha.200",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h2>

        {/* Name Field */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
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
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="confirmPassword"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Picture Upload Field */}
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="picture"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Upload Picture
          </label>
          <input
            id="picture"
            type="file"
            accept="image/*"
            ref={fileInputRef} // Attach the ref here
            onChange={(e) => {
              handleFileUpload(e.target.files[0]);
            }}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          id="signup"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "none",
            background: "#5ad04c",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>
    </>
  );
};

export default Signup;
