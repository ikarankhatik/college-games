import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Students from './components/Students.jsx';
import College from './components/College.jsx';
import Competition from './components/Competition.jsx';

const creatingRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Signin />,
      },   
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/students",
        element: <Students/>
      }, 
      {
        path: "/colleges",
        element: <College/>
      },
      {
        path: "/competetion",
        element: <Competition/>
      },  
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={creatingRouter} />);


