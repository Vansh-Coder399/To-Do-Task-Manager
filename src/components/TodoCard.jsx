import { useState, useRef, useEffect } from 'react';
import useTodoStore from '../store/useTodoStore';

const CATEGORY_COLORS = {
    Work: { border: '#4f8ef7', glow: 'rgba(79,142,247,0.4)', text: '#93c5fd', stripe: '#4f8ef7' },
    Personal: { border: '#a855f7', glow: 'rgba(168,85,247,0.4)', text: '#d8b4fe', stripe: '#a855f7' },
    Urgent: { border: '#ef4444', glow: 'rgba(239,68,68,0.4)', text: '#fca5a5', stripe: '#ef4444' },
};

const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' };
const PRIORITY_LABELS = { High: '▲ HIGH', Medium: '● MED', Low: '▼ LOW' };

export default function TodoCard({ todo, index }) {
    const { completeTodo, markDeleting, deleteTodo } = useTodoStore();
    const cardRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const cat = CATEGORY_COLORS[todo.category] || CATEGORY_COLORS.Work;
    const priColor = PRIORITY_COLORS[todo.priority] || '#f59e0b';

    // Entry animation on mount
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleMouseMove = (e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        setTilt({ x: -dy * 10, y: dx * 10 });
    };

    const handleMouseLeave = () => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    const handleDelete = () => {
        setDeleting(true);
        markDeleting(todo.id);
        setTimeout(() => deleteTodo(todo.id), 600);
    };

    // Bob delay based on index
    const bobDelay = `${(index * 0.4) % 3}s`;
    const bobDuration = `${3 + (index % 3) * 0.5}s`;

    return (
        <div
            className="card-wrapper"
            style={{
                perspective: '1000px',
                animationDelay: bobDelay,
            }}
        >
            <div
                ref={cardRef}
                className={`todo-card ${mounted ? 'mounted' : ''} ${deleting ? 'deleting' : ''} ${todo.completed ? 'completed' : ''}`}
                style={{
                    '--cat-border': cat.border,
                    '--cat-glow': cat.glow,
                    '--cat-stripe': cat.stripe,
                    '--bob-delay': bobDelay,
                    '--bob-duration': bobDuration,
                    transform: hovered
                        ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(30px) scale(1.03)`
                        : `rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)`,
                    boxShadow: hovered
                        ? `0 20px 60px ${cat.glow}, 0 0 30px ${cat.glow}, 0 0 80px rgba(0,0,0,0.5)`
                        : `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                {/* Top stripe */}
                <div className="card-stripe" />

                {/* Header row */}
                <div className="card-header">
                    <span className="card-category" style={{ color: cat.text }}>
                        {todo.category.toUpperCase()}
                    </span>
                    <span className="card-priority" style={{ color: priColor }}>
                        {PRIORITY_LABELS[todo.priority]}
                    </span>
                </div>

                {/* Todo text */}
                <div className="card-body">
                    <p className={`card-text ${todo.completed ? 'line-through opacity-50' : ''}`}>
                        {todo.text}
                    </p>
                    {todo.completed && (
                        <span className="completed-badge">✓ DONE</span>
                    )}
                </div>

                {/* Action buttons */}
                <div className="card-actions">
                    <button
                        onClick={() => completeTodo(todo.id)}
                        className={`btn-action ${todo.completed ? 'btn-undo' : 'btn-done'}`}
                    >
                        {todo.completed ? '↩ Undo' : '✓ Done'}
                    </button>
                    <button onClick={handleDelete} className="btn-action btn-delete">
                        ✕ Delete
                    </button>
                    {/* Priority dot */}
                    <span
                        className="priority-dot"
                        style={{ background: priColor, boxShadow: `0 0 8px ${priColor}` }}
                    />
                </div>
            </div>
        </div>
    );
}
