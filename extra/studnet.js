import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addStudent,
  updateStudent,
  deleteStudent,
} from "../store/studentSlice";
import { Fetch, Get, Delete, Update } from "../helper/dbFetch";
import { toast } from "react-toastify";

const Students = () => {
  const fileToUploadRef = useRef(null);

  // Separate state variables
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [photo, setPhoto] = useState(null);
  const [college, setCollege] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [collegeOptions, setCollegeOptions] = useState([]);
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const studentList = useSelector((state) => state.students);
  const dispatch = useDispatch();
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedStudentData, setEditedStudentData] = useState({
    name: "",
    college: "",
    age: "",
    photo: null,
  });
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [studentPhoto, setStudentPhoto] = useState(null);

  useEffect(() => {
    getAllColleges();
    getAllStudents();
  }, []);

  const getAllColleges = async () => {
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

  const getAllStudents = async () => {
    try {
      const path = "/api/student/get-all-student";
      const response = await Get(path);

      if (response.success) {
        dispatch(addStudent(response.students));
      } else {
        console.error("API request failed:", response?.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    if (fileToUploadRef.current !== null) {
      const file = fileToUploadRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'default-preset'); // Replace with your upload preset
      //formData.append('cloud_name', 'dg4vsvzfq'); // Replace with your Cloudinary cloud name
  
      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/dg4vsvzfq/image/upload', // Replace with your Cloudinary cloud name
          {
            method: 'POST',
            body: formData,
          }
        );
  
        if (res.ok) {
          const data = await res.json();
          setImageUrl(data.secure_url);
          setPhoto(data.secure_url);
          toast.success('Photo Uploaded Successfully');
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (err) {
        console.error(err);
        toast.error('Cannot upload this picture');
        return null;
      }
    } else {
      return null;
    }
  };
  
  const handleChange = async (e) => {
    const { name, value } = e.target;    
      if (name === "name") {
        setName(value);
      } else if (name === "age") {
        setAge(value);
      } else if (name === "college") {
        setCollege(value);
      }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addedStudent = await addStudentApi({
      name,
      age,
      photo,
      college,
    });

    if (addedStudent) {
      addedStudent.student.college = { name: addedStudent.collegeName };

      dispatch(addStudent(addedStudent.student));
      setName("");
      setAge("");
      setPhoto("");
      setCollege("");
      setImageUrl("")
    }
  };

  const addStudentApi = async (data) => {
    const path = "/api/student/create";
    try {
      const response = await Fetch(path, data);

      if (response.success) {
        toast.success("Student data added Successfully");
        return response;
      } else {
        toast.error("Error creating student");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while creating student:", error);
      toast.error("An error occurred. Please try again later.");
      return null;
    }
  };

  const handleDelete = (id) => {
    deleteStudentApi(id);
  };

  const deleteStudentApi = async (id) => {
    const path = `/api/student/delete/${id}`;
    try {
      const response = await Delete(path);

      if (response.success) {
        dispatch(deleteStudent(id));
        toast.success("Student deleted Successfully");
      } else {
        toast.info("Server Error: Unable to delete Student");
      }
    } catch (error) {
      console.error("An error occurred while deleting student:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleEdit = (studentId) => {
    setEditingStudentId(studentId);
    const studentToEdit = studentList.find(
      (student) => student._id === studentId
    );
    setEditedStudentData(studentToEdit);
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditedStudentData({
      name: "",
      college: "",
      age: "",
      photo: null,
    });
  };

  const handleUpdate = async () => {
    const updatedStudent = await updateStudentApi(editedStudentData);

    if (updatedStudent) {
      dispatch(updateStudent(updatedStudent));
      toast.success("Student data updated Successfully");
      setEditingStudentId(null);
      setEditedStudentData({
        name: "",
        college: "",
        age: "",
        photo: null,
      });
    }
  };

  const updateStudentApi = async (data) => {
    const path = `/api/student/update/${data._id}`;
    try {
      const response = await Update(path, data);

      if (response.success) {
        return response.student;
      } else {
        toast.error("Error updating student");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while updating student:", error);
      toast.error("An error occurred. Please try again later.");
      return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isLoggedIn ? (
        <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">
          <h2 className="text-2xl font-semibold mb-4">Student Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-600">Student Name:</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">College Name:</label>
              <select
                name="college"
                value={college}
                onChange={handleChange}
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
              <label className="block text-gray-600">Age:</label>
              <input
                type="number"
                name="age"
                value={age}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Upload an Image</label>
              <input type="file" ref={fileToUploadRef} />
              <button className="bg-orange-500 text-white py-2 px-2 rounded hover-bg-orange-600" onClick={handleImageUpload}>Upload</button>
              {imageUrl ? <img src={imageUrl} height={"50px"} width={"50px"} alt='uploaded' /> : null
              }
              
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white py-2 px-4 rounded hover-bg-orange-600"
            >
              Add Student
            </button>
          </form>
        </div>
      ) : (
        ""
      )}

      <div className="mt-8 m-10">
        <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">College Name</th>
                <th className="px-4 py-2">Age</th>
                <th className="px-4 py-2">Photo</th>
                {isLoggedIn && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => (
                <tr key={student._id}>
                  <td className="border px-4 py-2">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedStudentData.name}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      student?.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingStudentId === student._id ? (
                      <select
                        name="college"
                        value={editedStudentData.college}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            college: e.target.value,
                          })
                        }
                      >
                        <option value="">Select a College</option>
                        {collegeOptions.map((college) => (
                          <option key={college._id} value={college._id}>
                            {college?.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      student?.college?.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingStudentId === student._id ? (
                      <input
                        type="number"
                        name="age"
                        value={editedStudentData.age}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            age: e.target.value,
                          })
                        }
                      />
                    ) : (
                      student?.age
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingStudentId === student._id ? (
                      <input
                        type="text"
                        name="photo"
                        value={editedStudentData.photo}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            photo: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <img
                        src={student?.photo || studentPhoto}
                        alt={student?.name}
                        className="w-16 h-16"
                      />
                    )}
                  </td>
                  {isLoggedIn && (
                    <td className="border px-4 py-2">
                      {editingStudentId === student._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(student._id)}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(student._id)}
                            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
