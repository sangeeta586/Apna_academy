import React from 'react';

const Profile = () => {
  const handleProfileClick = () => {
    
    console.log('Profile clicked');
   
  };

  return (
    <header className="fixed top-0 left-0 flex justify-between items-center p-8  w-full">
    
      <div className="flex-grow">

      </div>      
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleProfileClick}
      >
        <img
          src="https://via.placeholder.com/40" 
          alt="Profile"
          className="rounded-full  w-16 h-16  object-cover border-2 border-gray-300 hover:border-blue-500"
        />
      </div>
    </header>
  );
};

export default Profile;