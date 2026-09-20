/// <reference types="astro/client" />

declare module '*.glb' {
  const src: string;
  export default src;
}
