import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import ParticleField from './ParticleField';
import TodoCardMesh from './TodoCardMesh';
import WebGLErrorBoundary from './WebGLErrorBoundary';
import useTodoStore from '../store/useTodoStore';

export default function Scene() {
    const todos = useTodoStore((s) => s.todos);

    return (
        <WebGLErrorBoundary>
            <Canvas
                camera={{ position: [0, 0, 14], fov: 60 }}
                style={{ background: 'transparent' }}
                gl={{
                    antialias: false,          // reduce GPU load on old cards
                    alpha: true,
                    powerPreference: 'default',
                    failIfMajorPerformanceCaveat: false, // don't fail on low-perf GPUs
                    preserveDrawingBuffer: false,
                }}
                dpr={1}                      // force 1x pixel ratio (no Retina overhead)
                frameloop="demand"           // only render on state change (saves CPU/GPU)
                onCreated={({ gl }) => {
                    gl.setClearColor(0x030712, 1);
                }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.3} color="#1a1a4e" />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#4f8ef7" />
                <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
                <pointLight position={[0, 15, 0]} intensity={0.6} color="#ffffff" />

                {/* Deep space starfield */}
                <Stars
                    radius={80}
                    depth={60}
                    count={2000}
                    factor={4}
                    saturation={0.5}
                    fade
                    speed={0.4}
                />

                {/* Custom animated particle field */}
                <ParticleField />

                {/* Orbit controls */}
                <OrbitControls
                    enablePan
                    enableZoom
                    enableRotate
                    zoomSpeed={0.6}
                    rotateSpeed={0.5}
                    panSpeed={0.8}
                    minDistance={4}
                    maxDistance={35}
                    makeDefault
                />

                {/* Todo cards */}
                {todos.map((todo) => (
                    <TodoCardMesh key={todo.id} todo={todo} />
                ))}
            </Canvas>
        </WebGLErrorBoundary>
    );
}
