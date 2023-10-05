import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCompetition } from "../store/competitionSlice";
import { Get } from "../helper/dbFetch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddCompetition = () => {
  const navigate = useNavigate();
  const [competitionName, setCompetitionName] = useState("");
  const [competitionDescription, setCompetitionDescription] = useState("");
  const [collegeName, setCollegeName] = useState("");

  const [competitionImage, setCompetitionImage] = useState("");
  const [collegeOptions, setCollegeOptions] = useState([]);

  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // Display the selected image preview
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
    } else {
      setSelectedImageUrl(""); // Clear the image URL if no file is selected
    }
    setCompetitionImage(file);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const path = "/api/college/get-all-college";
      const response = await Get(path);
      if (response.success) {
        setCollegeOptions(response.colleges);
      } else {
        console.error("API request failed:", response?.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const handleAddCompetition = async (e) => {
    e.preventDefault();

    console.log(
      competitionName,
      competitionDescription,
      collegeName,
      competitionImage
    );

    let formData = new FormData();
    formData.append("name", competitionName);
    formData.append("description", competitionDescription);
    formData.append("college", collegeName);
    formData.append("image", competitionImage);
    try {
      const competitionData = await fetch(
        "http://localhost:4000/api/competition/create",
        {
          method: "POST",
          body: formData,
        }
      );
      const response = await competitionData.json();
      console.log(response);
      if (response.success) {
        dispatch(
          addCompetition({
            _id: response.competition._id,
            name: response.competition.name,
            description: response.competition.description,
            college: response.collegeName,
            image: response.competition.image,
            students: [],
          })
        );
        toast.success("Competition created successfully");
        setCompetitionName("");
        setCompetitionDescription("");
        setCollegeName("");
        setCompetitionImage("");
        setSelectedImageUrl("");
        // Reset the file input value to clear the selected file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = ""; // Reset the file input value
        }
      } else {
        toast.error("Error creating competition");
        console.error("Failed to add competition:", response.erro);
      }
    } catch (error) {
      console.error("An error occurred while adding competition:", error);
    }
  };

  if(isLoggedIn === false){
    navigate('/');
    toast.info("You need to login first")
    return null;
  }

  return (
    <div className="container mx-auto p-4 mb-10">
    <div className="my-5">
      <Link
        className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
        to="/competition-list"
      >
        Competition Detail
      </Link>
    </div>
    <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">
      <h2 className="text-2xl font-semibold mb-4">Competition Information</h2>
      <form onSubmit={handleAddCompetition}>
        <div className="mb-4">
          <label className="block text-gray-600">Competition Name:</label>
          <input
            type="text"
            name="competitionName"
            value={competitionName}
            onChange={(e) => setCompetitionName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">
            Competition Description:
          </label>
          <input
            type="text"
            name="competitionDescription"
            value={competitionDescription}
            onChange={(e) => setCompetitionDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">College Name:</label>
          <select
            name="college"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a College</option>
            {collegeOptions.map((college) => (
              <option key={college._id} value={college._id}>
                {college?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            required
          />
          {selectedImageUrl && (
            <div>
              <img
                src={selectedImageUrl}
                alt="Selected"
                className="mt-2 max-h-40"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mt-4"
        >
          Add Competition
        </button>
      </form>
    </div>
  </div>
  );
};

export default AddCompetition;
