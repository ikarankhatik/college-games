import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/principleSlice";
import { subscribed, unsubscribed } from "../store/stripeSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {Fetch} from "../helper/dbFetch";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);

  // formik for handler for form submission
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid Email"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      signInApi(values);
    },
  });

  // fetching the signInApi
  async function signInApi(data) {
    const path = "/api/principle/sign-in";
    const response = await Fetch(path, data); // Assuming Fetch is defined and works correctly

    console.log(response);

    if (response.success) {
      toast.success("Login Successful");
      dispatch(login());

      if (response.isSubscribed) { // Fix typo: isSubcribe should be isSubscribed
        dispatch(subscribed());
        console.log("User subscribed");
      } else {
        dispatch(unsubscribed()); // Assuming you have an unsubscribed action in your stripeSlice
      }

      navigate("/student-list");
    } else {
      toast.error("Wrong credentials");
    }
  }

  if (isLoggedIn) {
    navigate("/student-list");
    return null;
  }

  return (
    <>
      <div className="min-h-screen flex mt-20 justify-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-md w-[400px] h-[400px]">
          <h2 className="text-center text-2xl font-semibold mb-4">Sign In</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full p-2 border rounded-md"
                type="text"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full p-2 border rounded-md"
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}
            </div>
            <div className="text-center">
              <button
                className="bg-orange-500 text-black font-bold py-2 px-4 rounded-md hover:bg-orange-600"
                type="submit"
              >
                Sign In
              </button>
            </div>
            <div className="text-black font-bold text-center mt-5 hover:cursor-pointer">
              <Link to="/students">Sign In as Guest?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
