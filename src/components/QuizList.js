import React, { useEffect, useState } from 'react';
import { listQuizzes, createQuiz, seedIfFirstRun, deleteQuiz } from '../storage/quizzes';
import { useNavigate } from 'react-router-dom';
import './QuizList.css';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    seedIfFirstRun();
    setQuizzes(listQuizzes());
  }, []);

  function handleCreate() {
    const q = createQuiz({ title: 'Untitled Quiz', blocks: [], published: false });
    setQuizzes(listQuizzes());
    navigate(`/quiz/edit/${q.id}`);
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(id);
      setQuizzes(listQuizzes());
    }
  }

  return (
    <div className="quiz-list-container">
      <h1>Quizzes</h1>
      <button onClick={handleCreate}>Create Quiz</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(q => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{new Date(q.updatedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => navigate(`/quiz/edit/${q.id}`)}>Edit</button>
                <button onClick={() => navigate(`/quiz/${q.id}`)}>View</button>
                <button onClick={() => handleDelete(q.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}