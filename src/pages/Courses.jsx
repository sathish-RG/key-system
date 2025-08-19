import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllCourses } from '../redux/features/coures/courseSlice';
import { BookOpen, ImageIcon } from 'lucide-react';

// --- NEW: Helper component to manage the complex image logic ---
const CourseCardImage = ({ course }) => {
  const [imageError, setImageError] = useState(false);

  // This function will be called if the course.image URL is broken
  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if we should show the real image or the placeholder
  const showPlaceholder = !course.image || imageError;

  return (
    <div className="h-48 bg-gray-200 relative overflow-hidden group">
      {!showPlaceholder ? (
        // If the image exists and is not broken, display it
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      ) : (
        // Otherwise, display the gradient placeholder
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-600 flex items-center justify-center">
          <ImageIcon size={48} className="text-white opacity-50" />
        </div>
      )}
      
      {/* Category badge, positioned over the image/placeholder */}
      {course.category && (
        <div className="absolute top-3 left-3">
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            {course.category}
          </span>
        </div>
      )}
    </div>
  );
};


const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  if (loading && courses.length === 0) {
    // ... loading state JSX ...
  }
  if (error) {
    // ... error state JSX ...
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 ">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link 
            to={`/courses/${course._id}`} 
            key={course._id} 
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {/* ✅ Use the new, styled image component */}
            <CourseCardImage course={course} />

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {course.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3 h-16">
                {course.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm font-medium text-gray-500 flex items-center">
                <BookOpen size={16} className="mr-2"/>
                <span>{course.chapters?.length || 0} Chapters</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;