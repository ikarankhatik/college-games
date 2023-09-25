import React, { useState } from 'react';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Fetch } from '../helper/dbFetch';

const Signup = () => {

  const navigate = useNavigate();
  // Initialize state variables for name, email, and password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Initialize state variables for validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous validation errors
    setEmailError('');
    setPasswordError('');

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    const data = {name,email,password}
    signUpApi(data)
  };

  //sending data to the sign up api
  async function signUpApi(data) {
    const path = "/api/principle/sign-up";    
    const response = await Fetch(path, data);
    if (response.success) {      
      toast.success("Signup successfull");      
      navigate("/");
    } else {
      toast.info("User Already present");
    }
  }

  return (
    <>
      <div className="min-h-screen flex mt-20 justify-center">
        <div className="bg-gray-400 p-8 rounded-lg shadow-md w-[400px] h-[500px]">
          <h2 className="text-center text-2xl font-semibold mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Name
              </label>
              <input
                className="w-full p-2 border rounded-md"
                type="text"
                id="username"
                name="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="useremail">
                Email
              </label>
              <input
                className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : ''}`}
                type="text"
                id="useremail"
                name="useremail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`w-full p-2 border rounded-md ${passwordError ? 'border-red-500' : ''}`}
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="text-center">
              <button
                className="bg-orange-500 text-black font-bold py-2 px-4 rounded-md hover:bg-orange-600"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
