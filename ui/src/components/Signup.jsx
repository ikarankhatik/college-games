import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Fetch } from '../helper/dbFetch';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState(''); // Updated: Use nameError instead of usernameError
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                id="useremail"
                name="useremail"
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
