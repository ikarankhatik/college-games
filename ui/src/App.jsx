import { Outlet } from "react-router"
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import appStore from "./store/appStore";

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

export default App
