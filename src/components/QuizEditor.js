import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BlockPalette from './BlockPalette';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import { getQuiz, updateQuiz, publishQuiz } from '../storage/quizzes';
import { useParams, useNavigate } from 'react-router-dom';

// ✅ Toast imports
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function QuizEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // history for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const q = getQuiz(id);
    if (q) {
      setQuiz(q);
      pushHistory(q);
    }
  }, [id]);

  function pushHistory(newQuiz) {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newQuiz);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setQuiz(newQuiz);
  }

  function setBlocks(newBlocks) {
    pushHistory({ ...quiz, blocks: newBlocks });
  }

  function updateBlock(id, updates) {
    const updatedBlocks = quiz.blocks.map(b =>
      b.id === id ? { ...b, ...updates } : b
    );
    setBlocks(updatedBlocks);
  }

  function handleSave() {
    updateQuiz(quiz);
    toast.success('✅ Quiz saved!');
    // navigate after a short delay so toast is visible
    setTimeout(() => navigate('/'), 1500);
  }

  function handlePublish() {
    const q = publishQuiz(quiz.id);
    pushHistory(q);
    toast.success('🚀 Quiz published!');
    // navigate after a short delay so toast is visible
    setTimeout(() => navigate('/'), 1500);
  }

  // ✅ Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Delete' && selectedId) {
        setBlocks(quiz.blocks.filter(b => b.id !== selectedId));
        setSelectedId(null);
      }
      if (e.ctrlKey && e.key === 'z') {
        if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
          setQuiz(history[historyIndex - 1]);
        }
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        if (historyIndex < history.length - 1) {
          setHistoryIndex(historyIndex + 1);
          setQuiz(history[historyIndex + 1]);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, quiz, history, historyIndex]);

  if (!quiz) return <p>Quiz not found.</p>;
  const selectedBlock = quiz.blocks.find(b => b.id === selectedId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header */}
        <div style={{ padding: 10, borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
          <input
            value={quiz.title}
            onChange={e => pushHistory({ ...quiz, title: e.target.value })}
            placeholder="Quiz title"
          />
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handlePublish}>Publish</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1 }}>
          <BlockPalette />
          <Canvas
            blocks={quiz.blocks}
            setBlocks={setBlocks}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
          <PropertiesPanel selected={selectedBlock} updateBlock={updateBlock} />
        </div>

        {/* ✅ Toast container */}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </DndProvider>
  );
}