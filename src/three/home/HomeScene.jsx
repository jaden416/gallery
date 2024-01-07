import React from 'react'
import { useEffect,  useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap'
import Media from './Media';
import normalizeWheel from 'normalize-wheel'
import useTouchEvents from '../../hooks/useTouchEvents'

export default function HomeScene() {
  const [gallery, setGallery] = useState(null)
  const [medias, setMedias] = useState(null)
  const [visible, setVisible] = useState(false);

  const scroll = useRef({
    target: 0,
    current: 0,
    ease: 0.1,
    last: 0,
    position: 0,
    start: 0,
    direction: 'bottom'
  })

  const speed = useRef({
    target: 0,
    current: 0,
    ease: 0.1
  })
  
  const velocity = useRef(0)
  
  const isDown = useRef(false)

  const planeGeometry = new THREE.PlaneGeometry(1, 1, 20, 20);

  useEffect(()=>{
    setGallery(document.querySelector('.js-grid-bounds'))
    setMedias([...document.querySelectorAll('.js-tile')])
    setVisible(true);
  },[])

  useFrame(()=>{
    scroll.current.target -= velocity.current 

    scroll.current.current = gsap.utils.interpolate(
      scroll.current.current,
      scroll.current.target,
      scroll.current.ease
    ) 
    
    speed.current.target = (scroll.current.target - scroll.current.current) * .001


    speed.current.current = gsap.utils.interpolate(
      speed.current.current ,
      speed.current.target,
      speed.current.ease
    );
    
    if (scroll.current.current > scroll.current.last) {
      scroll.current.direction = 'top';
    } else if (scroll.current.current < scroll.current.last) {
      scroll.current.direction = 'bottom';
    }
    scroll.current.last = scroll.current.current
  })

  const onWheel = (event) =>{
    const { pixelY } = normalizeWheel(event)

    scroll.current.target += pixelY

    console.log(pixelY)
  }

  const onTouchDown = (event) => {
    isDown.current = true

    scroll.current.position = scroll.current.current

    scroll.current.start  = event.touches
      ? event.touches[0].clientY
      : event.clientY
  }

  const onTouchMove = (event) =>{
    if (!isDown.current) return

    const y = event.touches
    ? event.touches[0].clientY
    : event.clientY

    const distance = scroll.current.start - y

    scroll.current.target = (scroll.current.position + distance )

  }

  const onTouchUp = () =>{
    isDown.current = false

  }

  useTouchEvents(onWheel, onTouchDown, onTouchMove, onTouchUp)
  if (medias == null) return null;

  return <>
    {medias.map((media, index) =>
      <Media
        key={index}
        hm={index}
        element={media}
        galleryElement={gallery}
        geometry={planeGeometry}
        visible={visible}
        scroll={scroll.current}
        speed = {speed.current}
        isDown={isDown}
      />
    )}
  </>
  
}
