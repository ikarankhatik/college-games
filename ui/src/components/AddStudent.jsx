import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudent } from "../store/studentSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Get } from "../helper/dbFetch";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: "",
    age: "",
    photo: null,
    college: "",
    personalData: {
      gender: "",
      address: "",
      hobbies: [],
    },
    date: "",
    interestedGames: [],
  });

  const [collegeOption, setCollegeOption] = useState([]);
  const dispatch = useDispatch();
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState("");
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "photo") {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedPhotoUrl(imageUrl);
      } else {
        setSelectedPhotoUrl("");
      }
      setStudentData({
        ...studentData,
        [name]: e.target.files[0],
      });
    } else if (name === "gender" || name === "address") {
      setStudentData({
        ...studentData,
        personalData: {
          ...studentData.personalData,
          [name]: value,
        },
      });
    } else if (name === "hobbies") {
      const hobbiesArray = value.split(",").map((hobby) => hobby.trim());
      setStudentData({
        ...studentData,
        personalData: {
          ...studentData.personalData,
          hobbies: hobbiesArray,
        },
      });
    } else if (name === "interestedGames") {
      const selectedGames = Array.from(e.target.selectedOptions, (option) =>
        option.value
      );
      setStudentData({
        ...studentData,
        [name]: selectedGames,
      });
    } else {
      setStudentData({
        ...studentData,
        [name]: value,
      });
    }
  };

  const handleGameSelection = (game) => {
    const isGameSelected = studentData.interestedGames.includes(game);
    const updatedGames = isGameSelected
      ? studentData.interestedGames.filter((selectedGame) => selectedGame !== game)
      : [...studentData.interestedGames, game];

    setStudentData({
      ...studentData,
      interestedGames: updatedGames,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(studentData);
    let formData = new FormData();
    formData.append("name", studentData.name);
    formData.append("age", studentData.age);
    formData.append("college", studentData.college);
    formData.append("photo", studentData.photo);
    formData.append("personalData", JSON.stringify(studentData.personalData));
    formData.append("interestedGames", JSON.stringify(studentData.interestedGames));
    formData.append("date", studentData.date);

    try {
      const addedStudentResponse = await fetch(
        "http://localhost:4000/api/student/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const addedStudent = await addedStudentResponse.json();

      if (addedStudent.success) {
        toast.success("Student data added Successfully");
        addedStudent.student.college = { name: addedStudent.collegeName };
        dispatch(addStudent(addedStudent.student));
        setSelectedPhotoUrl("");
        setStudentData({
          name: "",
          college: "",
          age: "",
          photo: null,
          personalData: {
            gender: "",
            address: "",
            hobbies: [],
          },
          date: "",
          interestedGames: [],
        });
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        toast.error(addedStudent.message);
      }
    } catch (error) {
      console.error("An error occurred while creating student:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  if (isLoggedIn === false) {
    navigate("/");
    toast.info("You need to login first");
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Student Name:</label>
            <input
              type="text"
              name="name"
              value={studentData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">College Name:</label>
            <select
              name="college"
              value={studentData.college}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            >
              <option value="">Select a College</option>
              {collegeOption.map((college) => (
                <option key={college._id} value={college._id}>
                  {college?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Age:</label>
            <input
              type="number"
              name="age"
              value={studentData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Image:</label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
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
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Gender:</label>
            <input
              type="text"
              name="gender"
              value={studentData.personalData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Address:</label>
            <input
              type="text"
              name="address"
              value={studentData.personalData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">
              Hobbies (comma-separated):
            </label>
            <input
              type="text"
              name="hobbies"
              value={studentData.personalData.hobbies.join(", ")}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Interested Games:</label>
            <div className="space-y-2">
              {[
                "Cricket",
                "Football",
                "Hockey",
                "Chess",
                "Badminton",
                // Add more game options here
              ].map((game) => (
                <div key={game}>
                  <label className="flex items-center cursor-pointer text-base">
                    <input
                      type="checkbox"
                      name="interestedGames"
                      value={game}
                      checked={studentData.interestedGames.includes(game)}
                      onChange={() => handleGameSelection(game)}
                      className="mr-2"
                    />
                    {game}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-600 text-base">Date:</label>
            <input
              type="date"
              name="date"
              value={studentData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded text-base"
              required
            />
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
