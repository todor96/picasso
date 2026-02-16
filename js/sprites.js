// ─── Sprite Loading System ───
const sprites = {};
const alphaMasks = {};  // pre-computed alpha masks for pixel-perfect collision
let assetsLoaded = 0;

// Build a boolean alpha mask at a given render size
function buildAlphaMask(img, w, h) {
  const offscreen = document.createElement('canvas');
  offscreen.width = w;
  offscreen.height = h;
  const offCtx = offscreen.getContext('2d');
  offCtx.drawImage(img, 0, 0, w, h);
  const data = offCtx.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    mask[i] = data[i * 4 + 3] > 20 ? 1 : 0;  // alpha threshold of 20
  }
  return { mask, w, h };
}

function loadAssets(callback) {
  SPRITE_NAMES.forEach(name => {
    const img = new Image();
    img.src = 'sprites/' + name + '.png';
    img.onload = () => {
      // Build masks at the sizes used in-game
      const mw = (name === 'picasso') ? PLAYER_WIDTH : ITEM_SIZE;
      const mh = (name === 'picasso') ? PLAYER_HEIGHT : ITEM_SIZE;
      alphaMasks[name] = buildAlphaMask(img, mw, mh);
      assetsLoaded++;
      if (assetsLoaded === SPRITE_NAMES.length) callback();
    };
    img.onerror = () => {
      console.error('Failed to load: ' + name + '.png');
      assetsLoaded++;
      if (assetsLoaded === SPRITE_NAMES.length) callback();
    };
    sprites[name] = img;
  });
}
