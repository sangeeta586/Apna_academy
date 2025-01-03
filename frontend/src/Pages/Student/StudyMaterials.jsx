import React, { useEffect, useState } from "react";
import { useTheme } from "../../ThemeProvider";
import { StudentSideBar } from "./StudentSidebar";

const StudyMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const { isDarkMode } = useTheme();
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("CurrentUserId");
    const BASE_URL = import.meta.env.VITE_API_URL;

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/notes/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch materials.");
            }
            const data = await response.json();
            setMaterials(data);
        } catch (error) {
            console.error("Error fetching study materials:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter materials based on the search term
    const filteredMaterials = materials.filter(
        (material) =>
            material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginate filtered materials
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= Math.ceil(filteredMaterials.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className={`min-h-screen flex lg:gap-20 w-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className="fixed z-40">
                <StudentSideBar />
            </div>

            <div className="flex-1 p-6 w-[80%] lg:ml-64 ml-20">
                <h1 className={`text-3xl font-bold text-center mb-6 ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>
                    Study Materials
                </h1>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search by title or course..."
                        className={`w-full sm:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-300" : "bg-white text-black border-gray-300 focus:ring-blue-500"}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className={`w-full table-auto rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                            <thead>
                                <tr className={`${isDarkMode ? "bg-blue-600" : "bg-blue-500"} text-white`}>
                                    <th className="py-2 px-4 text-left">Title</th>
                                    <th className="py-2 px-4 text-left">Description</th>
                                    <th className="py-2 px-4 text-center">View</th>
                                    <th className="py-2 px-4 text-center">Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMaterials.length > 0 ? (
                                    currentMaterials.map((material) => (
                                        <tr key={material.id} className={`hover:transition duration-200 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                                            <td className="py-2 px-4">{material.title}</td>
                                            <td className="py-2 px-4">{material.description}</td>
                                            <td className="py-2 px-4 text-center">
                                                <button
                                                    onClick={() => window.open(material.content, "_blank")}
                                                    className={`px-3 py-1 rounded-lg text-white transition duration-300 ${isDarkMode ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-600"}`}
                                                >
                                                    View
                                                </button>
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <a
                                                    href={material.pdfFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                    className={`px-3 py-1 rounded-lg text-white transition duration-300 ${isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-600"}`}
                                                >
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 font-medium">No study materials found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">{`Page ${currentPage} of ${Math.ceil(filteredMaterials.length / itemsPerPage)}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        disabled={currentPage === Math.ceil(filteredMaterials.length / itemsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyMaterials;
