import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../ThemeProvider';
import axios from 'axios';
import { StudentSideBar } from '../Student/StudentSidebar';
import { FaShare } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import CommentComponent from '../../Component/CommentComponent';
import CommentsSection from '../../Component/CommentsSection';

const VideoDetails = () => {
    const { isDarkMode } = useTheme(); // Using dark mode state from context or provider
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASE_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { state } = useLocation();  // Accessing the state passed through Link
    const videos = state?.data || [];
    const [likes, setLikes] = useState([]);

    const userId = localStorage.getItem('CurrentUserId');


    console.log(videos)


    const fetchLikeByVideosId = async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/api/like/viedo/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLikes(resp.data);
        } catch (error) {
            console.error('Error fetching like status:', error);
        }

    }


    useEffect(() => {
        fetchVideoById();
        fetchLikeByVideosId();
    }, [id]);

    const fetchVideoById = async () => {
        setLoading(true);
        setError(null); // Reset error on new fetch
        try {
            const resp = await axios.get(`${BASE_URL}/api/videos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVideo(resp.data);
        } catch (error) {
            setError('Error fetching video details');
            console.error('Error fetching video details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (loading) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}
            >
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}
            >
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }




    const handleLink = async (id) => {
        navigate(`/video/${id}`, { state: { data: videos } });
    };

    const postLike = async () => {
        try {
            await axios.post(`${BASE_URL}/api/like/`, {
                videoId: id,
                userId: userId,
                liked: true,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchLikeByVideosId();

        } catch (error) {
            console.error('Error liking video:', error);

        }
    };

    const handleShare = () => {
        // If the browser supports the Share API (e.g., mobile browsers)
        if (navigator.share) {
            navigator.share({
                title: video.title,
                text: video.description,
                url: video.videoFile, // You can share the video URL directly
            })
                .then(() => console.log('Video shared successfully'))
                .catch((error) => console.error('Error sharing the video:', error));
        } else {
            // Fallback: Copy the URL to the clipboard for desktop users
            navigator.clipboard.writeText(video.videoFile)
                .then(() => alert('Video link copied to clipboard!'))
                .catch((error) => console.error('Error copying link to clipboard:', error));
        }
    };


    const handleDownload = () => {
        // Check if the video URL exists
        if (video && video.videoFile) {
            // Create a temporary anchor element
            const link = document.createElement('a');

            // Set the href to the video file URL and set the download attribute to the video's title
            link.href = video.videoFile; // This is the URL of the video file
            link.download = video.title || 'downloaded_video'; // Use the video title as the filename, fallback to 'downloaded_video'

            // Append the link to the body (it's necessary for triggering the download)
            document.body.appendChild(link);

            // Trigger the click event to initiate the download
            link.click();

            // Clean up by removing the link from the DOM
            document.body.removeChild(link);
        } else {
            alert("Video file not available for download.");
        }
    };


    return (
        <div
            className={`min-h-screen flex lg:gap-20 w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'} transition-colors`}
        >
            {/* Sidebar */}
            <div className="fixed z-40">
                <StudentSideBar />
            </div>

            {/* Back Button */}
            <button
                onClick={handleBackClick}
                className={`back-button fixed right-5 top-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300`}
            >
                Back
            </button>

            <div className="lg:flex lg:flex-row flex-col-reverse p-6 lg:ml-64 ml-16 gap-10 overflow-hidden w-full">

                <div className='lg:flex block w-full  gap-10  '>
                    <div className="flex-col lg:w-[80%] w-full">
                        <video controls className="w-full rounded-lg object-cover shadow-md shadow-slate-700">
                            <source src={video.videoFile} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="lg:flex block justify-between items-center mt-4 gap-4">
                            {/* Left Section: Thumbnail, Title, Description */}
                            <div className="flex items-center gap-4">
                                <img src={video.thumbnail} alt="Thumbnail" className="w-20 h-20 rounded-full" />
                                <div>
                                    <p className="lg:text-2xl text-sm font-semibold">{video.title}</p>
                                    <p className="text-sm">{video.description}</p>
                                </div>
                            </div>


                            <div className={`flex lg:justify-start justify-center my-4 items-center gap-8 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-900'} rounded-full p-4`}>

                                <FaShare className="cursor-pointer text-2xl" onClick={handleShare} />


                                <FaDownload className="cursor-pointer text-2xl" onClick={handleDownload} />
                                <div className='flex gap-2 justify-center items-center content-center'>
                                    <FcLike className="cursor-pointer text-3xl" onClick={postLike} />
                                    <p>{likes.length}</p>
                                </div>
                            </div>

                        </div>
                        <div className='w-full'>
                            <CommentsSection videoId={id} />
                        </div>

                    </div>

                    {
                        videos && videos.length > 0 ? (
                            <div className="overflow-y-auto lg:max-h-screen max-h-[500px]  scrollbar-hidden lg:w-[20%]  w-full">
                                {videos.map((video) => (
                                    <div key={video.video.id} className="grid mt-8 grid-cols-1 gap-2">
                                        <div onClick={() => handleLink(video?.video?.id)}>
                                            <video controls src={video?.video?.videoFile} className="w-full object-cover rounded-md cursor-pointer"></video>
                                        </div>
                                        <div className="flex flex-col justify-start content-center items-center space-y-2">
                                            <div className="flex justify-start content-center items-center gap-2">
                                                <img src={video?.video?.thumbnail} alt="" className="w-10 h-10 rounded-full" />
                                                <p className="text-sm font-semibold">{video.title}</p>
                                            </div>
                                            <p className="text-center">{video?.video?.description}</p>

                                            {/* Hard-set Like and Comment Counts */}
                                            <div className="flex space-x-4 text-blue-600">
                                                <button className="flex items-center space-x-2">
                                                    {/* Like Icon */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                                                    </svg>
                                                    <span>Like ({video.likeCount})</span> {/* Dynamic Like count */}
                                                </button>

                                                <button className="flex items-center space-x-2">
                                                    {/* Comment Icon */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                        <path d="M21 12c0 5.523-4.477 10-10 10s-10-4.477-10-10S5.477 2 11 2s10 4.477 10 10zM11 4c-3.314 0-6 2.686-6 6 0 1.628.628 3.103 1.658 4.204l-1.229 3.692L8.825 14.9a7.978 7.978 0 0 1 2.174.846l3.329-.892c-.243-.782-.552-1.495-.939-2.122C12.368 10.956 12 9.67 12 8.5c0-1.104-.896-2-2-2s-2 .896-2 2c0 2.761 2.239 5 5 5s5-2.239 5-5c0-2.761-2.239-5-5-5z"></path>
                                                    </svg>
                                                    <span>Comment ({video.commentCount})</span> {/* Dynamic Comment count */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ) : (
                            <p className="text-center text-xl text-gray-500">No video available for this course.</p>
                        )
                    }


                    <div className="flex flex-col items-center justify-center content-center lg:w-[20%] w-full">

                    </div>
                </div>
            </div>
        </div>

    );
};

export default VideoDetails;
