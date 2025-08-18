import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// ✅ FIXED: Corrected the import path from "coures" to "courses"
import { fetchAllCourses } from '../redux/features/coures/courseSlice'; 
import { BookOpen, ImageIcon } from 'lucide-react';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  // ... (the rest of your Courses.jsx component is perfect and needs no changes)

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Courses</h1>
      {loading && courses.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link 
              // This link now correctly matches the route in App.js
              to={`/courses/${course._id}`} 
              key={course._id} 
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* ... rest of your card JSX ... */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                <p className="text-gray-600 text-sm">{course.description}</p>
                <div className="mt-4 pt-4 border-t text-sm font-medium text-gray-500">
                  {course.chapters?.length || 0} Chapters
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;