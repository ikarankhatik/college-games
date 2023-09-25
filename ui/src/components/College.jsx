import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCollege, deleteCollege, updateCollge } from "../store/collegeSlice";
import { Fetch, Delete, Get, Update } from "../helper/dbFetch";
import { toast } from "react-toastify";

const College = () => {
  const [collegeData, setCollegeData] = useState({
    name: "",
    description: "",
  });

  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const collegeList = useSelector((state) => state.colleges);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllCollege();
  }, []);

  const getAllCollege = async () => {
    try {
      const path = "/api/college/get-all-college";
      const response = await Get(path);
      if (response.success) {
        dispatch(addCollege(response.colleges));
      } else {
        console.error("API request failed:", response?.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollegeData({
      ...collegeData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addedCollege = await addCollegeApi(collegeData);
    if (addedCollege) {
      dispatch(addCollege(addedCollege.savedCollege));
      setCollegeData({
        name: "",
        description: "",
      });
    }
  };

  const addCollegeApi = async (data) => {
    const path = "/api/college/create";
    try {
      const response = await Fetch(path, data);
      if (response.success) {
        toast.success("College data added Successfully");
        return response;
      } else {
        toast.info("Enter other College Name");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while creating college:", error);
      toast.error("An error occurred. Please try again later.");
      return null;
    }
  };

  const handleDelete = (id) => {
    deleteCollegeApi(id);
  };

  const deleteCollegeApi = async (id) => {
    const path = `/api/college/delete/${id}`;
    try {
      const response = await Delete(path);
      if (response.success) {
        dispatch(deleteCollege(id));
        toast.success("College data deleted Successfully");
      } else {
        toast.info("Server Error: Unable to delete college");
      }
    } catch (error) {
      console.error("An error occurred while deleting college:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  // Separate state variables for editing each college item
  const [editingCollege, setEditingCollege] = useState(null);
  const [editedCollegeData, setEditedCollegeData] = useState({
    name: "",
    description: "",
  });

  const handleEdit = (college) => {
    setEditingCollege(college._id);
    setEditedCollegeData(college);
  };

  const handleUpdate = async () => {
    const updatedCollege = await updateCollegeApi(editedCollegeData);
    if (updatedCollege) {
      dispatch(updateCollge(updatedCollege));
      toast.success("College data updated Successfully");
      setEditingCollege(null);
      setEditedCollegeData({
        name: "",
        description: "",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCollege(null);
    setEditedCollegeData({
      name: "",
      description: "",
    });
  };

  const updateCollegeApi = async (data) => {    
    const path = `/api/college/update/${data._id}`;
    try {
      const response = await Update(path, data);
      console.log(response.college);
      if (response.success) {
        return response.college;
      } else {
        toast.error("Error updating college");
        return null;
      }
    } catch (error) {
      console.error("An error occurred while updating college:", error);
      toast.error("An error occurred. Please try again later.");
      return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isLoggedIn ? (
        <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">
          <h2 className="text-2xl font-semibold mb-4">College Information</h2>
          <form onSubmit={handleSubmit}>
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
            <button
              type="submit"
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            >
              Add College
            </button>
          </form>
        </div>
      ) : (
        ""
      )}

      <div className="mt-8 m-10">
        <h2 className="text-2xl font-semibold mb-4">College Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">College Name</th>
                <th className="px-4 py-2">Description</th>
                {isLoggedIn && <th className="px-4 py-2">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {collegeList.map((college) => (
                <tr key={college._id}>
                  <td className="border px-4 py-2">
                    {editingCollege === college._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedCollegeData.name}
                        onChange={(e) =>
                          setEditedCollegeData({
                            ...editedCollegeData,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      college.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingCollege === college._id ? (
                      <input
                        type="text"
                        name="description"
                        value={editedCollegeData.description}
                        onChange={(e) =>
                          setEditedCollegeData({
                            ...editedCollegeData,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      college.description
                    )}
                  </td>
                  {isLoggedIn && (
                    <td className="border px-4 py-2">
                      {editingCollege === college._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate()}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleCancelEdit()}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(college)}
                            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(college._id)}
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

export default College;
