import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudent } from "../store/studentSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Get } from "../helper/dbFetch";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const isSubscribed = useSelector((state) => state.stripe.isSubscribed);

  const [collegeOption, setCollegeOption] = useState([]);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState("");

  useEffect(() => {
    getAllCollege();
  }, []);

  const getAllCollege = async () => {
    try {
      const path = "/api/college/get-all-college";
      const response = await Get(path);

      if (response.success) {
        setCollegeOption(response.colleges);
      } else {
        console.error("API request failed:", response?.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      college: "",
      photo: null,
      gender: "",
      address: "",
      hobbies: "",
      interestedGames: [],
      date: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      age: Yup.number()
        .required("Age is required")
        .positive("Age must be positive")
        .integer("Age must be an integer"),
      college: Yup.string().required("College is required"),
      photo: Yup.mixed().required("Photo is required"),
      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      hobbies: Yup.string(),
      date: Yup.date().required("Date is required"),
    }),
    onSubmit: async (values) => {
      // Restructure the data before sending to addStudentApi
      const hobbiesArray = values.hobbies
        .split(",")
        .map((hobby) => hobby.trim());
      const formattedData = {
        name: values.name,
        age: values.age,
        college: values.college,
        photo: values.photo,
        personalData: {
          gender: values.gender,
          address: values.address,
          hobbies: hobbiesArray,
        },
        interestedGames: values.interestedGames,
        date: values.date,
      };

      console.log(formattedData);

      try {
        const response = await addStudentApi(formattedData);
        if (response.success) {
          toast.success("Student data added successfully");
          dispatch(addStudent(response.student));
          formik.resetForm();
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) {
            fileInput.value = "";
          }
          setSelectedPhotoUrl("");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while creating student:", error);
        toast.error("An error occurred. Please try again later.");
      }
    },
  });

  const addStudentApi = async (studentData) => {
    let formData = new FormData();
    formData.append("name", studentData.name);
    formData.append("age", studentData.age);
    formData.append("college", studentData.college);
    formData.append("photo", studentData.photo);
    formData.append("personalData", JSON.stringify(studentData.personalData));
    formData.append(
      "interestedGames",
      JSON.stringify(studentData.interestedGames)
    );
    formData.append("date", studentData.date);

    try {
      const addedStudentResponse = await fetch(
        "http://localhost:4000/api/student/create",
        {
          method: "POST",
          body: formData,
        }
      );

      return await addedStudentResponse.json();
    } catch (error) {
      console.error("An error occurred while creating student:", error);
      toast.error("An error occurred. Please try again later.");
      return {
        success: false,
        message: "An error occurred while creating the student.",
      };
    }
  };

  if (!isLoggedIn) {
    toast.info("You need to log in first");
    navigate("/");
    return null;
  }

  if (!isSubscribed) {
    toast.info("You need to subscribe first");
    navigate("/subscription");
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-[900px]">
      <div className="my-5">
        <Link
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          to="/student-list"
        >
          Student Details
        </Link>
      </div>
      <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">
        <h2 className="text-xl font-semibold mb-2">Student Information</h2>

        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="mb-2">
            <label className="block text-gray-600 text-base">
              Student Name:
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">
              College Name:
            </label>
            <select
              name="college"
              value={formik.values.college}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.college && formik.errors.college
                  ? "border-red-500"
                  : ""
              }`}
            >
              <option value="">Select a College</option>
              {collegeOption.map((college) => (
                <option key={college._id} value={college._id}>
                  {college?.name}
                </option>
              ))}
            </select>
            {formik.touched.college && formik.errors.college && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.college}
              </p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Age:</label>
            <input
              type="number"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.age && formik.errors.age ? "border-red-500" : ""
              }`}
            />
            {formik.touched.age && formik.errors.age && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.age}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Image:</label>
            <input
              type="file"
              name="photo"
              onChange={(event) => {
                formik.setFieldValue("photo", event.currentTarget.files[0]);
                setSelectedPhotoUrl(
                  URL.createObjectURL(event.currentTarget.files[0])
                );
              }}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.photo && formik.errors.photo
                  ? "border-red-500"
                  : ""
              }`}
            />
            {selectedPhotoUrl && (
              <div>
                <img
                  src={selectedPhotoUrl}
                  alt="Selected"
                  className="mt-2 max-h-32"
                />
              </div>
            )}
            {formik.touched.photo && formik.errors.photo && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.photo}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Gender:</label>
            <input
              type="text"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.gender && formik.errors.gender
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Address:</label>
            <input
              type="text"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.address && formik.errors.address
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.address}
              </p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">
              Hobbies (comma-separated):
            </label>
            <input
              type="text"
              name="hobbies"
              value={formik.values.hobbies}
              onChange={formik.handleChange}
              className="w-full p-2 border rounded text-base"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">
              Interested Games:
            </label>
            <div className="space-y-2">
              {["Cricket", "Football", "Hockey", "Chess", "Badminton"].map(
                (game) => (
                  <label
                    key={game}
                    className="flex items-center cursor-pointer text-base"
                  >
                    <input
                      type="checkbox"
                      name="interestedGames"
                      value={game}
                      checked={formik.values.interestedGames.includes(game)}
                      onChange={formik.handleChange}
                      className="mr-2"
                    />
                    {game}
                  </label>
                )
              )}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Date:</label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded text-base ${
                formik.touched.date && formik.errors.date
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-orange-500 w-[150px] h-10 text-white py-1 px-2 rounded hover:bg-orange-600 mt-6 md:mt-0 text-lg"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
