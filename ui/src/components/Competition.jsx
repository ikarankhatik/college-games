import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCompetition,
  deleteCompetition,
  addStudentCompetition,
} from "../store/competitionSlice";
import { Get, Fetch, Delete } from "../helper/dbFetch";
import { toast } from "react-toastify";

const Competition = () => {
  const [competitionName, setCompetitionName] = useState("");
  const [competitionDescription, setCompetitionDescription] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);

  const competitions = useSelector((state) => state.competitions.competitions);
  const dispatch = useDispatch();
  console.log(competitions);
  useEffect(() => {
    fetchColleges();
    fetchStudents();
    if (competitions.length === 0) {
      getAllCompetition();
    }
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

  const fetchStudents = async () => {
    try {
      const response = await Get("/api/student/get-all-student");
      setStudentOptions(response.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const getAllCompetition = async () => {
    try {
      const path = "/api/competition/get-all-competition";
      const response = await Get(path);
      if (response.success) {
        const competitionsData = Array.isArray(response.competition)
          ? response.competition
          : [response.competition];

        competitionsData.forEach((competition) => {
          dispatch(
            addCompetition({
              _id: competition._id,
              name: competition.name,
              description: competition.description,
              college: competition.college.name,
              students: [...competition.students],
            })
          );
        });
      } else {
        console.error("API request failed:", response?.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const handleAddCompetition = async (e) => {
    e.preventDefault();
    const data = {
      name: competitionName,
      description: competitionDescription,
      college: collegeName,
    };
    try {
      const response = await Fetch("/api/competition/create", data);
      console.log(response);
      if (response.success) {
        dispatch(
          addCompetition({
            _id: response.competition._id,
            name: competitionName,
            description: competitionDescription,
            college: response.collegeName,
            students: [],
          })
        );
        toast.success("Competition created successfully");
        setCompetitionName("");
        setCompetitionDescription("");
        setCollegeName("");
      } else {
        toast.error("Error creating competition");
        console.error("Failed to add competition:", response.data.error);
      }
    } catch (error) {
      console.error("An error occurred while adding competition:", error);
    }
  };

  const handleAddStudent = async (id, sid) => {
    //console.log(sid);
    try {
      const response = await Fetch(
        `/api/competition/add-student-to-compition/${id}`,
        sid
      );
      const studentID = response?.student._id;
      //console.log(studentData);
      if (response.success) {
        dispatch(addStudentCompetition({ id, studentID }));
        setStudentName("");
        toast.success("Student added to the competition");
      } else {
        console.error(
          "Failed to add student to competition:",
          response.data.error
        );
        toast.info(response.error);
      }
    } catch (error) {
      console.error(
        "An error occurred while adding student to competition:",
        error
      );
      toast.info("Student is already registered with this competition");
    }
  };

  const handleDeleteCompetition = (id) => {
    deleteCompetitionAPI(id);
  };

  const deleteCompetitionAPI = async (id) => {
    const path = `/api/competition/delete/${id}`;
    try {
      const response = await Delete(path);

      if (response.success) {
        dispatch(deleteCompetition(id));
        toast.success("Competition deleted Successfully");
      } else {
        toast.info("Server Error: Unable to delete Competition");
      }
    } catch (error) {
      console.error("An error occurred while deleting competition:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto p-4 mb-10">
      {isLoggedIn ? (
        <div className="bg-gray-200 p-4 rounded-xl shadow-xl border">
          <h2 className="text-2xl font-semibold mb-4">
            Competition Information
          </h2>
          <form onSubmit={handleAddCompetition}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>

            <button
              type="submit"
              className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mt-4"
            >
              Add Competition
            </button>
          </form>
        </div>
      ) : (
        ""
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Competitions</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Competition Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">College Name</th>
                <th className="px-4 py-2">Add Student</th>
                {isLoggedIn ? <th className="px-4 py-2">Actions</th> : ""}
              </tr>
            </thead>
            <tbody>
              {competitions.map((competition) => (
                <tr key={competition._id}>
                  <td className="border px-4 py-2">{competition.name}</td>
                  <td className="border px-4 py-2">
                    {competition.description}
                  </td>
                  <td className="border px-4 py-2">{competition.college}</td>
                  <td className="border px-4 py-2">
                    <select
                      name="student"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select a Student</option>
                      {studentOptions?.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student?.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-orange-500 text-white py-1 px-2 rounded mt-2"
                      onClick={() =>
                        handleAddStudent(competition._id, studentName)
                      }
                    >
                      Add Student
                    </button>
                    {/* Display added students */}
                    <div>
                      <strong>Added Students:</strong>
                      <ul>
                        {competition.students.map((studentId, index) => {
                          // Find the corresponding student object by ID
                          const student = studentOptions.find(
                            (student) => student._id === studentId
                          );

                          // Display the student's name if found
                          return student ? (
                            <li key={index}>{student.name}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  </td>

                  {isLoggedIn ? (
                    <td className="border px-4 py-2">
                      <button
                        className="bg-red-500 text-white py-1 px-2 rounded"
                        onClick={() => handleDeleteCompetition(competition._id)}
                      >
                        Delete
                      </button>
                    </td>
                  ) : (
                    ""
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

export default Competition;
