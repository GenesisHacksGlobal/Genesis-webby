/**
 * Apply a quality-tier light rig: hide expensive lights on low/medium.
 * Lights stay in the scene graph so swaps are cheap (visible + intensity).
 */

export function applyLightRig(lights, rig) {
  if (!lights || !rig) return;

  Object.entries(lights).forEach(([key, light]) => {
    if (!light) return;
    const spec = rig[key];
    if (!spec || spec.enabled === false) {
      light.visible = false;
      return;
    }
    light.visible = true;
    if (spec.intensity !== undefined) light.intensity = spec.intensity;
    if (spec.color !== undefined) light.color.setHex(spec.color);
    if (Array.isArray(spec.position) && light.position) {
      light.position.set(spec.position[0], spec.position[1], spec.position[2]);
    }
  });
}
