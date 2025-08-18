import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapterById } from '../redux/features/chapters/chapterSlice';
import { Video, FileText, Clock, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

// Helper component to safely embed YouTube videos
const YouTubeEmbed = ({ url }) => {
  try {
    const videoId = new URL(url).searchParams.get('v');
    if (!videoId) return <p className="text-red-500">Invalid YouTube URL provided.</p>;
    
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-lg"
        ></iframe>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500">Invalid video URL format.</p>;
  }
};

// Helper component to manage state for a single MCQ
const McqItem = ({ mcq }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <HelpCircle size={20} className="text-blue-500"/>
        {mcq.question}
      </h3>
      <div className="space-y-3 my-4">
        {mcq.options.map((option, index) => (
          <label 
            key={index} 
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              isSubmitted && mcq.correctAnswerIndex === index ? 'bg-green-50 border-green-400' :
              isSubmitted && selectedAnswer === index ? 'bg-red-50 border-red-400' :
              'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <input 
              type="radio" 
              name={`mcq-${mcq._id}`} 
              className="w-4 h-4 mr-3" 
              disabled={isSubmitted}
              onChange={() => setSelectedAnswer(index)}
            />
            {option}
            {isSubmitted && mcq.correctAnswerIndex === index && <CheckCircle size={20} className="ml-auto text-green-500"/>}
            {isSubmitted && selectedAnswer === index && mcq.correctAnswerIndex !== index && <XCircle size={20} className="ml-auto text-red-500"/>}
          </label>
        ))}
      </div>
      {!isSubmitted ? (
        <button onClick={handleAnswerSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Submit Answer</button>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg text-sm">
          <h4 className="font-bold text-gray-800">Explanation:</h4>
          <p className="text-gray-600 mt-1">{mcq.explanation || 'No explanation provided.'}</p>
        </div>
      )}
    </div>
  );
};

const Chapter = () => {
  const { courseId, chapterId } = useParams();
  const dispatch = useDispatch();
  const { selectedChapter: chapter, error } = useSelector((state) => state.chapters);

  useEffect(() => {
    if (courseId && chapterId) {
      dispatch(fetchChapterById({ courseId, chapterId }));
    }
  }, [dispatch, courseId, chapterId]);

  

  if (error || !chapter) {
    return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg">Error: {error || 'Chapter not found.'}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50">
      <nav className="mb-6 text-sm text-gray-600">
        <Link to={`/courses/${courseId}`} className="hover:underline">
          &larr; Back to Chapters List
        </Link>
      </nav>
      
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        {/* Chapter Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{chapter.title}</h1>
        <p className="text-lg text-gray-600 mt-2">{chapter.description}</p>
        <div className="flex items-center text-gray-500 mt-4 border-t pt-4">
          <Clock size={16} className="mr-2"/>
          <span>Duration: {chapter.duration || 'N/A'} minutes</span>
        </div>

        {/* Video Player */}
        {chapter.videoUrl && (
          <div className="my-8">
            <YouTubeEmbed url={chapter.videoUrl} />
          </div>
        )}
        
        {/* Document Link */}
        {chapter.documentUrl && (
          <a href={chapter.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg my-6 hover:bg-blue-200 font-semibold">
            <FileText size={18}/>
            Download Document
          </a>
        )}

        {/* MCQs Section */}
        {chapter.mcqs && chapter.mcqs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-2">Test Your Knowledge</h2>
            {chapter.mcqs.map(mcq => <McqItem key={mcq._id} mcq={mcq}/>)}
          </div>
        )}

        {/* Tasks Section */}
        {chapter.tasks && chapter.tasks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Your Tasks</h2>
            {chapter.tasks.map(task => (
              <div key={task._id} className="bg-gray-50 p-4 rounded-lg border mt-4">
                <h3 className="text-lg font-semibold">{task.title} <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{task.type}</span></h3>
                <p className="text-gray-700 mt-1">{task.description}</p>
                <p className="text-sm text-gray-500 mt-2">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chapter;