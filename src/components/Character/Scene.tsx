import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const addAccessories = (headBone: THREE.Object3D) => {
  const accessoriesGroup = new THREE.Group();
  accessoriesGroup.name = "customAccessories";

  // Frames material: Dark metallic grey/black
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Lenses material: Tinted translucent physical glass (like the sunglasses in the user's photo)
  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x2b303a,
    transparent: true,
    opacity: 0.45,
    roughness: 0.15,
    transmission: 0.6,
    thickness: 0.05,
    ior: 1.5,
    side: THREE.DoubleSide
  });

  // 1. Left and Right rims (Spectacles frame)
  // Standard spacing: eyebrow_L is at x = 0.437, eyebrow_R is at x = -0.437
  const rimRadius = 0.16;
  const leftRimGeom = new THREE.TorusGeometry(rimRadius, 0.02, 16, 32);
  const leftRim = new THREE.Mesh(leftRimGeom, frameMaterial);
  leftRim.position.set(0.437, 1.42, 1.08);
  accessoriesGroup.add(leftRim);

  const rightRimGeom = new THREE.TorusGeometry(rimRadius, 0.02, 16, 32);
  const rightRim = new THREE.Mesh(rightRimGeom, frameMaterial);
  rightRim.position.set(-0.437, 1.42, 1.08);
  accessoriesGroup.add(rightRim);

  // 2. Lenses
  const lensGeom = new THREE.CircleGeometry(rimRadius - 0.005, 32);
  const leftLens = new THREE.Mesh(lensGeom, lensMaterial);
  leftLens.position.set(0.437, 1.42, 1.08);
  accessoriesGroup.add(leftLens);

  const rightLens = new THREE.Mesh(lensGeom, lensMaterial);
  rightLens.position.set(-0.437, 1.42, 1.08);
  accessoriesGroup.add(rightLens);

  // 3. Bridge
  const bridgeGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8);
  const bridge = new THREE.Mesh(bridgeGeom, frameMaterial);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 1.45, 1.10);
  accessoriesGroup.add(bridge);

  // 4. Temples (Arms extending to the ears)
  const templeLength = 1.25;
  const templeGeom = new THREE.CylinderGeometry(0.012, 0.012, templeLength, 8);
  
  const leftTemple = new THREE.Mesh(templeGeom, frameMaterial);
  leftTemple.rotation.x = Math.PI / 2;
  leftTemple.position.set(0.58, 1.42, 1.08 - templeLength / 2);
  accessoriesGroup.add(leftTemple);

  const rightTemple = new THREE.Mesh(templeGeom, frameMaterial);
  rightTemple.rotation.x = Math.PI / 2;
  rightTemple.position.set(-0.58, 1.42, 1.08 - templeLength / 2);
  accessoriesGroup.add(rightTemple);

  // 5. Mustache (curved segment below nose)
  const mustacheMaterial = new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 0.95,
    metalness: 0.05
  });
  
  const mustacheLeftGeom = new THREE.TorusGeometry(0.13, 0.025, 8, 16, Math.PI / 2);
  const mustacheLeft = new THREE.Mesh(mustacheLeftGeom, mustacheMaterial);
  mustacheLeft.rotation.z = -Math.PI / 5;
  mustacheLeft.rotation.y = Math.PI;
  mustacheLeft.position.set(0.08, 1.12, 1.12);
  accessoriesGroup.add(mustacheLeft);

  const mustacheRightGeom = new THREE.TorusGeometry(0.13, 0.025, 8, 16, Math.PI / 2);
  const mustacheRight = new THREE.Mesh(mustacheRightGeom, mustacheMaterial);
  mustacheRight.rotation.z = Math.PI / 5;
  mustacheRight.position.set(-0.08, 1.12, 1.12);
  accessoriesGroup.add(mustacheRight);

  // 6. Goatee (chin beard)
  const goateeGeom = new THREE.BoxGeometry(0.14, 0.18, 0.03);
  const goatee = new THREE.Mesh(goateeGeom, mustacheMaterial);
  goatee.position.set(0, 0.82, 1.05);
  goatee.rotation.x = -Math.PI / 12;
  accessoriesGroup.add(goatee);

  // 7. Goatee soul patch (below lower lip)
  const soulPatchGeom = new THREE.ConeGeometry(0.06, 0.08, 4);
  const soulPatch = new THREE.Mesh(soulPatchGeom, mustacheMaterial);
  soulPatch.rotation.x = Math.PI;
  soulPatch.position.set(0, 0.96, 1.08);
  accessoriesGroup.add(soulPatch);

  headBone.add(accessoriesGroup);
};

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          if (headBone) {
            addAccessories(headBone);
          }
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let isVisible = true;
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      if (canvasDiv.current) {
        observer.observe(canvasDiv.current);
      }

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        requestAnimationFrame(animate);
        if (!isVisible) return;
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        observer.disconnect();
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
