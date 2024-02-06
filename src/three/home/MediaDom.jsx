// we probably do not need this
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// import { DEFAULT as ease } from '../../utils/easing';
import { calculate, split } from '../../utils/text';

export default function MediaDom({ element, index }) {
  const bounds = useRef(null);

  const title = useRef(null);
  const titleSpans = useRef([]);

  useEffect(() => {
    title.current = element
    createTitle();

  }, []);

  const createTitle = () => {
    titleSpans.current = split({
      append: true,
      element: title.current,
      expression: '<br>',
    });

    titleSpans.current.forEach((el) => {
      split({ append: false, element: el, expression: '' });
    });
  };

 

  const animateIn = () => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.call(() => element.classList.add('detail--active'));


    titleSpans.current.forEach((line, index) => {
      const letters = line.querySelectorAll('span');

      const onStart = () => {
        gsap.fromTo(
          letters,
          { autoAlpha: 0, y: '100%', display: 'inline-block' },
          {
            autoAlpha: 1,
            y: '0%',
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            delay: 0.2,
            stagger: 0.015,
          }
        );
      };

      tl.fromTo(
        line,
        { autoAlpha: 0, y: '100%' },
        {
          autoAlpha: 1,
          y: '0%',
          duration: 1.5,
          ease: 'expo.inOut',
          delay: 0.2 * index,
          onStart,
        },
        0
      );
    });
  };

  const animateOut = () => {
    element.classList.remove('detail--active');
  };

  const onResize = () => {
    bounds.current = media.current.getBoundingClientRect();
  };

  return {
    animateIn,
    animateOut,
    onResize,
    bounds: bounds,
  };
}