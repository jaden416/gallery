import React, { useEffect, useState } from 'react'
import { urls } from '../../data/gallery.js'
import HomeScene from '../../three/home/Home.jsx'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

export default function Home() {
  const data = urls;
  const [textures, setTextures] = useState([]);

  const textureLoader = new THREE.TextureLoader();

  useEffect(() => {
    const array = [...document.querySelectorAll('.js-tile')];
    const loadedTextures = array.map((element) =>
      textureLoader.load(element.getAttribute('data-src'))
    );
    setTextures(loadedTextures);
  }, []);
  
  return <>
      <main>
      <article>
        <div className="fixed bottom-0 left-0 h-extra-screen w-full pt-40 flex items-center justify-center bg-white overflow-hidden rounded-t-[4rem] js-t-mask js-grid">
          <div className="absolute inset-x-[-150%] s:inset-x-[-50%] l:inset-x-[-30%] xl:inset-x-[-17.5%] top-0 grid grid-cols-6 cursor-move js-grid-bounds">
          {data.map((media, index)=>(
              <div 
                key={index} 
                data-index={index} 
                className="relative">
                <div className="aspect"  ></div>
                <div className="absolute inset-5 js-tile " data-index={index} data-src={media.src}></div>
              </div>
            ))}
          </div>
          <Canvas
            camera={
              {
                fov: 45,
                zoom: 1 
                fov: 45,
                zoom: 1 
              }
              
            }
          >
            <HomeScene
              textures={textures}
            />
          </Canvas>
        </div>
      </article>
    </main>
  </>
}
