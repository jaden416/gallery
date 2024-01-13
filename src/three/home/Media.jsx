import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import fragment from '../../shaders/fragment.glsl'
import vertex from '../../shaders/vertex.glsl'
import { offset } from '../../utils/math';

export default function Media({
  column,
  element,
  galleryElement,
  geometry,
  scroll,
  texture

}) {

  const mesh = useRef();
  const bounds = useRef();
  const galleryHeight = useRef(0)
  const galleryWidth = useRef(0)
  const extra  = useRef({
    x:0, 
    y:0
  })

  const stagger = offset(column)

  const { size, viewport } = useThree();


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
    galleryWidth.current = (galleryElement.clientWidth / size.width) * viewport.width;

    bounds.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }


    updateScale()
    extra.current.y = 0
    extra.current.x = 0


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

  function updateX(x = 0){
    mesh.current.position.x = -viewport.width / 2 + (mesh.current.scale.x / 2) + ((bounds.current.left + x) / size.width) * viewport.width + extra.current.x
  }

  function updateY(y = 0, stagger = 0){
    mesh.current.position.y = viewport.height / 2 - (mesh.current.scale.y / 2) - ((bounds.current.top - y  * stagger) / size.height) * viewport.height + extra.current.y 
  }

  useFrame(()=>{
    if (bounds.current == null) return

    mesh.current.material.uniforms.uStrength.value = 0
    
    const viewportOffset = { 
      x : viewport.width / 2,
      y : viewport.height / 2
    }
    const planeOffset = {
      x: mesh.current.scale.x / 2,
      y: mesh.current.scale.y / 2
    }

    if (
      scroll.y.direction === 'top' &&
      mesh.current.position.y - planeOffset.y > viewportOffset.y
    ) {
      extra.current.y -= galleryHeight.current;
      console.log('top')

    } else if (
      scroll.y.direction === 'bottom' &&
      mesh.current.position.y + planeOffset.y < -viewportOffset.y
    ) {
      extra.current.y += galleryHeight.current;
    }

    if (
      scroll.x.direction === 'right' &&
      mesh.current.position.x + planeOffset.x < -viewportOffset.x
    ) {
      extra.current.x += galleryWidth.current;
    } else if (
      scroll.x.direction === 'left' &&
      mesh.current.position.x - planeOffset.x > viewportOffset.x
    ) {
      extra.current.x -= galleryWidth.current;
    }

    updateY(scroll.y.current*1.5, stagger)
    updateX(scroll.x.current*1.5)
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
