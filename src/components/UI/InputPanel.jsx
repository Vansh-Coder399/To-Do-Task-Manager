import { useState } from 'react';
import useTodoStore from '../../store/useTodoStore';

const CATEGORIES = ['Work', 'Personal', 'Urgent'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const CAT_COLORS = {
    Work: 'border-blue-500 text-blue-400 bg-blue-500/20',
    Personal: 'border-purple-500 text-purple-400 bg-purple-500/20',
    Urgent: 'border-red-500 text-red-400 bg-red-500/20',
};

const PRI_COLORS = {
    High: 'border-red-500 text-red-400 bg-red-500/20',
    Medium: 'border-amber-500 text-amber-400 bg-amber-500/20',
    Low: 'border-green-500 text-green-400 bg-green-500/20',
};

export default function InputPanel() {
    const addTodo = useTodoStore((s) => s.addTodo);
    const [text, setText] = useState('');
    const [category, setCategory] = useState('Work');
    const [priority, setPriority] = useState('Medium');
    const [shake, setShake] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        addTodo(text.trim(), category, priority);
        setText('');
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
            <form
                onSubmit={handleSubmit}
                className={`
          glass-panel
          rounded-2xl p-5 flex flex-col gap-4
          ${shake ? 'animate-shake' : ''}
        `}
            >
                {/* Text input */}
                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What needs to be done in the cosmos…"
                        maxLength={80}
                        className="
              flex-1 bg-white/5 border border-white/10 rounded-xl
              px-4 py-3 text-white placeholder-white/30 text-sm
              outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30
              transition-all duration-200 font-inter
            "
                    />
                    <button
                        type="submit"
                        className="
              px-5 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:from-blue-500 hover:to-purple-500
              text-white transition-all duration-200
              hover:shadow-lg hover:shadow-blue-500/30
              active:scale-95 whitespace-nowrap
            "
                        id="add-todo-btn"
                    >
                        + Launch
                    </button>
                </div>

                {/* Category & Priority selectors */}
                <div className="flex flex-wrap gap-3 items-center">
                    {/* Category pills */}
                    <div className="flex gap-1.5">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`
                  px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                  ${category === cat ? CAT_COLORS[cat] : 'border-white/10 text-white/40 bg-white/5 hover:border-white/20'}
                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-4 bg-white/10" />

                    {/* Priority pills */}
                    <div className="flex gap-1.5">
                        {PRIORITIES.map((pri) => (
                            <button
                                key={pri}
                                type="button"
                                onClick={() => setPriority(pri)}
                                className={`
                  px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
                  ${priority === pri ? PRI_COLORS[pri] : 'border-white/10 text-white/40 bg-white/5 hover:border-white/20'}
                `}
                            >
                                {pri}
                            </button>
                        ))}
                    </div>

                    {/* Hint */}
                    <span className="ml-auto text-white/20 text-xs hidden sm:block">
                        Drag to orbit · Scroll to zoom
                    </span>
                </div>
            </form>
        </div>
    );
}
