import { Outlet } from "react-router"
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import ReactDOM from 'react-dom/client'
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AddCollege from './components/AddCollege.jsx';
import CollegeDetails from './components/CollegeDetails.jsx';
import AddStudent from './components/AddStudent.jsx';
import StudentDetail from './components/StudentDetail.jsx';
import AddCompetition from './components/AddCompetition.jsx';
import CompetitionDetail from './components/CompetitionDetail.jsx';
import SubscriptionPrice from "./components/SubscriptionPrice";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriberAccount from "./components/SubscriberAccount";
const stripePromise = loadStripe('pk_test_51NxmblSEekr2cLoVVQrIJreB75cVLFsuONj6iHsr1pMELWtXFkeuF4LtZGK62fDZC0NkrpMLkZ4OO3uocj9jd05O00hohuqCku');

function App() {
  return (
    
    <Provider store={appStore}>
      <Elements stripe={stripePromise}>
     <Header/>
     <Outlet/>
     <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    </Elements>
    </Provider>
    
  )
}

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
        path: "/add-student",
        element: <AddStudent/>
      }, 
      {
        path: "/student-list",
        element: <StudentDetail/>
      }, 
      {
        path: "/add-college",
        element: <AddCollege/>
      },
      {
        path: "/college-list",
        element: <CollegeDetails/>
      },
      {
        path: "/add-competition",
        element: <AddCompetition/>
      },  
      {
        path: "/competition-list",
        element:<CompetitionDetail/>
      }, 
      {
        path: "/subscription",
        element:<SubscriptionPrice/>
      },
      {
        path: "/user-account",
        element:<SubscriberAccount/>
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={creatingRouter} />);


