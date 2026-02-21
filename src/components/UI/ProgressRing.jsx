import useTodoStore from '../../store/useTodoStore';

export default function ProgressRing() {
    const todos = useTodoStore((s) => s.todos);
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    // Color shift: red → amber → green
    const ringColor =
        pct < 33 ? '#ef4444' : pct < 66 ? '#f59e0b' : '#22c55e';

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col items-center gap-2">
            <div className="glass-panel rounded-2xl p-4 flex flex-col items-center gap-1">
                {/* Ring */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80" width="80" height="80">
                        {/* Background track */}
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth="6"
                        />
                        {/* Progress arc */}
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            fill="none"
                            stroke={ringColor}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.6s ease' }}
                        />
                    </svg>
                    {/* Percentage text */}
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className="text-xl font-bold text-white font-orbitron">{pct}</span>
                        <span className="text-xs text-white/40">%</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="text-center">
                    <div className="text-white/70 text-xs font-medium">
                        <span style={{ color: ringColor }}>{completed}</span>
                        <span className="text-white/30"> / {total}</span>
                    </div>
                    <div className="text-white/30 text-[10px] mt-0.5">TASKS DONE</div>
                </div>
            </div>
        </div>
    );
}
