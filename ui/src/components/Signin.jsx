import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { login } from "../store/principleSlice";
import { subscribed, unsubscribed } from "../store/stripeSlice";
import { Fetch } from "../helper/dbFetch";
// import withRouter from '../helper/withRouter'
import { Navigate } from "react-router-dom"

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { dispatch } = this.props;

    // Fetch the signInApi
    const path = "/api/principle/sign-in";
    const response = await Fetch(path, { email, password });

    if (response.success) {
      toast.success("Login Successful");
      dispatch(login());
      
      console.log(response.isSubcribe);
      if (response.isSubcribe) {
        dispatch(subscribed());
        console.log("User subscribed");
      } else {
        dispatch(unsubscribed());
      }
    } else {
      toast.error("Wrong credentials");
    }
    return <Navigate to="/student-list" state={response.success}/>
  };

  render() {
    const { isLoggedIn } = this.props;

    if (isLoggedIn) {
      return <Navigate to="/student-list" />
      return null;
    }

    return (
      <div className="min-h-screen flex mt-20 justify-center">
        <div className="bg-gray-300 p-8 rounded-lg shadow-md w-[400px] h-[400px]">
          <h2 className="text-center text-2xl font-semibold mb-4">Sign In</h2>
          <form onSubmit={this.handleSubmit}>
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
                value={this.state.email}
                onChange={this.handleInputChange}
              />
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
                value={this.state.password}
                onChange={this.handleInputChange}
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
            <div className="text-black font-bold text-center mt-5 hover:cursor-pointer"></div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.principle.isLoggedIn,
});

export default connect(mapStateToProps)(Signin);
