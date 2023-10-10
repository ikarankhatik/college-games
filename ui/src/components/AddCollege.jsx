import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCollege } from "../store/collegeSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddCollege = () => {
  const navigate = useNavigate();
  const [collegeData, setCollegeData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const isSubscribed = useSelector((state) => state.stripe.isSubscribed);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      // Handle file input separately
      const file = e.target.files[0];
      // Display the selected image preview
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImageUrl(imageUrl);
      } else {
        setSelectedImageUrl(""); // Clear the image URL if no file is selected
      }
      setCollegeData({
        ...collegeData,
        [name]: file,
      });
    } else {
      setCollegeData({
        ...collegeData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(collegeData);
    let formData = new FormData();
    formData.append("name", collegeData.name);
    formData.append("description", collegeData.description);
    formData.append("image", collegeData.image);

    const collegeData2 = await fetch(
      "http://localhost:4000/api/college/create",
      {
        method: "POST",
        body: formData,
      }
    );
    const addedCollege = await collegeData2.json();

    if (addedCollege.success) {
      dispatch(addCollege(addedCollege.savedCollege));
      toast.success("College data added Successfully");
      setCollegeData({
        name: "",
        description: "",
        image: "",
      });
      setSelectedImageUrl("");
      // Reset the file input value to clear the selected file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = ""; // Reset the file input value
      }
    } else {
      toast.info("Enter other College Name");
    }
  };

if(isLoggedIn === false){
    toast.info("You need to Login first ")
    navigate('/');    
    return null;
  }
  if(isSubscribed === false){
    toast.info("You need to subscribe first ")
    navigate('/subscription');    
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="my-5">
        <Link
          className="bg-orange-500 mb-2 text-white py-2 px-4 rounded hover:bg-orange-600"
          to="/college-list"
        >
          College Details
        </Link>
      </div>

      <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">
        <h2 className="text-2xl font-semibold mb-4">College Information</h2>
        <form onSubmit={handleSubmit}>
          {/* College Name input */}
          <div className="mb-4">
            <label className="block text-gray-600">College Name:</label>
            <input
              type="text"
              name="name"
              value={collegeData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Description input */}
          <div className="mb-4">
            <label className="block text-gray-600">Description:</label>
            <input
              name="description"
              value={collegeData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {/* Image input */}
          <div className="mb-4">
            <label className="block text-gray-600">Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          >
            Add College
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCollege;
