import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // For success/error messages
import { useTheme } from "../../ThemeProvider";

const AddExam = ({ selectExam, setShowModal, courseId, courseName }) => {
  const [exam, setExam] = useState({
    examName: selectExam ? selectExam.examName : courseName, // Default to course name or selected exam name
    courseId: courseId || "", // Set the courseId from props
    startTime: selectExam ? selectExam.startTime : "",
    endTime: selectExam ? selectExam.endTime : "",
    duration: selectExam ? selectExam.duration : 0,
    examType: selectExam ? selectExam.examType : "",
    passingScore: selectExam ? selectExam.passingScore : 0,
    instructions: selectExam ? selectExam.instructions : "",
    maximumMarks: selectExam ? selectExam.maximumMarks : 0,
   
  });

  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("CurrentUserId");
  const BASE_URL = import.meta.env.VITE_API_URL;
   const { isDarkMode } = useTheme();

  // Set exam data if an exam is selected for updating
  useEffect(() => {
    if (selectExam) {
      setExam({
        ...selectExam,
        startTime: selectExam.startTime || "",
        endTime: selectExam.endTime || "",
      });
    }
  }, [selectExam]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExam({
      ...exam,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert startTime and endTime to milliseconds
    const startTimeMillis = new Date(exam.startTime).getTime();
    const endTimeMillis = new Date(exam.endTime).getTime();
  
    console.log("Start Time in Milliseconds:", startTimeMillis);
    console.log("End Time in Milliseconds:", endTimeMillis);
  
    const requestData = {
      ...exam,
      startTime: startTimeMillis,
      endTime: endTimeMillis,
    };
  
    setLoading(true); // Start loading
  
    try {
      if (selectExam) {
        // Update existing exam
        await axios.put(`${BASE_URL}/api/exams/${selectExam.id}`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Indicate it's JSON data
          },
        });
        Swal.fire({
          icon: "success",
          title: "Exam Updated!",
          text: "The exam was updated successfully.",
        });
      } else {
        // Add a new exam
        await axios.post(`${BASE_URL}/api/exams/${teacherId}`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Indicate it's JSON data
          },
        });
        Swal.fire({
          icon: "success",
          title: "Exam Added!",
          text: "The exam was added successfully.",
        });
      }
  
      setShowModal(false); // Close the modal after success
    } catch (error) {
      console.error("Error during exam submission:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error submitting the exam.",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };
  


  return (
    <div className={`container mx-auto p-4 w-full ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}>
      <h1 className="text-2xl font-bold mb-4">
        {selectExam ? "Update Exam" : "Add Exam"}
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Exam Name (still required for exam submission) */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`} htmlFor="examName">
            Exam Name
          </label>
          <input
            type="text"
            id="examName"
            name="examName"
            value={exam.examName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Start Time and End Time */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="startTime">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={exam.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="endTime">
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={exam.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Duration and Maximum Marks */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="duration">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={exam.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* Maximum Marks */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="maximumMarks">
              Maximum Marks
            </label>
            <input
              type="number"
              id="maximumMarks"
              name="maximumMarks"
              value={exam.maximumMarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Exam Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="examType">
            Exam Type
          </label>
          <select
            id="examType"
            name="examType"
            value={exam.examType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Exam Type</option>
            <option value="MCQ">MCQ</option>
            <option value="Essay">Essay</option>
            <option value="Practical">Practical</option>
          </select>
        </div>

        {/* Passing Score */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="passingScore">
            Passing Score
          </label>
          <input
            type="number"
            id="passingScore"
            name="passingScore"
            value={exam.passingScore}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* Instructions */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="instructions">
            Instructions
          </label>
          <textarea
            id="instructions"
            name="instructions"
            value={exam.instructions}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="3"
          ></textarea>
        </div>

    
        

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : selectExam ? "Update Exam" : "Add Exam"}
        </button>
      </form>
    </div>
  );
};

export default AddExam;
