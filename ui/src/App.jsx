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

function App() {
  return (
    
    <Provider store={appStore}>
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
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={creatingRouter} />);


