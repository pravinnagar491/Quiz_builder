import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../storage/quizzes';
import './QuizRender.css';

// ✅ Import toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Initialize toast container once in your app (can be here or in App.js)
import { ToastContainer } from 'react-toastify';

export default function QuizRender() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setQuiz(getQuiz(id));
  }, [id]);

  if (!quiz) return <p>Quiz not found.</p>;
  if (!quiz.published) return <p>Not published yet.</p>;
  if (!quiz.blocks || quiz.blocks.length === 0) return <p>No blocks in this quiz.</p>;

  const currentBlock = quiz.blocks[currentIndex];
  const nextBlock = quiz.blocks[currentIndex + 1]; // look ahead for footer

  function handleNext() {
    let nextIndex = currentIndex + 1;
    // skip over button and footer blocks (since footer is shown with question)
    while (
      nextIndex < quiz.blocks.length &&
      (quiz.blocks[nextIndex].type === 'button' || quiz.blocks[nextIndex].type === 'footer')
    ) {
      nextIndex++;
    }
    if (nextIndex < quiz.blocks.length) {
      setCurrentIndex(nextIndex);
    } else {
      // ✅ Show toast instead of alert
      toast.success("🎉 Quiz finished!");
    }
  }

  function handleBack() {
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0 && quiz.blocks[prevIndex].type === 'button') {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex);
    }
  }

  return (
    <div className="quiz-render">
      <h1>{quiz.title}</h1>

      {currentBlock && currentBlock.type !== 'button' && (
        <div className="quiz-block">
          {/* Heading */}
          {currentBlock.type === 'heading' && <h2>{currentBlock.text}</h2>}

          {/* Question + Footer together */}
          {currentBlock.type === 'question' && (
            <div>
              <h3>{currentBlock.label}</h3>
              {currentBlock.kind === 'single' &&
                currentBlock.options.map((opt, i) => (
                  <div key={i} className="quiz-option">
                    <input type="radio" name={currentBlock.id} /> {i + 1}. {opt}
                  </div>
                ))}
              {currentBlock.kind === 'multi' &&
                currentBlock.options.map((opt, i) => (
                  <div key={i} className="quiz-option">
                    <input type="checkbox" /> {i + 1}. {opt}
                  </div>
                ))}
              {currentBlock.kind === 'text' && <input type="text" />}

              {/* Attach footer immediately if next block is footer */}
              {nextBlock && nextBlock.type === 'footer' && (
                <p className="quiz-footer">{nextBlock.text}</p>
              )}
            </div>
          )}

          {/* Standalone footer (only if no question before it) */}
          {currentBlock.type === 'footer' && (
            <p className="quiz-footer">{currentBlock.text}</p>
          )}
        </div>
      )}

      <div className="quiz-actions">
        {currentIndex > 0 && <button onClick={handleBack}>Back</button>}
        <button onClick={handleNext}>
          {currentIndex < quiz.blocks.length - 1 ? "Next" : "Finish"}
        </button>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}