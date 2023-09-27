import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fetch } from '../helper/dbFetch';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { login } from '../store/principleSlice';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  // Initialize state variables for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  

  // Event handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    console.log('Email:', email);
    console.log('Password:', password);
    const data = {email, password}
    signInApi(data)
    // You can send the email and password to your server for authentication here
  };
  //feting the signnApi 
  async function signInApi(data) {
    const path = "/api/principle/sign-in";
    const response = await Fetch(path, data);
    if (response.success) {       
      toast.success("Login Successull")
      dispatch(login());
      navigate("/student-list");
    } else {
      toast.error("wrong credential");

    }
  }

  return (
    <>
      <div className="min-h-screen flex mt-20 justify-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-md w-[400px] h-[400px]">
          <h2 className="text-center text-2xl font-semibold mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="useremail">
                Email
              </label>
              <input
                className="w-full p-2 border rounded-md"
                type="email"
                id="useremail"
                name="useremail"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-2 border rounded-md"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on change
                required
              />
            </div>
            <div className="text-center">
              <button
                className="bg-orange-500 text-black font-bold py-2 px-4 rounded-md hover:bg-orange-600"
                type="submit"
              >
                Sign In
              </button>
            </div>
            <div className='text-black font-bold text-center mt-5 hover:cursor-pointer'>
              <Link to='/students'>Sign In as Guest?</Link>            
            </div>
          </form>
          
        </div>
      </div>
    </>
  );
};

export default Signin;
