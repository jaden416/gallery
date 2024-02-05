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
  const  prevIndex = useRef()
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

  const animation = useRef({
    current: 1,
    target: 1,
    ease: 0.1,
    intial: true,
  });


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
  }, [viewport, size])

  useEffect(()=>{

    if(visible.index != null)
      prevIndex.current = visible.index
    
    console.log(prevIndex.current)

    if(visible.index == index)
      animateIn()

    if(!visible.state & visible.index != index)
      hide()

    if(visible.state)
      show()
    
    if(visible.state & index == prevIndex.current)
      animateOut()





    
  },[visible])




  function updateScale(){
    const width =
    gsap.utils.interpolate(
      focusBounds.current.width,
      bounds.current.width,
      animation.current.current
      ) / size.width;

  const height =
    gsap.utils.interpolate(
      focusBounds.current.height,
      bounds.current.height,
      animation.current.current
      ) / size.height;

    mesh.current.scale.x = viewport.width * width
    mesh.current.scale.y = viewport.height * height
  }

  function updateX(x = 0){
    mesh.current.position.x = (((-viewport.width / 2 + (mesh.current.scale.x / 2) + ((bounds.current.left + x) / size.width) * viewport.width + extra.current.x))) * animation.current.current
  }

  function updateY(y = 0, stagger = 0){
    mesh.current.position.y = (((viewport.height / 2 - (mesh.current.scale.y / 2) - ((bounds.current.top - y  * stagger) / size.height) * viewport.height + extra.current.y)) ) * animation.current.current
  }

  function animateIn(){
    // mesh.current.renderOrder = 10
    console.log(index + " we in here")
    gsap.to(mesh.current,{renderOrder: 19}).restart()
    gsap.to(animation.current, { current: 0, duration: .35, ease: "power3"}).restart();
    ;
  }

  function hide(){
    gsap.to(opacity.current, { current: 0, duration: .35, ease: "power3"});
  }

  function animateOut(){
    gsap.to(animation.current, { current: 1, duration: .35, ease: "power3"}).restart();

    gsap.to(
      mesh.current, {
        duration: .35,
        frustumCulled: true,
        renderOrder: 0,
      }
    ).restart();

  }

  function show(){
    gsap.to(opacity.current, { current: 1, duration: .35, ease: "power3"});
  }
  



  useFrame(()=>{
    if (bounds.current == null) return

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
    
    // opacity.current.current = gsap.utils.interpolate(
    //   opacity.current.current,
    //   opacity.current.target,
    //   opacity.current.ease
    // )

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
