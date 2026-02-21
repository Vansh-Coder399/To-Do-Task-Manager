import SpaceBackground from './components/SpaceBackground';
import TodoCard from './components/TodoCard';
import Header from './components/UI/Header';
import InputPanel from './components/UI/InputPanel';
import ProgressRing from './components/UI/ProgressRing';
import useTodoStore from './store/useTodoStore';

export default function App() {
  const todos = useTodoStore((s) => s.todos);

  return (
    <div className="app-root bg-space">
      {/* Layer 0: Stars background (Canvas 2D — no WebGL) */}
      <SpaceBackground />

      {/* Layer 1: 3D card grid */}
      <div className="cards-viewport">
        <div className="cards-scene">
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚀</div>
              <p className="empty-title">No tasks in orbit yet</p>
              <p className="empty-sub">Type below and click <strong>+ Launch</strong> to add one</p>
            </div>
          ) : (
            <div className="cards-grid">
              {todos.map((todo, i) => (
                <TodoCard key={todo.id} todo={todo} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Layer 2: UI overlay */}
      <div className="ui-overlay">
        <Header />
        <ProgressRing />
        <InputPanel />
      </div>
    </div>
  );
}
