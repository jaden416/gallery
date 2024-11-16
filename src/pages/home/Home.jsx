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
      textureLoader.load(element.getAttribute("data-src")),
    );
    setTextures(loadedTextures);
  }, []);

  return (
    <>
      <main>
        <article>
          <div className="h-extra-screen js-t-mask js-grid fixed bottom-0 left-0 flex w-full items-center justify-center overflow-hidden rounded-t-[4rem] bg-white pt-40">
            <div className="js-grid-bounds absolute inset-x-[-150%] top-0 grid cursor-move grid-cols-6 s:inset-x-[-50%] l:inset-x-[-30%] xl:inset-x-[-17.5%]">
              {data.map((media, index) => (
                <div key={index} data-index={index} className="relative">
                  <div className="aspect">
                    <div
                      className="js-tile absolute inset-5"
                      data-index={index}
                      data-src={media.src}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none relative z-10 flex flex-col items-center justify-center">
              <img
                src="/lathe-patterns/1.jpg"
                className="grid-focused js-grid-focused pointer-events-none invisible h-[60rem] w-auto"
              />
              <div className="js-grid-content relative h-[5rem] min-w-[24rem]">
                {data.map((item, index) => {
                  return (
                    <p
                      key={index}
                      className="text-18 js-grid-text absolute left-0 top-[-1] w-full text-center text-md opacity-0"
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            </div>{" "}
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
