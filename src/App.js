import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizList from './components/QuizList';
import QuizEditor from './components/QuizEditor';
import QuizRender from './components/QuizRender';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/quiz/edit/:id" element={<QuizEditor />} />
        <Route path="/quiz/:id" element={<QuizRender />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;