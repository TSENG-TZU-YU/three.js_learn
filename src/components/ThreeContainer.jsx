import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function ThreeContainer({ style }) {
    const defaultStyle = {
        height: '100vh',
        width: '100vw',
        backgroundColor: 'transparent',
    };
 
    const models = [
        {
          url: 'kizuna_ai_x_azurlane/scene.gltf',
          position: [-150, 0, 0],
          size: 4,
          rotation: [0, 0, 0]
        },
        {
          url: 'matilda/scene.gltf',
          position: [0, 0, 0],
          size: 1,
          rotation: [0, 0, 0]  
        },
        {
          url: 'hollow_knight_model/scene.gltf',
          position: [150, 0, 0],
          size: 35,
          rotation: [0, -0.3, 0]   
        }
      ];
    const isContainerRunning = useRef(false);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (!isContainerRunning.current && containerRef.current) {
             // 生成渲染器
            isContainerRunning.current = true;
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            const loader = new GLTFLoader();
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75, // 视野角度
                containerWidth / containerHeight, //宽高比
                0.1, // 近裁剪面
                1000 // 远裁剪面
            );
            
             // 按鈕
            const container = containerRef.current;
            const button = document.createElement('button');
            button.textContent = 'Click me!';
            button.style.position = 'absolute';
            button.style.top = '70%';
            button.style.left = '50%';
            button.style.transform = 'translate(-50%, -10%)';
            button.style.zIndex = '1';
            container.appendChild(button);
            buttonRef.current = button;

            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(containerWidth * 0.9995, containerHeight * 0.9995);
            containerRef.current.appendChild(renderer.domElement);
            
            models.forEach((model) => {
                loadModel(loader, scene, model.url, model.position, model.size, model.rotation);
              });
              
              const light = new THREE.DirectionalLight(0xffffff, 3); // 創建光源
              light.position.set(0, 100, 50);
              scene.add(light);
              const ambientLight = new THREE.AmbientLight(0xa9a9a9);
              scene.add(ambientLight);
              const controls = new OrbitControls(camera, renderer.domElement);
              animate(isContainerRunning, camera, renderer, scene, controls);
            scene.background = new THREE.Color(0xd3d3d3); // 設置場景背景
            function animate(runningFlag, camera, renderer, scene,controls) {
                if (runningFlag.current) {
                    requestAnimationFrame(() => animate(runningFlag, camera, renderer, scene,controls));
                    controls.update();
                    const radius = 200;
                    const angle = Date.now() * 0.0005;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    camera.position.set(0, 150, 350);
                    camera.lookAt(0, 100, 0);
                    renderer.render(scene, camera);
                }
            }
       
            function loadModel(loader, scene, url, position, size,rotation) {
                loader.load(
                  url,
                  function (gltf) {
                    gltf.scene.position.set(position[0], position[1], position[2]);
                    gltf.scene.scale.set(size, size, size); // Scale the model
                    gltf.scene.rotation.set(rotation[0], rotation[1], rotation[2]); // 设置旋转位置
                    scene.add(gltf.scene);
                  },
                  function (xhr) {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                  },
                  function (error) {
                    console.log('An error happened');
                  }
                );
              }
        }
    }, []);

    return <div ref={containerRef} id="container" style={{ ...defaultStyle, ...style }} />;
}

export default ThreeContainer;
