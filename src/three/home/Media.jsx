import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import fragment from '../../shaders/fragment.glsl'
import vertex from '../../shaders/vertex.glsl'

export default function Media({
  hm,
  element,
  galleryElement,
  geometry,
  scroll,
  speed,
  isDown

}) {

  const mesh = useRef();
  const bounds = useRef();
  const galleryHeight = useRef(0)
  const extra  = useRef(0)

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(element.getAttribute("data-src"));
  const { size, viewport } = useThree();


  hm =  hm % 6
  let stagger 
  0 === hm ? stagger = .1 : 1 === hm ? stagger = .15 : 2 === hm ? stagger = .2 : 3 === hm ? stagger = .25 : 4 === hm ? stagger  = .3 : 5 === hm ? stagger = .35 : null

  const shaderArgs = useMemo(()=>{
    return {
      uniforms: {
        tMap: { value: texture},
        uViewportSizes: { value: [viewport.x, viewport.y]},
        uStrength: { value: 0 }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    }
  },[texture])

  useEffect(()=> {
    const rect = element.getBoundingClientRect()
    galleryHeight.current = (galleryElement.clientHeight / size.height) * viewport.height;

    bounds.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }


    updateScale()
    extra.current = 0


    updateY()
    updateX()

    mesh.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };

  }, [viewport, size])

  function updateScale(){
    mesh.current.scale.x = viewport.width * bounds.current.width / size.width
    mesh.current.scale.y = viewport.height * bounds.current.height / size.height
  }

  function updateX(){
    mesh.current.position.x = -viewport.width / 2 + (mesh.current.scale.x / 2) + (bounds.current.left / size.width) * viewport.width
  }

  function updateY(y = 0, stagger = 1){
    mesh.current.position.y = (viewport.height / 2 - (mesh.current.scale.y / 2) - ((bounds.current.top - (y * stagger)) / size.height) * viewport.height + extra.current) 
  }

  useFrame(()=>{
    if (bounds.current == null) return

    mesh.current.material.uniforms.uStrength.value = 0
    
    const viewportOffset = viewport.height / 2;
    const planeOffset = mesh.current.scale.y / 2;
    if (
      scroll.deltaY === 'top' &&
      mesh.current.position.y - planeOffset > viewportOffset
    ) {
      extra.current -= galleryHeight.current;


    } else if (
      scroll.deltaY === 'bottom' &&
      mesh.current.position.y + planeOffset < -viewportOffset
    ) {
      extra.current += galleryHeight.current;
    }
    // if(isDown.current)
      updateY(scroll.current)

  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
