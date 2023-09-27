import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addStudent } from "../store/studentSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Get } from "../helper/dbFetch";

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    college: "",
    age: "",
    photo: null,
  });

  const [collegeOption, setCollegeOption] = useState([]);
  const dispatch = useDispatch();
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState("");
  

  useEffect(() => {
    getAllCollege();
  }, []);

  const getAllCollege = async () => {
    try {
      const path = "/api/college/get-all-college";
      const response = await Get(path);
      console.log(response);

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
      // Handle file input separately
      const file = e.target.files[0];
      // Display the selected image preview
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedPhotoUrl(imageUrl);
      } else {
        setSelectedPhotoUrl(""); // Clear the image URL if no file is selected
      }
      setStudentData({
        ...studentData,
        [name]: e.target.files[0],
      });
    } else {
      setStudentData({
        ...studentData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(studentData);
    let formData = new FormData();
    formData.append("name", studentData.name);
    formData.append("age", studentData.age);
    formData.append("college", studentData.college);
    formData.append("photo", studentData.photo);

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
        console.log(addedStudent.student);
        addedStudent.student.college = { name: addedStudent.collegeName };
        dispatch(addStudent(addedStudent.student));
        setSelectedPhotoUrl("");
        setStudentData({
          name: "",
          college: "",
          age: "",
          photo: null,
        });
        // Reset the file input value to clear the selected file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = ""; // Reset the file input value
        }
      } else {
        toast.error("Error creating student");
      }
    } catch (error) {
      console.error("An error occurred while creating student:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-4">
         <div className="my-5">
          <Link
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            to="/student-list"
          >
            Student Details
          </Link>
        </div>
      <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">       
        <h2 className="text-2xl font-semibold mb-4">Student Information</h2>
        <form onSubmit={handleSubmit}>
          
            <div className="mb-4">
              <label className="block text-gray-600">Student Name:</label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">College Name:</label>
              <select
                name="college"
                value={studentData.college}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
            <div className="mb-4">
              <label className="block text-gray-600">Age:</label>
              <input
                type="number"
                name="age"
                value={studentData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Image:</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {selectedPhotoUrl && (
                <div>
                  <img
                    src={selectedPhotoUrl}
                    alt="Selected"
                    className="mt-2 max-h-40"
                  />
                </div>
              )}
            </div>
          
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
