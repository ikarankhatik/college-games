import React from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Fetch } from '../helper/dbFetch';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);  

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema : Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters long'),
      email: Yup.string()
        .required('Email is required')
        .email('Please enter a valid email address'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long'),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const response = await signUpApi(values);
        if (response.success) {
          toast.success('Signup successful');
          navigate('/');
          formik.resetForm();
        } else {
          toast.info(response.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An error occurred while signing up');
      }
    },
  });

  async function signUpApi(data) {
    const path = '/api/principle/sign-up';
    return await Fetch(path, data);
  }

  if(isLoggedIn === true){
    navigate("/student-list")
  }

  return (
    <>
      <div className="min-h-screen flex mt-20 justify-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-md w-[400px] h-[500px]">
          <h2 className="text-center text-2xl font-semibold mb-4">Sign Up</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className={`w-full p-2 border rounded-md ${
                  formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                }`}
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`w-full p-2 border rounded-md ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                }`}
                type="text"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`w-full p-2 border rounded-md ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>
            <div className="text-center">
              <button
                className="bg-orange-500 text-black font-bold py-2 px-4 rounded-md hover:bg-orange-600"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
