/**
 * Side-effect CSS loaders for plugins (imported only where needed).
 */
export function loadAnimateCss() {
  return import("../public/css/animate.min.css");
}

export function loadTextAnimationCss() {
  return import("../public/css/textanimation.css");
}

export function loadOdometerCss() {
  return import("../public/css/odometer-theme-default.css");
}
