"use client";
import { React, useEffect, useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import fragment from "../../shaders/fragment.glsl";
import vertex from "../../shaders/vertex.glsl";
import { offset, findX, findY } from "../../utils/math.js";

export default function Media({
  element,
  text,
  focusElement,
  galleryElement,
  geometry,
  texture,
  scroll,
  column,
  index,
  focus,
}) {
  const mesh = useRef();
  const bounds = useRef();
  const textBounds = useRef();
  const focusBounds = useRef();
  const galleryHeight = useRef(0);
  const galleryWidth = useRef(0);

  const extra = useRef({
    x: 0,
    y: 0,
  });

  const animation = useRef({
    current: 1,
    target: 0,
    ease: 0.1,
    initial: 0,
    position: 0.5,
    size: 0,
  });

  const opacity = useRef({
    current: 1,
    target: 1,
    ease: 0.1,
    multiplier: 1,
  });

  const stagger = offset(column);

  const { size, viewport } = useThree();

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        tMap: { value: texture },
        uViewportSizes: { value: [viewport.x, viewport.y] },
        uStrength: { value: 0 },
        uAlpha: { value: 1 },
        uScale: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    };
  }, [texture, viewport.x, viewport.y]);

  useEffect(() => {
    const rect = element.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();

    const focusRect = focusElement.getBoundingClientRect();
    galleryHeight.current =
      (galleryElement.clientHeight / size.height) * viewport.height;
    galleryWidth.current =
      (galleryElement.clientWidth / size.width) * viewport.width;
    bounds.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    textBounds.current = {
      left: textRect.left,
      top: textRect.top,
      width: textRect.width,
      hieght: textRect.hieght,
    };

    focusBounds.current = {
      left: focusRect.left,
      top: focusRect.top,
      width: focusRect.width,
      height: focusRect.height,
    };

    updateScale();
    extra.current.x = 0;
    extra.current.y = 0;

    updateY();
    updateX();

    mesh.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };

    mesh.current.index = index;
  }, [viewport, size]);

  useEffect(() => {
    if (focus.state === false) reset();

    if (focus.index === index) show();

    if (focus.index !== index && focus.index != null) hide();
  }, [focus]);

  function show() {
    const tl = gsap.timeline();

    gsap.to(animation.current, { initial: 1 });
    gsap.to(mesh.current, { renderOrder: 1 });
    tl.to(animation.current, {
      size: 1,
      position: 1,
      duration: 0.35,
      ease: "power3",
    })
    .fromTo(
      text,
      {
        alpha: 0,
        y: "3rem",
      },
      {
        alpha: 1,
        y: 0,
      },
      0.2
    );
  }

  function hide() {
    gsap.to(animation.current, { initial: 1 });
    gsap.to(opacity.current, { current: 0, duration: 0.35, ease: "power3" });
    gsap.to(animation.current, { position: 0, duration: 0.35, ease: "power3" });
  }

  function reset() {
    if (animation.current.position === 1) gsap.to(text, { alpha: 0, y: 0 });

    gsap.to(opacity.current, { current: 1, duration: 0.35, ease: "power3" });
    gsap.to(animation.current, {
      position: 0.5,
      size: 0,
      duration: 0.35,
      ease: "power3",
    });
    gsap.to(mesh.current, { renderOrder: 0 });
    gsap.to(animation.current, { initial: 0 });
  }

  function updateScale() {
    const width =
      gsap.utils.interpolate(
        bounds.current.width,
        focusBounds.current.width,
        animation.current.size
      ) / size.width;

    const height =
      gsap.utils.interpolate(
        bounds.current.height,
        focusBounds.current.height,
        animation.current.size
      ) / size.height;

    mesh.current.scale.x = viewport.width * width;
    mesh.current.scale.y = viewport.height * height;
  }

  function updateX(x = 0) {
    const positionX = gsap.utils.interpolate(
      [
        1.2 *
          findX(
            viewport.width,
            mesh.current.scale.x,
            bounds.current.left,
            size.width,
            extra.current.x,
            x
          ),
        findX(
          viewport.width,
          mesh.current.scale.x,
          bounds.current.left,
          size.width,
          extra.current.x,
          x
        ),
        0,
      ],
      animation.current.position
    );

    mesh.current.position.x = positionX;
    return positionX;
  }

  function updateY(y = 0, stagger = 0) {
    const positionY = gsap.utils.interpolate(
      [
        1.2 *
          findY(
            viewport.height,
            mesh.current.scale.y,
            bounds.current.top,
            size.height,
            extra.current.y,
            stagger,
            y
          ),
        findY(
          viewport.height,
          mesh.current.scale.y,
          bounds.current.top,
          size.height,
          extra.current.y,
          stagger,
          y
        ), // initial
        viewport.height / 2 -
          mesh.current.scale.y / 2 -
          (focusBounds.current.top / size.height) * viewport.height, // center
      ],
      animation.current.position
    );
    mesh.current.position.y = positionY;
    return positionY;
  }

  useFrame(() => {
    if (bounds.current == null) return;

    const viewportOffset = {
      x: viewport.width / 2,
      y: viewport.height / 2,
    };
    const planeOffset = {
      x: mesh.current.scale.x / 2,
      y: mesh.current.scale.y / 2,
    };

    updateY(scroll.y.current * 1.5, stagger);
    updateX(scroll.x.current * 1.5);

    if (animation.current.initial === 0) {
      if (
        scroll.y.direction === "top" &&
        mesh.current.position.y - planeOffset.y > viewportOffset.y
      ) {
        extra.current.y -= galleryHeight.current;
      } else if (
        scroll.y.direction === "bottom" &&
        mesh.current.position.y + planeOffset.y < -viewportOffset.y
      ) {
        extra.current.y += galleryHeight.current;
      }

      if (
        scroll.x.direction === "right" &&
        mesh.current.position.x + planeOffset.x < -viewportOffset.x
      ) {
        extra.current.x += galleryWidth.current;
      } else if (
        scroll.x.direction === "left" &&
        mesh.current.position.x - planeOffset.x > viewportOffset.x
      ) {
        extra.current.x -= galleryWidth.current;
      }
    }

    updateScale();

    mesh.current.material.uniforms.uAlpha.value =
      opacity.current.multiplier * opacity.current.current;
  });

  return (
    <>
      <mesh ref={mesh} geometry={geometry}>
        <rawShaderMaterial args={[shaderArgs]} />
      </mesh>
    </>
  );
}
