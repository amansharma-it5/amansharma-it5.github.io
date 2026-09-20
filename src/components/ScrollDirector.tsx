import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollDirector() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((element) => {
        gsap.fromTo(element, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
      });
      const hero = document.querySelector('.hero');
      if (hero) {
        gsap.to('.hero-copy', { yPercent: 14, opacity: 0.72, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero-scene', { yPercent: -8, scale: 1.04, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      }
      gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach((element) => {
        const enter = (event: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(element, { rotateY: x * 4, rotateX: y * -4, duration: 0.35, ease: 'power2.out', transformPerspective: 900 });
        };
        const leave = () => gsap.to(element, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' });
        element.addEventListener('mousemove', enter);
        element.addEventListener('mouseleave', leave);
        return () => { element.removeEventListener('mousemove', enter); element.removeEventListener('mouseleave', leave); };
      });
    });
    return () => context.revert();
  }, []);
  return null;
}
