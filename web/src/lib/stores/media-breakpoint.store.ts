import { readable } from 'svelte/store';

export enum MediaBreakpoint {
  XXL = 1536,
  XL = 1280,
  LG = 1024,
  MD = 768,
  SM = 640,
  XS = 0,
}

const mediaBreakpoints: MediaBreakpoint[] = [
  MediaBreakpoint.XXL,
  MediaBreakpoint.XL,
  MediaBreakpoint.LG,
  MediaBreakpoint.MD,
  MediaBreakpoint.SM,
  MediaBreakpoint.XS,
];

const getCurrentBreakpointIndex = () => {
  const currentBreakpointIndex = mediaBreakpoints.findIndex((breakpoint) => {
    return window?.matchMedia(`(min-width: ${breakpoint}px)`).matches;
  });
  return currentBreakpointIndex >= 0 ? currentBreakpointIndex : mediaBreakpoints.length - 1;
};

let currentIndex = getCurrentBreakpointIndex();

export const currentMediaBreakpoint = readable(mediaBreakpoints[currentIndex], (set) => {
  const updateBreakpoint = () => {
    const newIndex = getCurrentBreakpointIndex();
    if (newIndex === currentIndex) {
      return;
    }
    // If the screen width has decreased, we will enter this while-loop
    while (newIndex > currentIndex) {
      set(mediaBreakpoints[++currentIndex]);
    }
    // If the screen width has increased, we will enter this while-loop
    while (newIndex < currentIndex) {
      set(mediaBreakpoints[--currentIndex]);
    }
  };

  window.addEventListener('resize', updateBreakpoint);

  return () => {
    window.removeEventListener('resize', updateBreakpoint);
  };
});
