/**
 * Landing-page animation.
 *
 * The poster always fills the viewport, like a normal fixed element. Mobile
 * browsers change the viewport height a little when their toolbars collapse,
 * so the expensive typesetting only re-runs for real changes (width, or a
 * large height change such as rotation); the photo stage keeps its typeset
 * height and the facts panel absorbs small differences in the dark fade
 * below the photo (see --stage-h in index.astro).
 *
 * A full-screen WebGL fragment shader draws six "metaballs": one large circle
 * holding the poster (rendered as HTML and clipped to the circle) and five
 * smaller ones, each textured with a photo, lined up below it. Scrolling the
 * page zooms out from the poster and then flows down the column; the section
 * headings and blurbs are positioned next to each circle every frame.
 */

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uK;          // how strongly neighbouring circles merge
uniform vec3 uBalls[6];    // xy = centre, z = radius (units of the shorter screen side)
uniform vec3 uBg;
uniform sampler2D uTex0; uniform sampler2D uTex1; uniform sampler2D uTex2;
uniform sampler2D uTex3; uniform sampler2D uTex4; uniform sampler2D uTex5;
uniform float uDim0;       // brightness of the poster circle
uniform vec2 uCen0;        // rectangle the poster texture is mapped onto
uniform vec2 uExt0;
uniform float uAsp[6];     // texture aspect ratios

