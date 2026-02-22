import useTodoStore from '../../store/useTodoStore';

export default function Header() {
    const todos = useTodoStore((s) => s.todos);
    const active = todos.filter((t) => !t.completed && !t.deleting).length;

    return (
        <div className="fixed top-6 left-6 z-50">
            <div className="glass-panel rounded-2xl px-5 py-3">
                <h1 className="text-xl font-black text-white font-orbitron neon-text tracking-widest">
                    TO-DO TASK MANAGER
                </h1>
                <div className="flex items-center gap-2 mt-1">
                    {/* Pulse dot */}
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <p className="text-white/40 text-xs tracking-wider">
                        {active === 0
                            ? 'Build with ❤️ By Vansh Tiwari'
                            : `${active} task${active !== 1 ? 's' : ''} floating in orbit`}
                    </p>
                </div>
            </div>
        </div>
    );
}
