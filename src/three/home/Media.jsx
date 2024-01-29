import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap'
import fragment from '../../shaders/fragment.glsl'
import vertex from '../../shaders/vertex.glsl'
import { offset } from '../../utils/math';

export default function Media({
  column,
  element,
  index,
  galleryElement,
  geometry,
  focus,
  scroll,
  texture,
  visible,

}) {

  const mesh = useRef()
  const bounds = useRef()
  const focusBounds = useRef()
  const galleryHeight = useRef(0)
  const galleryWidth = useRef(0)
  const extra  = useRef({
    x:0, 
    y:0
  })
  const opacity = useRef({
    current: 1,
    target: 1,
    ease: 0.1,
    multiplier: 1,
  });

  const progress = useRef({
    current: 1,
    target: 1,
    ease: 0.1,
    multiplier: 1,
  });

  // i know this is too much
  const animation = useRef({
    current: 0,
    target: 1,
    ease: 0.1,
    multiplier: 1,
  });




  const epsilon = useRef(.01)


  const stagger = offset(column)

  const { size, viewport } = useThree();


  const shaderArgs = useMemo(()=>{
    return {
      uniforms: {
        tMap: { value: texture},
        uViewportSizes: { value: [viewport.x, viewport.y]},
        uStrength: { value: 0 },
        uAlpha: { value: 1 },
        uScale: { value: 1}
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    }
  },[texture])

  useEffect(()=> {
    const rect = element.getBoundingClientRect()
    const focusRect = focus.getBoundingClientRect()
    galleryHeight.current = (galleryElement.clientHeight / size.height) * viewport.height;
    galleryWidth.current = (galleryElement.clientWidth / size.width) * viewport.width;

    bounds.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    }

    focusBounds.current = {
      left: focusRect.left,
      top: focusRect.top,
      width: focusRect.width,
      height: focusRect.height,
    }


    updateScale()
    extra.current.x = 0
    extra.current.y = 0


    updateY()
    updateX()

    mesh.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };

    mesh.current.index = index; // important for raycaster
    mesh.current.renderOrder = 0


  }, [viewport, size])

  useEffect(()=>{
    

    opacity.current.target = visible.index == null ? 1 : visible.index === index ? 1 : 0;
    progress.current.target = visible.index == null ? 1 : visible.index === index ? 0 : 1;
    animation.current.target  = visible.index == null ? 0 : visible.index === index ? 1 : 0;


    if(visible.index === index){
      mesh.current.renderOrder = 1
    }

      
  },[visible])


  function updateScale(){
    const width =
    gsap.utils.interpolate(
      bounds.current.width,
      focusBounds.current.width,
      animation.current.current
      ) / size.width;

  const height =
    gsap.utils.interpolate(
      bounds.current.height,
      focusBounds.current.height,
      animation.current.current
      ) / size.height;

    mesh.current.scale.x = viewport.width * width
    mesh.current.scale.y = viewport.height * height
  }

  function updateX(x = 0){
    mesh.current.position.x = ((-viewport.width / 2 + (mesh.current.scale.x / 2) + ((bounds.current.left + x) / size.width) * viewport.width + extra.current.x)) * progress.current.current
  }

  function updateY(y = 0, stagger = 0){
    mesh.current.position.y = ((viewport.height / 2 - (mesh.current.scale.y / 2) - ((bounds.current.top - y  * stagger) / size.height) * viewport.height + extra.current.y)) * (progress.current.current)
  }



  useFrame(()=>{
    if (bounds.current == null) return


      // if it is not 1 and it is trying to go back to 1
    if(progress.current.current < 1 && progress.current.current > 1 - epsilon.current){
      mesh.current.renderOrder = 0
      progress.current.current +=  0.0001; 
      progress.current.current = Math.min(progress.current.current, 1)
    }

    // mesh.current.material.uniforms.uStrength.value = 0
    
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

    updateScale()
    
    opacity.current.current = gsap.utils.interpolate(
      opacity.current.current,
      opacity.current.target,
      opacity.current.ease
    )

    progress.current.current = gsap.utils.interpolate(
      progress.current.current,
      progress.current.target,
      progress.current.ease
    );


    animation.current.current = gsap.utils.interpolate(
      animation.current.current,
      animation.current.target,
      animation.current.ease
    );


    mesh.current.material.uniforms.uAlpha.value = opacity.current.multiplier * opacity.current.current;

    updateY(scroll.y.current * 1.5, stagger)
    updateX(scroll.x.current * 1.5)

  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
