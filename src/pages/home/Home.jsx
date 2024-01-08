import React from 'react'
import { urls } from '../../data/gallery.js'
import HomeScene from '../../three/home/HomeScene.jsx'
import { Canvas } from '@react-three/fiber'
export default function Home() {
  const data = urls;

  return <>
      <main>
      <article>
        <div className="fixed bottom-0 left-0 h-extra-screen w-full pt-40 flex items-center justify-center bg-white overflow-hidden rounded-t-[4rem] js-t-mask js-grid">
          <div className="absolute inset-x-[-150%] s:inset-x-[-50%] l:inset-x-[-30%] xl:inset-x-[-17.5%] top-0 grid grid-cols-6 cursor-move js-grid-bounds">
          {data.map((media, index)=>(
              <div key={index} className="relative">
                <div className="aspect" ></div>
                <div className="absolute inset-5 js-tile" data-src={media.src}></div>
              </div>
            ))}Home
Work
ArchiveHome
Work
Archive
About
Font pairings for SquarespaceBrandingArt Direction for Violent White SupremacyAthens, GreeceTask randomiserFont pairings for SquarespaceHa Giang LoopUnfold PromoPhotography for At HomeUnfold templateOld portfolio about pageUnfold TemplateE-commerace websiteJoshua TreeAbandoned hospital, SchönwaldeMoon Light CoffeeArt Direction for Jigsaw IssueLanding page for old portfolioCostal Waters - Event PosterColour by WordsBranding for a now deceased teamAn Account of Corsica - Title ExplorationThe Current Landing PageMoonlight Coffee business card
About
Font pairings for SquarespaceBrandingArt Direction for Violent White SupremacyAthens, GreeceTask randomiserFont pairings for SquarespaceHa Giang LoopUnfold PromoPhotography for At HomeUnfold templateOld portfolio about pageUnfold TemplateE-commerace websiteJoshua TreeAbandoned hospital, SchönwaldeMoon Light CoffeeArt Direction for Jigsaw IssueLanding page for old portfolioCostal Waters - Event PosterColour by WordsBranding for a now deceased teamAn Account of Corsica - Title ExplorationThe Current Landing PageMoonlight Coffee business card
          </div>
          <Canvas
            camera={
              {
                fov: 45,
                zoom: 1 
              }
              
              
            }
          >
            <HomeScene/>
          </Canvas>
        </div>
      </article>
    </main>
  </>
}
