import * as THREE from "three";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./Home.css";
import { Suspense, useRef } from "react";
import img1 from "../images/img1.jpg";
import { useNavigate } from "react-router-dom";

const ParallaxShaderMaterial = shaderMaterial(
  // Uniform
  { uTime: 0, uTexture: new THREE.Texture() },
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
   uniform float dstFromCenter;

    void main() {
      // vec4 t=texture2D(uTexture,vUv);

      // float bw=(t.r+t.b+t.g)/3.;

      // vec4 another=vec4(bw,bw,bw,1.);

    

      // gl_FragColor = mix( another, t,dstFromCenter);
      // gl_FragColor.a = clamp(dstFromCenter,0.6,1.);


      vec3 texture = texture2D(uTexture, vUv).rgb;
      
      gl_FragColor = vec4(texture, .78);
    }
  
  `
);

extend({ ParallaxShaderMaterial });

const Parallax = ({ position, navigate, page }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
  });

  const [image1] = useLoader(THREE.TextureLoader, [img1]);

  return (
    <>
      <mesh position={position} onClick={() => navigate(page)}>
        <planeBufferGeometry args={[1.5, 1, 20, 20]} />
        <parallaxShaderMaterial ref={ref} uTexture={image1} />
      </mesh>
    </>
  );
};

const Groupee = ({ navigate }) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.03;
  });
  return (
    <group ref={ref} position={[0.5, 0, 0]} rotation={[-0.2, -0.5, -0.1]}>
      <Parallax position={[0, 1, 0]} navigate={navigate} page={"/page1"} />
      <Parallax position={[0, -0.2, 0]} navigate={navigate} page={"/page2"} />
      <Parallax position={[0, -1.3, 0]} navigate={navigate} page={"/page1"} />
      <Parallax position={[0, -3, 0]} navigate={navigate} />
    </group>
  );
};

const Scene = ({ navigate }) => {
  return (
    <div style={{ position: "fixed", width: "100%", height: "100%" }}>
      <Canvas className="scene" camera={{ position: [0, 0, 4], fov: 60 }}>
        <Suspense fallback={null}>
          <Groupee navigate={navigate} />
        </Suspense>
      </Canvas>
    </div>
  );
};

function Home() {
  let navigate = useNavigate();

  return (
    <>
      <Scene navigate={navigate} />
    </>
  );
}

export default Home;
