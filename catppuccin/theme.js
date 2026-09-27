/**
 * The one thing this theme's CSS cannot do for itself: Latte is light and the
 * other three flavours are dark, so the seven flavour-branded images in
 * `style.css` need to know which flavour is on. A palette cannot re-point a
 * `url()`, but it can carry both pairs, and choosing between them is a class.
 *
 * `mount` is not called again when the palette changes, so watch the head the
 * renderer rewrites its `:root` palette into.
 */
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const apply = () => {
  // Lights off unless the palette is a background we can read as light, so a
  // colour typed by hand that is not a hex keeps the dark art rather than
  // flashing Latte's onto a dark page.
  const base = getComputedStyle(document.documentElement)
    .getPropertyValue('--pear-theme-base')
    .trim();
  const light = /^#[0-9a-f]{6}$/i.test(base) && luminance(base) > 0.5;

  document.documentElement.dataset.catppuccin = light ? 'light' : 'dark';
};

module.exports = {
  mount() {
    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true });

    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.catppuccin;
    };
  },
};
