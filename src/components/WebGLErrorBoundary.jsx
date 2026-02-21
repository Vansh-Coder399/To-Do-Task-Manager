import { Component } from 'react';

export default class WebGLErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error) {
        console.warn('WebGL error caught by boundary:', error.message);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-space">
                    <div className="glass-panel rounded-2xl p-8 max-w-md text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="font-orbitron text-white text-xl font-bold neon-text mb-2">
                            WebGL Unavailable
                        </h2>
                        <p className="text-white/60 text-sm mb-6 leading-relaxed">
                            Your GPU (Intel HD 3000) is on Chrome's WebGL blocklist. The 3D scene cannot render.
                        </p>

                        <div className="text-left space-y-3">
                            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Fix Options:</p>

                            {/* Fix 1 */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-white/80 text-xs font-semibold mb-1">✅ Option 1 — Enable WebGL in Chrome (Recommended)</p>
                                <p className="text-white/50 text-xs">
                                    1. Open a new tab → go to <span className="text-blue-400 font-mono">chrome://flags/#ignore-gpu-denylist</span><br />
                                    2. Set it to <span className="text-green-400 font-semibold">Enabled</span><br />
                                    3. Click "Relaunch" → refresh this page
                                </p>
                            </div>

                            {/* Fix 2 */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-white/80 text-xs font-semibold mb-1">🦊 Option 2 — Use Firefox</p>
                                <p className="text-white/50 text-xs">
                                    Firefox handles old Intel GPUs better.<br />
                                    Open <span className="text-blue-400 font-mono">http://localhost:5173</span> in Firefox.
                                </p>
                            </div>

                            {/* Fix 3 */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-white/80 text-xs font-semibold mb-1">⚡ Option 3 — Launch Chrome with flags</p>
                                <p className="text-white/50 text-[10px] font-mono break-all">
                                    chrome.exe --disable-gpu-driver-bug-workarounds --enable-unsafe-webgl
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
