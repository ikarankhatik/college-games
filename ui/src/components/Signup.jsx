import React, { useState, } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Fetch } from '../helper/dbFetch';
import {loadStripe} from '@stripe/stripe-js/pure';



const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState(''); // Updated: Use nameError instead of usernameError
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError(''); // Updated: Reset nameError
    setEmailError('');
    setPasswordError('');

    if (!name || name.length < 3) { // Updated: Validate the name field
      if(!name){
        setNameError("Name is required.")
      }else{
        setNameError('Name must be at least 3 characters long');
      }      
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      if(!email){
        setEmailError("Email is require");
      }else{
        setEmailError('Please enter a valid email address');
      }
      
      return;
    }

    if (password.length < 6) {
      if(!password){
        setPasswordError("Password is require!.");
      }else{
        setPasswordError('Password must be at least 6 characters long');
      }
      
      return;
    }

    setIsSubmitting(true);

    const data = { name, email, password }; // Updated: Remove username from data
    //calling payment method
     const res = await makePayment();
     console.log(res);
    try {
      const response = await signUpApi(data);
      if (response.success) {
        toast.success('Signup successful');
        navigate('/');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while signing up');
    } finally {
      setIsSubmitting(false);
    }
  };

  async function signUpApi(data) {
    const path = '/api/principle/sign-up';
    return await Fetch(path, data);
  }

  if(isLoggedIn){
    navigate('/student-list');
    toast.info("Already logged In")
    return null;
  }

  //payment integration

  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51NxmblSEekr2cLoVVQrIJreB75cVLFsuONj6iHsr1pMELWtXFkeuF4LtZGK62fDZC0NkrpMLkZ4OO3uocj9jd05O00hohuqCku")
    const body = {
      amount: 100,
      description: "Test payment",
      qnty:1,
      name:'Payment for Registration'
    }

    const headers = {
      "Content-Type":"application/json"
    }
    const response = await fetch("http://localhost:4000/api/stripe/create-checkout-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    })

    const session = await response.json();
    const result = stripe.redirectToCheckout({
      sessionId:session.id
    })

    if(result.error){
      console.log(result.error);
    }
    return result;
  }

  return (
    <>
      <div className="min-h-screen flex mt-20 justify-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-md w-[400px] h-[500px]">
          <h2 className="text-center text-2xl font-semibold mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className={`w-full p-2 border rounded-md ${nameError ? 'border-red-500' : ''}`}
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="useremail">
                Email
              </label>
              <input
                className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : ''}`}
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
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
                
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="text-center">
              <button
                className="bg-orange-500 text-black font-bold py-2 px-4 rounded-md hover:bg-orange-600"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
