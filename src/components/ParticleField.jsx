import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField() {
    const pointsRef = useRef();

    const { positions, velocities, colors } = useMemo(() => {
        const count = 2500;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const palette = [
            [0.31, 0.56, 0.97],
            [0.66, 0.33, 0.97],
            [0.94, 0.27, 0.27],
            [1.0, 1.0, 1.0],
        ];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

            velocities[i * 3] = (Math.random() - 0.5) * 0.002;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

            const c = palette[Math.floor(Math.random() * palette.length)];
            const brightness = 0.3 + Math.random() * 0.7;
            colors[i * 3] = c[0] * brightness;
            colors[i * 3 + 1] = c[1] * brightness;
            colors[i * 3 + 2] = c[2] * brightness;
        }

        return { positions, velocities, colors };
    }, []);

    const posAttr = useMemo(
        () => new THREE.BufferAttribute(positions, 3),
        [positions]
    );
    const colAttr = useMemo(
        () => new THREE.BufferAttribute(colors, 3),
        [colors]
    );

    useFrame(() => {
        if (!posAttr) return;
        const arr = posAttr.array;
        for (let i = 0; i < arr.length / 3; i++) {
            arr[i * 3] += velocities[i * 3];
            arr[i * 3 + 1] += velocities[i * 3 + 1];
            arr[i * 3 + 2] += velocities[i * 3 + 2];
            if (Math.abs(arr[i * 3]) > 40) arr[i * 3] *= -0.99;
            if (Math.abs(arr[i * 3 + 1]) > 40) arr[i * 3 + 1] *= -0.99;
            if (Math.abs(arr[i * 3 + 2]) > 40) arr[i * 3 + 2] *= -0.99;
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <primitive object={posAttr} attach="attributes-position" />
                <primitive object={colAttr} attach="attributes-color" />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                vertexColors
                transparent
                opacity={0.85}
                sizeAttenuation
            />
        </points>
    );
}
