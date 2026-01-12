import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz } from '../storage/quizzes';
import './QuizRender.css';   // ✅ import CSS

export default function QuizRender() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setQuiz(getQuiz(id));
  }, [id]);

  if (!quiz) return <p>Quiz not found.</p>;
  if (!quiz.published) return <p>Not published yet.</p>;

  const currentBlock = quiz.blocks[currentIndex];

  function handleNext() {
    if (currentIndex < quiz.blocks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Quiz finished!");
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  return (
    <div className="quiz-render">
      <h1>{quiz.title}</h1>

      {currentBlock && (
        <div className="quiz-block">
          {currentBlock.type === 'heading' && <h2>{currentBlock.text}</h2>}

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
            </div>
          )}

          {currentBlock.type === 'footer' && (
            <p className="quiz-footer">{currentBlock.text}</p>
          )}
        </div>
      )}

      <div className="quiz-actions">
        {currentIndex > 0 && (
          <button onClick={handleBack}>Back</button>
        )}
        <button onClick={handleNext}>
          {currentIndex < quiz.blocks.length - 1 ? "Next" : "Finish"}
        </button>
      </div>
    </div>
  );
}