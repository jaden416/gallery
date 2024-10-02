import React, { useEffect, useState } from "react";
import { urls } from "../../data/gallery.js";
import HomeScene from "../../three/home/HomeScene.jsx";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export default function Home() {
  const data = urls;
  const [textures, setTextures] = useState([]);

  const textureLoader = new THREE.TextureLoader();

  useEffect(() => {
    const array = [...document.querySelectorAll(".js-tile")];
    const loadedTextures = array.map((element) =>
      textureLoader.load(element.getAttribute("data-src"))
    );
    setTextures(loadedTextures);
  }, []);

  return (
    <>
      <main>
        <article>
          <div className="fixed bottom-0 left-0 h-extra-screen w-full pt-40 flex items-center justify-center bg-white overflow-hidden rounded-t-[4rem] js-t-mask js-grid">
            <div className="absolute inset-x-[-150%] s:inset-x-[-50%] l:inset-x-[-30%] xl:inset-x-[-17.5%] top-0 grid grid-cols-6 cursor-move js-grid-bounds">
              {data.map((media, index) => (
                <div key={index} data-index={index} className="relative">
                  <div className="aspect"></div>
                  <div
                    className="absolute inset-5 js-tile "
                    data-index={index}
                    data-src={media.src}
                  ></div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none	 relative z-10 flex flex-col items-center justify-center">
              <img
                src="/src/assets/k/Font-Pairings-01.jpg"
                className="invisible pointer-events-none	 h-[60rem] w-auto grid-focused js-grid-focused"
              />
              <div className="relative min-w-[24rem] h-[5rem] js-grid-content">
                {data.map((item, index) => {
                  return (
                    <p
                      key={index}
                      className="absolute top-4 left-0 w-full text-18 opacity-0 text-center text-md js-grid-text"
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="absolute h-full w-full">
              <Canvas
                className="gl z-5"
                camera={{
                  fov: 45,
                  zoom: 1,
                }}
              >
                <HomeScene textures={textures} />
              </Canvas>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
