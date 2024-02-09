import React from 'react'
import { useEffect,  useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap'
import Media from './Media';
import normalizeWheel from 'normalize-wheel'
import useTouchEvents from '../../hooks/useTouchEvents'


export default function HomeScene({textures}) {



  const [gallery, setGallery] = useState(null)
  const [medias, setMedias] = useState(null)
  const [texts, setTexts] = useState(null)
  const [focusedTile, setFocusedTile] = useState(null)
  
  const [visible, setVisible] = useState({
    index: null,
    state: true,
  })


  const scroll = useRef({
      x : {
      target: 0,
      current: 0,
      ease: 0.1,
      last: 0,
      position: 0,
      start: 0,
      direction: 'right'
    },
    y : {
      target: 0,
      current: 0,
      ease: 0.1,
      last: 0,
      position: 0,
      start: 0,
      direction: 'bottom'
    }
  })

  const speed = useRef({
    target: 0,
    current: 0,
    ease: 0.1
  })

  
  const isDown = useRef(false)

  const hit = useRef(null) // used to briefly identify the plane index the user clicks on


  const {scene, camera, raycaster, pointer} = useThree()


  const planeGeometry = new THREE.PlaneGeometry(1, 1, 20, 20);

  useEffect(()=>{
    setGallery(document.querySelector('.js-grid-bounds'))
    setMedias([...document.querySelectorAll('.js-tile')])
    setTexts([...document.querySelectorAll('.js-grid-text')])

    setFocusedTile(document.querySelector('.js-grid-focused'))



  },[])

  useFrame(()=>{

    scroll.current.y.current = gsap.utils.interpolate(
      scroll.current.y.current,
      scroll.current.y.target,
      scroll.current.y.ease
    ) 

    scroll.current.x.current = gsap.utils.interpolate(
      scroll.current.x.current,
      scroll.current.x.target,
      scroll.current.x.ease
    ) 
    
    speed.current.target = (scroll.current.y.target - scroll.current.y.current) * .001


    speed.current.current = gsap.utils.interpolate(
      speed.current.current ,
      speed.current.target,
      speed.current.ease
    );
    
    if (scroll.current.x.current > scroll.current.x.last) {
      scroll.current.x.direction = 'left';
    } else if (scroll.current.x.current < scroll.current.x.last) {
      scroll.current.x.direction = 'right';
    }
    scroll.current.x.last = scroll.current.x.current

    if (scroll.current.y.current > scroll.current.y.last) {
      scroll.current.y.direction = 'top';
    } else if (scroll.current.y.current < scroll.current.y.last) {
      scroll.current.y.direction = 'bottom';

    }
    scroll.current.y.last = scroll.current.y.current
  })

  const onWheel = (event) =>{
    if(!visible.state) return

    const { pixelY, pixelX } = normalizeWheel(event)

    scroll.current.y.target += pixelY / 6
    scroll.current.x.target -= pixelX / 6
  }

  const onTouchDown = (event) => {
    if(!visible.state) return
    isDown.current = true

    scroll.current.x.position = scroll.current.x.current
    scroll.current.y.position = scroll.current.y.current


    scroll.current.x.start  = event.touches
    ? event.touches[0].clientX
    : event.clientX

    scroll.current.y.start  = event.touches
      ? event.touches[0].clientY
      : event.clientY


  }

  const onTouchMove = (event) =>{
    if (!isDown.current || !visible.state) return

    const x = event.touches
    ? event.touches[0].clientX
    : event.clientX
    
    const y = event.touches
    ? event.touches[0].clientY
    : event.clientY

    const distanceX = scroll.current.x.start - x
    const distanceY = scroll.current.y.start - y

    scroll.current.x.target = (scroll.current.x.position + -distanceX)
    scroll.current.y.target = (scroll.current.y.position + distanceY)

  }

  const onTouchUp = () =>{

    isDown.current = false


    if(Math.round(scroll.current.x.target) == Math.round(scroll.current.x.position)){
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if(intersects.length > 0){
        const obj = intersects[0].object
        hit.current = obj.index


        visible.state ? onOpen(hit.current) : onClose() // click
      }else{
        onClose() // will change later
        
      }
    }
  }

  const onOpen = (index) =>{
    setVisible({
      index,
      state: false
    })
  }

  const onClose = () =>{
    setVisible({
      index: null,
      state: true
    })
  }

  useTouchEvents(onWheel, onTouchDown, onTouchMove, onTouchUp)
  if (medias == null && texts == null) return null;

  return <>

    {medias.map((media, index) =>
      <Media
        key={index}
        index={index} // important for the raycaster
        column={index % 6}
        element={media}
        galleryElement={gallery}
        geometry={planeGeometry}
        visible={visible}
        scroll={scroll.current}
        speed = {speed.current}
        isDown={isDown}
        focus ={focusedTile}
        text={texts[index]}
        texture={textures[index]}        
      />
    )}
  </>
  
}