float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float hash3(vec3 p){
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}
// Sample a texture "cover"-fitted to the square around a circle.
vec3 ballImage(sampler2D t, vec2 c, vec2 ext, float a, vec2 p){
  vec2 st = (p - c) / (2.0 * ext) + 0.5;
  float ra = ext.x / ext.y;
  if (a > ra) st.x = (st.x - 0.5) * (ra / a) + 0.5;
  else st.y = (st.y - 0.5) * (a / ra) + 0.5;
  return texture2D(t, st).rgb;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float d = 1000.0, dmin = 1000.0;
  float di[6];
  for (int i = 0; i < 6; i++) {
    di[i] = length(uv - uBalls[i].xy) - uBalls[i].z;
    d = smin(d, di[i], uK);
    dmin = min(dmin, di[i]);
  }
  // Nearest circle owns the pixel; weights blend where circles merge.
  float w[6]; float wsum = 0.0;
  for (int i = 0; i < 6; i++) { w[i] = exp(-(di[i] - dmin) / 0.025); wsum += w[i]; }
  float px = 1.0 / min(uRes.x, uRes.y);
  float inside = smoothstep(px * 1.2, -px * 1.2, d);
  vec3 img = ballImage(uTex0, uCen0, uExt0, uAsp[0], uv) * uDim0 * w[0]
           + ballImage(uTex1, uBalls[1].xy, vec2(uBalls[1].z), uAsp[1], uv) * w[1]
           + ballImage(uTex2, uBalls[2].xy, vec2(uBalls[2].z), uAsp[2], uv) * w[2]
           + ballImage(uTex3, uBalls[3].xy, vec2(uBalls[3].z), uAsp[3], uv) * w[3]
           + ballImage(uTex4, uBalls[4].xy, vec2(uBalls[4].z), uAsp[4], uv) * w[4]
           + ballImage(uTex5, uBalls[5].xy, vec2(uBalls[5].z), uAsp[5], uv) * w[5];
  img /= wsum;
  vec2 sv = gl_FragCoord.xy / uRes;
  vec3 bgc = uBg + 0.045 * smoothstep(1.3, 0.0, length(sv - vec2(0.85, 1.0)));
  vec3 outc = mix(bgc, img, inside);
  outc += (hash3(vec3(gl_FragCoord.xy, 7.0)) - 0.5) * 0.09;   // static grain
  gl_FragColor = vec4(outc, 1.0);
}`;

const RADII = [0.43, 0.2, 0.2, 0.2, 0.2, 0.2];
const ORBIT_R = 0.71;   // distance from the poster circle to the first small circle
const ROW_GAP = 0.64;   // spacing between small circles
const STICKY = 0.10;    // metaball merge strength
const TRACK_VH = 409.4; // scroll length (in vh) that drives the timeline
const ZOOM_END = 58.65; // zoom-out finishes here
const ALIGN = 60;       // column starts flowing upward here
const ALIGN_LEN = 112.3;
const FLOW_LEN = 237.1;

const smooth = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
/** Write a style property only when the value actually changes (avoids needless style/layout work). */
const setStyle = (el: HTMLElement, prop: string, value: string) => { if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value); };
const bgOf = () => {
  const m = /^#([0-9a-f]{6})$/i.exec(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
  if (!m) return [0.08, 0.08, 0.08];
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function startHero(canvas: HTMLCanvasElement, photos: string[]) {
  const errorEl = document.getElementById('error')!;
  const gl = canvas.getContext('webgl', { antialias: false });
  if (!gl) { errorEl.style.display = 'grid'; return; }

  // ---- program -----------------------------------------------------------
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const prog = gl.createProgram()!;
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
  } catch { errorEl.style.display = 'grid'; return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {
    res: gl.getUniformLocation(prog, 'uRes'), k: gl.getUniformLocation(prog, 'uK'),
    balls: gl.getUniformLocation(prog, 'uBalls'), bg: gl.getUniformLocation(prog, 'uBg'),
    asp: gl.getUniformLocation(prog, 'uAsp'), ext0: gl.getUniformLocation(prog, 'uExt0'),
    cen0: gl.getUniformLocation(prog, 'uCen0'), dim0: gl.getUniformLocation(prog, 'uDim0'),
  };

  // ---- textures: 0 = poster backdrop (plain dark), 1–5 = photos ------------
  const aspects = new Float32Array([1, 1, 1, 1, 1, 1]);
  const texs = Array.from({ length: 6 }, (_, i) => {
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex' + i), i);
    return gl.createTexture()!;
  });
  const setTexture = (idx: number, src: TexImageSource & { width: number; height: number }) => {
    gl.activeTexture(gl.TEXTURE0 + idx);
    gl.bindTexture(gl.TEXTURE_2D, texs[idx]!);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    aspects[idx] = src.width / src.height;
  };
  const dark = document.createElement('canvas');
  dark.width = dark.height = 4;
  const dctx = dark.getContext('2d')!;
  dctx.fillStyle = '#0c0b0b';
  dctx.fillRect(0, 0, 4, 4);
  for (let i = 0; i < 6; i++) setTexture(i, dark);
  photos.forEach((src, j) => {
    const im = new Image();
    im.onload = () => setTexture(j + 1, im);
    im.src = src;
  });

  // ---- DOM pieces positioned every frame ---------------------------------
  const poster = document.getElementById('poster')!;
  const pIn = document.getElementById('pIn')!;
  const pTitle = document.getElementById('pTitle')!;
  const pFacts = pIn.querySelector<HTMLElement>('.p-facts')!;
  const pDim = document.getElementById('pDim')!;
  const heroLabel = document.getElementById('heroLabel')!;
  const heroH2 = heroLabel.querySelector('h2')!;
  const trackEl = document.querySelector<HTMLElement>('.track')!;
  const secs = Array.from(document.querySelectorAll<HTMLElement>('#sections .sec'));
  const titles = secs.map((s) => s.querySelector<HTMLElement>('.title')!);
  const notes = secs.map((s) => s.querySelector<HTMLElement>('.note')!);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bg = bgOf();   // read once: getComputedStyle every frame forces a style recalc
  const data = new Float32Array(18);
  let current = 0;

  // Stage = current viewport in CSS px.
  const stage = { W: 0, H: 0 };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    stage.W = canvas.clientWidth;
    stage.H = canvas.clientHeight;
    const ph = stage.H + 'px';
    if (poster.style.height !== ph) poster.style.height = ph;
  };

  // Poster typesetting: pick a base font size that fits the viewport. Re-run
  // only for real changes; toolbar-sized height changes keep the typeset.
  const typeset = { W: 0, H: 0 };
  let lastW = 0, lastH = 0;
  const layoutPoster = () => {
    const W = stage.W, H = stage.H;
    if (W === lastW && Math.abs(H - lastH) < lastH * 0.2) return;
    lastW = W; lastH = H; typeset.W = W; typeset.H = H;
    poster.style.width = W + 'px';
    poster.style.height = H + 'px';
    pIn.style.setProperty('--stage-h', H + 'px');
    const wide = W > H * 1.05 && W >= 640;
    poster.classList.toggle('wide', wide);
    let b = Math.max(11, Math.min(wide ? Math.min(W / 62, H / 34) : Math.min(W / 22.5, H / 44), wide ? 19 : 24));
    pIn.style.setProperty('--ps', '1');
    for (let tries = 0; tries < 24; tries++) {
      pIn.style.setProperty('--b', b + 'px');
      pIn.style.setProperty('--t', '5em');
      const avail = (pTitle.parentNode as HTMLElement).clientWidth * (wide ? 0.62 : 1);
      pIn.style.setProperty('--t', (5 * avail / Math.max(1, pTitle.scrollWidth)).toFixed(3) + 'em');
      if (pIn.scrollHeight <= H + 1 || b <= 9) break;
      b *= 0.94;
    }
    // Shrink the facts until their content fits the panel. Measured from the
    // children's extents (not scrollHeight), which works whichever way the
    // panel is justified.
    const factsOverflow = () => {
      const cs = getComputedStyle(pFacts);
      const avail = pFacts.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      let top = Infinity, bottom = -Infinity;
      for (const el of Array.from(pFacts.children)) {
        const r = el.getBoundingClientRect();
        top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
      }
      return bottom - top - avail;
    };
    let ps = 1;
    while (ps > 0.76 && factsOverflow() > 0.5) { ps -= 0.03; pIn.style.setProperty('--ps', ps.toFixed(2)); }
  };
  document.fonts?.ready.then(() => { lastW = 0; });

  // Scale the poster to the visible part of the big circle and clip it.
  let hlKey = '', secFontPx = 26, hlNeed = 200, hlHeight = 60;
  const placePoster = (rect: number[], bx: number, by: number, br: number, unit: number, zoom: number, shiftT: number, finalShift: number, finalScale: number) => {
    const W = stage.W, H = stage.H;
    const rcx = W / 2 + rect[0]! * unit, rcy = H / 2 - rect[1]! * unit;
    const rw = 2 * rect[2]! * unit, rh = 2 * rect[3]! * unit;
    const s = Math.max(rw / W, rh / H);
    const ox = rcx - W * s / 2, oy = rcy - H * s / 2;
    const cx = (W / 2 + bx * unit - ox) / s, cy = (H / 2 - by * unit - oy) / s;
    const r = br * unit / s;
    setStyle(poster, 'transform', `translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px) scale(${s.toFixed(4)})`);
    setStyle(poster, 'clip-path', `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`);
    setStyle(poster, 'visibility', (by - br) * unit > H / 2 ? 'hidden' : 'visible');

    // Heading next to the big circle: fades in once the column has shifted left.
    const pcx = W / 2 + bx * unit, pcy = H / 2 - by * unit;
    const hs = clamp01((shiftT - 0.7) / 0.3);
    const hlShow = (zoom < 1.01 ? 1 : 0) * smooth(hs);
    setStyle(heroLabel, 'opacity', hlShow.toFixed(2));
    setStyle(heroLabel, 'pointer-events', hlShow > 0.6 ? 'auto' : 'none');
    const key = `${W}x${H}@${secFontPx.toFixed(1)}`;
    if (hlKey !== key) {
      hlKey = key;
      heroH2.style.fontSize = secFontPx.toFixed(1) + 'px';
      heroLabel.style.width = 'auto';
      hlNeed = heroH2.scrollWidth + 2;
      heroLabel.style.width = hlNeed.toFixed(0) + 'px';
      hlHeight = heroLabel.offsetHeight;
    }
    const finalCx = W / 2 - finalShift * finalScale * unit, finalR = RADII[0]! * finalScale * unit;
    let off = Math.min(finalR * 0.3, (W - 16 - hlNeed) - finalCx);
    off = Math.max(off, finalR * 0.05);
    setStyle(heroLabel, 'transform', `translate(${(pcx + off).toFixed(1)}px,${(pcy - hlHeight / 2).toFixed(1)}px)`);

    // Dim the poster slightly as we zoom out so it matches the photo circles.
    // A black overlay's opacity is compositor-only; filter/background changes
    // would repaint the whole poster every frame.
    const zp = 1 - Math.log(zoom) / Math.log(3.8);
    const bright = 1 - 0.1 * zp;
    setStyle(pDim, 'opacity', (1 - bright).toFixed(2));
    setStyle(poster, '--grain', (0.22 + 0.08 * zp).toFixed(2));
    setStyle(poster, '--gs', (Math.round(220 / s / 8) * 8) + 'px');   // quantised: a changed size repaints the grain
    gl.uniform1f(U.dim0, bright);
    const live = zoom > 3.3;                       // buttons only clickable when nearly full-screen
    if (poster.classList.contains('live') !== live) poster.classList.toggle('live', live);
  };

  const targetProgress = () => {
    const el = document.scrollingElement || document.documentElement;
    const max = trackEl.offsetHeight - (typeset.H || stage.H);   // typeset height keeps this stable while toolbars move
    return max > 0 ? clamp01(el.scrollTop / max) : 0;
  };

  // ?debug shows live numbers in the corner (used to diagnose device issues)
  const debugEl = /[?&]debug/.test(location.search) ? document.body.appendChild(document.createElement('pre')) : null;
  if (debugEl) debugEl.style.cssText = 'position:fixed;left:4px;top:70px;z-index:100;margin:0;padding:4px 6px;font:12px/1.3 ui-monospace,monospace;color:#0f0;background:rgba(0,0,0,.7);pointer-events:none;white-space:pre';
  let frames = 0, lastMs = 0, worstDt = 0;
  window.addEventListener('scroll', () => { if (debugEl) debugEl.dataset.scrollEv = String((Number(debugEl.dataset.scrollEv) || 0) + 1); }, { passive: true });

  const frame = (ms: number) => {
    resize();
    const t = reduceMotion ? 0 : ms / 1000;
    // Ease toward the scroll position with a fixed time constant, so the lag
    // is the same at 15 fps (phones mid-gesture) as at 60 fps.
    const dt = lastMs ? Math.min(ms - lastMs, 100) : 16.7; lastMs = ms; frames++;
    current += (targetProgress() - current) * (1 - Math.pow(0.92, dt / 16.7));
    if (debugEl) {
      if (dt > worstDt) worstDt = dt;
      const el = document.scrollingElement || document.documentElement;
      debugEl.textContent = `f ${frames}  dt ${dt.toFixed(0)}ms  worst ${worstDt.toFixed(0)}ms
