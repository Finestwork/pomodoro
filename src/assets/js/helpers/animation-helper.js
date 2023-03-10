import Bounce from 'bounce.js';

export default class AnimationHelper {
  static bounce(element) {
    const bounce = new Bounce();
    bounce
      .scale({
        from: { x: 0.5, y: 0.5 },
        to: { x: 1, y: 1 },
        duration: 1000,
        bounces: 10,
        stiffness: 2
      })
      .applyTo(element, {
        remove: true
      });
  }
}
