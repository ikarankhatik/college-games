import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fetch } from "../helper/dbFetch";
import { connect } from "react-redux";
import { login } from "../store/principleSlice";
import { Navigate } from "react-router-dom";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      isSubmitting: false,
    };
  }

  async signUpApi(data) {
    const path = "/api/principle/sign-up";
    return await Fetch(path, data);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;

    this.setState({ isSubmitting: true });

    const values = {
      name,
      email,
      password,
    };

    try {
      const response = await this.signUpApi(values);
      if (response.success) {
        toast.success("Signup successful");
        this.resetForm();
        return <Navigate to="/student-list" state={response.success} />;
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while signing up");
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  resetForm() {
    this.setState({
      name: "",
      email: "",
      password: "",
      isSubmitting: false,
    });
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { isLoggedIn } = this.props; // Access the Redux state

    if (isLoggedIn) {
      toast.info('Already logged in');
      return <Navigate to="/student-list" state={response.success} />;
    }

    const { name, email, password, isSubmitting, errors } = this.state;

    return (
      <>
        <div className="min-h-screen flex mt-20 justify-center">
          <div className="bg-gray-300 p-8 rounded-lg shadow-md w-[400px] h-[500px]">
            <h2 className="text-center text-2xl font-semibold mb-4">Sign Up</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className={`w-full p-2 border rounded-md`}
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className={`w-full p-2 border rounded-md`}
                  type="text"
                  id="email"
                  name="email"
                  value={email}
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
                  className={`w-full p-2 border rounded-md `}
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="text-center">
                <button
                  className="bg-orange-500 text-black font-bold py-2 px-4 rounded-md hover-bg-orange-600"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
  isLoggedIn: state.principle.isLoggedIn,
});

export default connect(mapStateToProps)(Signup);
