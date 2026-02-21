import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import useTodoStore from '../store/useTodoStore';

const CATEGORY_COLORS = {
    Work: '#4f8ef7',
    Personal: '#a855f7',
    Urgent: '#ef4444',
};

const PRIORITY_COLORS = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#22c55e',
};

const PRIORITY_LABEL = { High: '▲ HIGH', Medium: '● MED', Low: '▼ LOW' };

function DeleteParticles({ position, color, onDone }) {
    const refs = useRef([]);
    const velocities = useRef(
        Array.from({ length: 20 }, () => ({
            x: (Math.random() - 0.5) * 0.18,
            y: (Math.random() - 0.5) * 0.18,
            z: (Math.random() - 0.5) * 0.18,
        }))
    );
    const life = useRef(0);

    useFrame(() => {
        life.current += 0.03;
        refs.current.forEach((mesh, i) => {
            if (!mesh) return;
            mesh.position.x += velocities.current[i].x;
            mesh.position.y += velocities.current[i].y;
            mesh.position.z += velocities.current[i].z;
            mesh.scale.setScalar(Math.max(0, 1 - life.current));
            if (mesh.material) mesh.material.opacity = Math.max(0, 1 - life.current);
        });
        if (life.current > 1.2) onDone();
    });

    return (
        <group position={position}>
            {Array.from({ length: 20 }).map((_, i) => (
                <mesh key={i} ref={(el) => (refs.current[i] = el)}>
                    <sphereGeometry args={[0.08, 6, 6]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={2}
                        transparent
                        opacity={1}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function TodoCardMesh({ todo }) {
    const { completeTodo, markDeleting, deleteTodo } = useTodoStore();
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [showParticles, setShowParticles] = useState(false);
    const bobOffset = useRef(Math.random() * Math.PI * 2);
    const catColor = CATEGORY_COLORS[todo.category] || '#4f8ef7';
    const priColor = PRIORITY_COLORS[todo.priority] || '#f59e0b';

    // Entry spring from below
    const [entrySpring, entryApi] = useSpring(() => ({
        position: [todo.position[0], todo.position[1] - 20, todo.position[2]],
        scale: [0.1, 0.1, 0.1],
        config: { tension: 120, friction: 18 },
    }));

    // Hover spring
    const [hoverSpring] = useSpring(() => ({
        emissiveIntensity: hovered ? 0.6 : 0.05,
        config: { tension: 200, friction: 25 },
    }), [hovered]);

    // Completed spring
    const [completedSpring] = useSpring(() => ({
        rotationY: todo.completed ? Math.PI : 0,
        opacity: todo.completed ? 0.45 : 1,
        config: { tension: 80, friction: 20 },
    }), [todo.completed]);

    // Delete spring
    const [deleteSpring, deleteApi] = useSpring(() => ({
        scale: [1, 1, 1],
        config: { tension: 200, friction: 10 },
    }));

    useEffect(() => {
        entryApi.start({
            position: [todo.position[0], todo.position[1], todo.position[2]],
            scale: [1, 1, 1],
        });
    }, []);

    useEffect(() => {
        if (todo.deleting) {
            deleteApi.start({ scale: [0, 0, 0] });
            setShowParticles(true);
        }
    }, [todo.deleting]);

    // Bob animation
    useFrame((state) => {
        if (!groupRef.current || todo.deleting) return;
        const t = state.clock.elapsedTime;
        groupRef.current.position.y =
            (entrySpring.position.get()[1]) + Math.sin(t * 0.8 + bobOffset.current) * 0.12;

        // Hover tilt
        if (meshRef.current) {
            const targetRX = hovered ? 0.08 : 0;
            const targetRY = hovered ? 0.1 : 0;
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRX, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRY + completedSpring.rotationY.get(), 0.08);
        }
    });

    const handleDelete = () => {
        markDeleting(todo.id);
        setTimeout(() => deleteTodo(todo.id), 1200);
    };

    const truncate = (str, n) => str.length > n ? str.slice(0, n) + '…' : str;

    return (
        <>
            {showParticles && (
                <DeleteParticles
                    position={todo.position}
                    color={catColor}
                    onDone={() => setShowParticles(false)}
                />
            )}
            <animated.group
                ref={groupRef}
                position={entrySpring.position}
                scale={deleteSpring.scale}
            >
                {/* Glow light on hover */}
                {hovered && (
                    <pointLight color={catColor} intensity={1.5} distance={4} decay={2} />
                )}

                <group ref={meshRef}>
                    {/* Card body */}
                    <RoundedBox
                        args={[3.8, 2.2, 0.18]}
                        radius={0.12}
                        smoothness={4}
                        onPointerEnter={() => setHovered(true)}
                        onPointerLeave={() => setHovered(false)}
                        onClick={() => completeTodo(todo.id)}
                    >
                        <animated.meshPhysicalMaterial
                            color={todo.completed ? '#1a1a2e' : '#0d1b3e'}
                            emissive={catColor}
                            emissiveIntensity={hoverSpring.emissiveIntensity}
                            roughness={0.15}
                            metalness={0.3}
                            transparent
                            opacity={completedSpring.opacity}
                            envMapIntensity={1}
                        />
                    </RoundedBox>

                    {/* Top color stripe */}
                    <mesh position={[0, 0.92, 0.1]}>
                        <planeGeometry args={[3.6, 0.08]} />
                        <meshStandardMaterial color={catColor} emissive={catColor} emissiveIntensity={1} />
                    </mesh>

                    {/* Category badge */}
                    <Text
                        position={[-1.55, 0.72, 0.11]}
                        fontSize={0.13}
                        color={catColor}
                        anchorX="left"
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
                    >
                        {todo.category.toUpperCase()}
                    </Text>

                    {/* Priority badge */}
                    <Text
                        position={[1.55, 0.72, 0.11]}
                        fontSize={0.12}
                        color={priColor}
                        anchorX="right"
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
                    >
                        {PRIORITY_LABEL[todo.priority]}
                    </Text>

                    {/* Todo text */}
                    <Text
                        position={[0, 0.1, 0.11]}
                        fontSize={todo.text.length > 30 ? 0.18 : 0.22}
                        maxWidth={3.2}
                        color={todo.completed ? '#6b7280' : '#e2e8f0'}
                        anchorX="center"
                        anchorY="middle"
                        textAlign="center"
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
                        lineHeight={1.3}
                    >
                        {truncate(todo.text, 60)}
                    </Text>

                    {/* Completed checkmark */}
                    {todo.completed && (
                        <Text
                            position={[0, 0.58, 0.12]}
                            fontSize={0.22}
                            color="#22c55e"
                            anchorX="center"
                            font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
                        >
                            ✓ DONE
                        </Text>
                    )}

                    {/* Action buttons row */}
                    <Text
                        position={[-0.6, -0.78, 0.11]}
                        fontSize={0.16}
                        color={todo.completed ? '#6b7280' : '#22c55e'}
                        anchorX="center"
                        onClick={() => completeTodo(todo.id)}
                        onPointerEnter={() => setHovered(true)}
                        onPointerLeave={() => setHovered(false)}
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
                    >
                        {todo.completed ? '↩ Undo' : '✓ Done'}
                    </Text>

                    <Text
                        position={[0.6, -0.78, 0.11]}
                        fontSize={0.16}
                        color="#ef4444"
                        anchorX="center"
                        onClick={handleDelete}
                        onPointerEnter={() => setHovered(true)}
                        onPointerLeave={() => setHovered(false)}
                        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
                    >
                        ✕ Delete
                    </Text>

                    {/* Priority dot indicator */}
                    <mesh position={[1.7, -0.85, 0.1]}>
                        <sphereGeometry args={[0.07, 8, 8]} />
                        <meshStandardMaterial
                            color={priColor}
                            emissive={priColor}
                            emissiveIntensity={2}
                        />
                    </mesh>
                </group>
            </animated.group>
        </>
    );
}
