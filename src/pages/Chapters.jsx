import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Make sure Link is imported
import { useDispatch, useSelector } from 'react-redux';
import { getAllChapters, clearError } from '../redux/features/chapters/chapterSlice';
import { Clock } from 'lucide-react';

const Chapters = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { chapters, loading, error } = useSelector((state) => state.chapters);

  useEffect(() => {
    if (courseId) {
      dispatch(getAllChapters(courseId));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, courseId]);

  if (loading) {
    // ... loading state JSX ...
  }
  if (error) {
    // ... error state JSX ...
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
        Course Chapters
      </h1>
      <div className="space-y-4">
        {chapters && chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            // Use a container that is itself a Link, or add a button/link inside
            <div key={chapter._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Chapter {index + 1}: {chapter.title}
              </h2>
              <p className="text-gray-600 mt-2">{chapter.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-2" />
                  <span>Duration: {chapter.duration || 'N/A'} minutes</span>
                </div>

                {/* ✅ ADD THIS LINK TO VIEW THE CHAPTER DETAILS */}
                <Link
                  to={`/courses/${courseId}/chapters/${chapter._id}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View Chapter
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No chapters have been added to this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapters;