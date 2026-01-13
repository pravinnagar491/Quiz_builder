const INDEX_KEY = 'quizbuilder.index';
const QUIZ_PREFIX = 'quizbuilder.quiz.';
const SEEDED_KEY = 'quizbuilder.seeded';

function safeParse(raw, fallback) {
  try { return JSON.parse(raw) || fallback; } catch { return fallback; }
}

function safeStringify(obj) {
  try { return JSON.stringify(obj); } catch { return null; }
}

export function getIndex() {
  return safeParse(localStorage.getItem(INDEX_KEY), []);
}

export function setIndex(ids) {
  const s = safeStringify(ids);
  if (s) localStorage.setItem(INDEX_KEY, s);
}

export function getQuiz(id) {
  return safeParse(localStorage.getItem(QUIZ_PREFIX + id), null);
}

export function setQuiz(id, quiz) {
  const s = safeStringify(quiz);
  if (s) localStorage.setItem(QUIZ_PREFIX + id, s);
}

export function createQuiz({ title, blocks = [], published = false }) {
  const quiz = {
    id: crypto.randomUUID(),
    title,
    blocks: Array.isArray(blocks) ? blocks : [],
    published,
    updatedAt: new Date().toISOString()
  };
  
  setQuiz(quiz.id, quiz);
  const idx = getIndex();
  setIndex([...idx, quiz.id]);

  return quiz;
}

export function updateQuiz(quiz) {
  quiz.updatedAt = new Date().toISOString();
  setQuiz(quiz.id, quiz);
}

export function listQuizzes() {
  return getIndex().map(id => getQuiz(id)).filter(Boolean);
}

export function publishQuiz(id) {
  const quiz = getQuiz(id);
  if (!quiz) return null;
  quiz.published = true;
  quiz.updatedAt = new Date().toISOString();
  setQuiz(id, quiz);
  return quiz;
}

export function seedIfFirstRun() {
  if (localStorage.getItem(SEEDED_KEY)) return;

  const quiz = createQuiz({
    title: 'Sample Quiz',
    published: true,
    blocks: [
      { id: crypto.randomUUID(), type: 'heading', text: 'Welcome!', level: 2 },
      { id: crypto.randomUUID(), type: 'question', label: 'Pick one', kind: 'single', options: ['A','B','C'] },
      { id: crypto.randomUUID(), type: 'button', label: 'Next', variant: 'next' },
      { id: crypto.randomUUID(), type: 'footer', text: '© 2026 QuizBuilder' }
    ]
  });

  localStorage.setItem(SEEDED_KEY, 'true');
  return quiz;
}

export function deleteQuiz(id) {
  localStorage.removeItem(QUIZ_PREFIX + id);
  const idx = getIndex().filter(qid => qid !== id);
  setIndex(idx);
}