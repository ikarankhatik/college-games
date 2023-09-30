import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCompetition,
  deleteCompetition,
  addStudentCompetition,
} from "../store/competitionSlice";
import { Get, Fetch, Delete } from "../helper/dbFetch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CompetitionDetail = () => {
  const [studentName, setStudentName] = useState("");

  const [selectedStudents, setSelectedStudents] = useState({}); // Initialize selectedStudents

  const [studentOptions, setStudentOptions] = useState([]);

  const isLoggedIn = useSelector((state) => state.principle.isLoggedIn);

  const competitions = useSelector((state) => state.competitions.competitions);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchStudents();
    if (competitions.length === 0) {
      getAllCompetition();
    }
  }, []);

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
              image: competition.image,
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
      <div className="my-5">
        <Link
          className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
          to="/add-competition"
        >
          Add Competition
        </Link>
      </div>
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
                <th className="px-4 py-2">Image</th>
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
                    {isLoggedIn ? (
                      <>
                      <select
                      name={`student-${competition._id}`} // Use a unique name based on competition ID
                      value={selectedStudents[competition._id] || ""}
                      onChange={(e) =>
                        setSelectedStudents({
                          ...selectedStudents,
                          [competition._id]: e.target.value,
                        })
                      }
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
                        handleAddStudent(
                          competition._id,
                          selectedStudents[competition._id]
                        )
                      }
                    >
                      Add Student
                    </button>
                    </>
                    ) : (
                      ""
                    )}

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
                  <td className="border px-4 py-2">
                    <img
                      src={`http://localhost:4000/${competition?.image}`}
                      alt={competition?.name}
                      className="w-16 h-16"
                    />
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

export default CompetitionDetail;
