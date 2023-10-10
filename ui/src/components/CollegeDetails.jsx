import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCollege, updateCollge, addCollege } from "../store/collegeSlice";
import { Delete, Get, Update } from "../helper/dbFetch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CollegeDetails = () => {
  const collegeList = useSelector((state) => state.colleges);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);
  const isSubscribed = useSelector((state) => state.stripe.isSubscribed);
  useEffect(() => {
    getAllCollege();
  }, []);

  const getAllCollege = async () => {
    try {
      const path = "/api/college/get-all-college";
      const response = await Get(path);
      console.log(response.colleges);
      if (response.success) {
        dispatch(addCollege(response.colleges));
      } else {
        console.error("API request failed:", response?.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
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
      <div className="my-5">
        <Link
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          to="/add-college"
        >
          Add College
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-4">College Details</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">College Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Image</th>
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
                <td className="border px-4 py-2">
                  <img
                    src={`http://localhost:4000/${college?.image}`}
                    alt={college?.name}
                    className="w-16 h-16"
                  />
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
  );
};

export default CollegeDetails;
