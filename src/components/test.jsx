import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.145.0/examples/jsm/loaders/GLTFLoader.js';

function ThreeContainer({ style }) {
    const defaultStyle = {
        width: '100vh',
        height: '100vh',
        backgroundColor: 'transparent',
    };
    const isContainerRunning = useRef(false);
    const containerRef = useRef(null);
    useEffect(() => {
        if (!isContainerRunning.current && containerRef.current) {
            isContainerRunning.current = true;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current.appendChild(renderer.domElement);
            loadModel(loader, scene);
            animate(isContainerRunning, camera, renderer, scene);
            function animate(runningFlag, camera, renderer, scene) {
                if (runningFlag.current) {
                    requestAnimationFrame(() => {
                        animate(runningFlag, camera, renderer, scene);
                    });
                    const radius = 140;
                    const angle = Date.now() * 0.0005;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    camera.position.set(x, 70, z);
                    camera.lookAt(0, 50, 0);
                    renderer.render(scene, camera);
                }
            }
            function loadModel(loader, scene) {
                loader.load(
                    'matilda/scene.gltf',
                    function (gltf) {
                        scene.add(gltf.scene);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    },
                    function (error) {
                        console.error(error);
                    }
                );
            }
        }
    }),
        [];

    return <div ref={containerRef} id="container" style={{ ...defaultStyle, ...style }} />;
}

export default ThreeContainer;
