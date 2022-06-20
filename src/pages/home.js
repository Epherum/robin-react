import * as THREE from "three";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { shaderMaterial, MapControls, OrbitControls } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./Home.css";
import { Suspense, useRef, useState, useEffect } from "react";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion-3d";

const ParallaxShaderMaterial = shaderMaterial(
  // Uniform
  { uTime: 0, uTexture: new THREE.Texture(), udstFromCenter: 0 },
  //Vertex Shader

  glsl`
  varying vec2 vUv;
  uniform float uTime;
  float PI =3.14159;

    void main() {
      vUv=(uv - vec2(0.5))*0.9+vec2(0.5);
      

      vec3 pos=position;

      pos.x+=sin(PI*uv.x)*0.05;
      pos.y+=sin(PI*uv.x)*0.02;
      pos.z+=sin(PI*uv.x)*0.05;

      pos.y+=sin(uTime*0.9)*0.05;
      vUv.y-=sin(uTime*0.9)*0.05;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }


  
  `,
  //fragment Shader
  glsl`
   precision mediump float;
   uniform float uTime;
   varying vec2 vUv;
   uniform sampler2D uTexture;
   uniform float udstFromCenter;

    void main() {
      vec4 t=texture2D(uTexture,vUv);

      float bw=(t.r+t.b+t.g)/3.;

      vec4 another=vec4(bw,bw,bw,1.);

    

      gl_FragColor = mix( another, t,udstFromCenter);
      gl_FragColor.a = clamp(udstFromCenter,0.6,.8);


      // vec3 texture = texture2D(uTexture, vUv).rgb;
      
      // gl_FragColor = vec4(texture, .78);
    }
  
  `
);

extend({ ParallaxShaderMaterial });

const Parallax = ({ position, navigate, page, image }) => {
  const transition = { duration: 1.4, ease: [0.6, 0.01, -0.05, 0.9] };
  const ref = useRef();
  const mesh = useRef();
  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
  });

  return (
    <>
      <mesh ref={mesh} onClick={() => navigate(page)}>
        <planeBufferGeometry args={[1.5, 1, 20, 20]} />
        <parallaxShaderMaterial ref={ref} uTexture={image} />
      </mesh>
    </>
  );
};

const BigPlane = ({ onMount }) => {
  const [color, setColor] = useState("blue");

  useEffect(() => {
    onMount([color, setColor]);
  }, [onMount, color]);

  return (
    <mesh position={[0, 0, -3]}>
      <planeBufferGeometry args={[30, 30, 20, 20]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};
let value = null;
let setValue = null;
const onChildMount = (dataFromChild) => {
  value = dataFromChild[0];
  setValue = dataFromChild[1];
};

const GroupeParallax = ({ navigate }) => {
  function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  let attractMode = false;
  let oldPosition = 0;
  let attractTo = 0;
  let position = 0;
  let rounded = 0;
  let scale = 0;
  let speed = 0;
  let diff = 0;
  let x = 0;
  window.addEventListener("wheel", (e) => {
    speed += e.deltaY * 0.0003;
  });

  // ? ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.03;

  if (rounded === 0) {
    setValue = 0;
  } else if (rounded === 1) {
    setValue = 1;
  } else if (rounded === 2) {
    setValue = 2;
  }

  const ref = useRef();
  const planeref = useRef();
  useFrame(() => {
    position += speed;
    speed *= 0.8;
    let objs = Array(3).fill({ dist: 0 });

    objs.forEach((o, i) => {
      o.dist = Math.min(Math.abs(position - i), 1);
      o.dist = 1 - o.dist ** 2;
      scale = 1 + 0.1 * o.dist;
      ref.current.children[i].position.y = -(i * 1.2 - position * 1.2);
      ref.current.children[i].scale.set(scale, scale, scale);
      ref.current.children[i].material.uniforms.udstFromCenter.value = o.dist;
      position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
      position = clamp(position, -0.3, 2.3);
      rounded = Math.abs(Math.round(position));
      diff = rounded - position;
    });
  });

  const [image1, image2, image3] = useLoader(THREE.TextureLoader, [
    img1,
    img2,
    img3,
  ]);

  // !HEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  return (
    <>
      <BigPlane onMount={onChildMount} />
      <group ref={ref} position={[0.5, 0, 0]} rotation={[-0.2, -0.5, -0.1]}>
        <Parallax
          position={[0, 0, 0]}
          navigate={navigate}
          page={"/page1"}
          image={image1}
        />
        <Parallax
          position={[0, -1.2, 0]}
          navigate={navigate}
          page={"/page2"}
          image={image2}
        />
        <Parallax
          position={[0, -2.4, 0]}
          navigate={navigate}
          page={"/page1"}
          image={image3}
        />
      </group>
    </>
  );
};
const Controls = () => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    controlsRef.current.addEventListener("change", function () {
      if (this.target.x < -2) {
        this.target.x = -2;
        camera.position.x = -2;
      } else if (this.target.x > 2) {
        this.target.x = 2;
        camera.position.x = 2;
      }
      if (this.target.y < -2) {
        this.target.y = -2;
        camera.position.y = -2;
      } else if (this.target.y > 2) {
        this.target.y = 2;
        camera.position.y = 2;
      }
    });
  }, []);

  return (
    <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} />
  );
};

const Scene = ({ navigate }) => {
  return (
    <div style={{ position: "fixed", width: "100%", height: "100%" }}>
      <Canvas className="scene" camera={{ position: [0, 0, 2], fov: 60 }}>
        <Suspense fallback={null}>
          <GroupeParallax navigate={navigate} />
        </Suspense>
        <Controls />
      </Canvas>
    </div>
  );
};

const Scene2 = ({ navigate, color }) => {
  console.log(color);
  return (
    <div
      style={{ position: "fixed", width: "100%", height: "100%", zIndex: "-2" }}
    >
      <Canvas className="scene" camera={{ position: [0, 0, 2], fov: 60 }}>
        <Suspense fallback={null}></Suspense>
      </Canvas>
    </div>
  );
};

function Home() {
  let navigate = useNavigate();

  return (
    <>
      <Scene navigate={navigate} />
      {/* <Scene2 navigate={navigate} /> */}
    </>
  );
}

export default Home;
