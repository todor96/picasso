// ─── Utility Functions ───

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Haptic feedback support
function vibrate(duration = 10) {
  if (navigator.vibrate && isMobile) {
    navigator.vibrate(duration);
  }
}

// Pixel-perfect collision detection
function pixelPerfectCollision(rect1, mask1, rect2, mask2) {
  const x1 = Math.floor(rect1.x);
  const y1 = Math.floor(rect1.y);
  const x2 = Math.floor(rect2.x);
  const y2 = Math.floor(rect2.y);

  const left = Math.max(x1, x2);
  const right = Math.min(x1 + mask1.w, x2 + mask2.w);
  const top = Math.max(y1, y2);
  const bottom = Math.min(y1 + mask1.h, y2 + mask2.h);

  if (right < left || bottom < top) return false;

  for (let x = left; x < right; x++) {
    for (let y = top; y < bottom; y++) {
      const i1 = (x - x1) + (y - y1) * mask1.w;
      const i2 = (x - x2) + (y - y2) * mask2.w;
      if (mask1.mask[i1] && mask2.mask[i2]) {
        return true;
      }
    }
  }
  return false;
}