scrollY ${window.scrollY.toFixed(0)}  scrollTop ${el.scrollTop.toFixed(0)}  scrollEv ${debugEl.dataset.scrollEv || 0}
inner ${window.innerWidth}x${window.innerHeight}  vv ${visualViewport?.height.toFixed(0)}@${visualViewport?.offsetTop.toFixed(0)}
canvas ${canvas.clientWidth}x${canvas.clientHeight}  stage ${stage.W}x${stage.H}  typeset ${typeset.W}x${typeset.H}
progress ${targetProgress().toFixed(3)}  current ${current.toFixed(3)}  max ${(trackEl.offsetHeight - (typeset.H || stage.H)).toFixed(0)}`;
    }

    const pos = current * TRACK_VH;
    const zoom = Math.pow(3.8, 1 - smooth(Math.min(pos / ZOOM_END, 1)));
    const shiftT = smooth(clamp01((pos - (ALIGN - 8)) / 68));
    const portrait = stage.W < stage.H;
    const rowShrink = portrait ? 0.82 : 1;
    const shift = portrait ? 0.5 - RADII[1]! * rowShrink : 0.22;
    const flow = clamp01((pos - ALIGN - ALIGN_LEN) / FLOW_LEN);
    const cu = clamp01((pos - ALIGN) / ALIGN_LEN);
    const vEnd = 2.26 / FLOW_LEN * ALIGN_LEN;
    const camY = smooth(cu) * 1.16 + (cu * cu * cu - cu * cu) * vEnd + 2.26 * flow;
    const halfH = 0.5 * stage.H / Math.min(stage.W, stage.H);
    const baseScale = Math.min(1, halfH / 0.8);
    const scale = baseScale * zoom;
    const unit = Math.min(stage.W, stage.H);

    for (let i = 0; i < 6; i++) {
      // Column: poster at the origin, small circles stacked below it.
      let x = 0, y = i === 0 ? 0 : -(ORBIT_R + (i - 1) * ROW_GAP);
      x += 0.01 / zoom * Math.sin(t * 0.7 + i * 1.9);   // gentle idle drift
      y += 0.01 / zoom * Math.cos(t * 0.6 + i * 2.3);
      data[i * 3] = (x - shift * shiftT) * scale;
      data[i * 3 + 1] = (y + camY) * scale;
      data[i * 3 + 2] = RADII[i]! * (i === 0 ? 1 : rowShrink) * scale;
    }

    // Heading + blurb to the right of each small circle. Writes that affect
    // layout (width, font size) go first for all five, then one round of
    // reads, then the transforms: no layout thrash.
    const labels: { nx: number; ny: number; alpha: number }[] = [];
    for (let i = 1; i < 6; i++) {
      const nx = stage.W / 2 + data[i * 3]! * unit + data[i * 3 + 2]! * unit + 0.045 * scale * unit;
      const ny = stage.H / 2 - data[i * 3 + 1]! * unit;
      const show = shiftT * (zoom < 1.01 ? 1 : 0);
      const focus = 1 - Math.min(Math.abs(ny - stage.H * 0.5) / (ROW_GAP * scale * unit * 0.7), 1);
      const alpha = show * Math.min(1, focus * 1.6);
      const note = notes[i - 1]!, title = titles[i - 1]!;
      const width = Math.max(90, Math.min(portrait ? 9999 : 24 * 16, stage.W - nx - 18)).toFixed(0) + 'px';
      setStyle(note, 'width', width);
      setStyle(title, 'width', width);
      const fontPx = Math.max(22, data[i * 3 + 2]! * unit * 0.5);
      setStyle(title, 'font-size', (Math.round(fontPx * 2) / 2) + 'px');
      if (i === 1) secFontPx = fontPx;
      labels.push({ nx, ny, alpha });
    }
    for (let i = 1; i < 6; i++) {
      const { nx, ny, alpha } = labels[i - 1]!;
      const note = notes[i - 1]!, title = titles[i - 1]!;
      const a = alpha.toFixed(2);
      setStyle(note, 'opacity', a);
      setStyle(title, 'opacity', a);
      setStyle(note, 'pointer-events', alpha > 0.6 ? 'auto' : 'none');
      if (alpha <= 0 && note.style.transform) continue;   // hidden labels keep their last position
      const gap = 10, tH = title.offsetHeight, nH = note.offsetHeight;
      const top = ny - (tH + gap + nH) / 2;
      setStyle(title, 'transform', `translate(${nx.toFixed(1)}px,${top.toFixed(1)}px)`);
      setStyle(note, 'transform', `translate(${nx.toFixed(1)}px,${(top + tH + gap).toFixed(1)}px)`);
    }

    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.k, STICKY * scale);
    gl.uniform3fv(U.balls, data);
    gl.uniform3f(U.bg, bg[0]!, bg[1]!, bg[2]!);
    gl.uniform1fv(U.asp, aspects);

    // The poster texture covers the on-screen part of the big circle (the whole
    // screen at 0% scroll), then stays attached to the circle.
    const minSide = Math.min(stage.W, stage.H);
    const hx = 0.5 * stage.W / minSide, hy = 0.5 * stage.H / minSide;
    const bx = data[0]!, by = data[1]!, br = data[2]!;
    let rect: number[];
    if (zoom > 1.0001) {
      const x0 = Math.max(-hx, bx - br), x1 = Math.min(hx, bx + br);
      const y0 = Math.max(-hy, by - br), y1 = Math.min(hy, by + br);
      rect = [(x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2];
    } else {
      rect = [bx, by, br, br];
    }
    gl.uniform2f(U.cen0, rect[0]!, rect[1]!);
    gl.uniform2f(U.ext0, rect[2]!, rect[3]!);
    layoutPoster();
    placePoster(rect, bx, by, br, unit, zoom, shiftT, shift, baseScale);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
  };

  // Scroll position hand-off with the detail pages via ?y=.
  // Only when returning with ?y= do we restore a position, and we stop the
  // moment the user interacts. There is deliberately no scrollTo on `load`:
  // on a phone the images arrive late, so a load-time scrollTo would yank the
  // page back to the top mid-animation.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const m = /[?&]y=(\d+)/.exec(location.search);
  const y = m ? Number(m[1]) : 0;
  if (y > 0) {
    let interacted = false;
    for (const ev of ['touchstart', 'wheel', 'keydown', 'pointerdown'] as const) {
      window.addEventListener(ev, () => { interacted = true; }, { once: true, passive: true });
    }
    const t0 = performance.now();
    (function hold() {
      if (interacted) return;
      if (Math.abs(window.scrollY - y) > 2) { window.scrollTo(0, y); current = targetProgress(); }
      if (performance.now() - t0 < 700) requestAnimationFrame(hold);
    })();
  }
  if (m) { try { history.replaceState(null, '', location.pathname); } catch {} }
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href^="/"]') as HTMLAnchorElement | null;
    const href = a?.getAttribute('href')?.split('?')[0];
    if (a && href && href !== '/') a.href = href + '?y=' + Math.round(window.scrollY);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) current = targetProgress(); });

  requestAnimationFrame(frame);
}
