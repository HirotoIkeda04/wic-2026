import { useEffect, useRef } from "react";

/**
 * Photos hung on a helix around the camera (Three.js). The camera stands on
 * the helix's axis, so the photos surround it; scrolling turns the camera and
 * carries it up the helix, and it also turns slowly on its own. Photos facing the camera are bright and sharp-edged,
 * those to the side and above or below fade into the dark.
 *
 * Fills its positioned parent. Three.js, the renderer and the photos are
 * fetched after the first screen has loaded (or once the section reaches the
 * viewport, if that comes first). Renders only while on screen; with reduced motion it
 * draws one still frame.
 */

const RADIUS = 4;
const PER_TURN = 13;         // photos per full turn: neighbours on a row nearly touch
const RISE = 0.13;           // height gained per photo; one turn ≈ one photo height plus a gap
const COUNT = PER_TURN * 9;  // nine turns
/**
 * Share of a photo's width each row is shifted along from the row below. With
 * a whole number of photos per turn they would stack in straight columns; the
 * shift turns the columns into diagonals that wind round the helix.
 */
const TWIST = 0.4;
const PLANE_W = 1.9;
const PLANE_H = PLANE_W * 0.75;
const BG = 0x0c0b0b;

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // 1 when the point is straight ahead of the camera, 0 at 90° away
    vFacing = max(0.0, -mv.z / length(mv.xyz));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uImgAspect;
  uniform float uPlaneAspect;
  uniform vec3 uBg;
  varying vec2 vUv;
  varying float vFacing;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Cover-crop the photo to the plane
    vec2 uv = vUv - 0.5;
    if (uImgAspect > uPlaneAspect) uv.x *= uPlaneAspect / uImgAspect;
    else uv.y *= uImgAspect / uPlaneAspect;
    vec3 col = texture2D(uMap, uv + 0.5).rgb;

    // Rounded corners
    vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
    float d = roundedBox(p, vec2(0.5 * uPlaneAspect, 0.5), 0.045);
    float alpha = 1.0 - smoothstep(-0.004, 0.004, d);
    if (alpha < 0.01) discard;

    // Fade towards the background away from the line of sight
    float light = smoothstep(0.78, 0.995, vFacing);
    col = mix(uBg, col * 0.95, 0.1 + 0.9 * light);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function PhotoVortex({ photos }: { photos: string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    // Start once the first screen has finished loading and the browser is idle,
    // so the photos are in place before the section scrolls in; or earlier, if
    // the section comes a little way into the viewport before then (on phones
    // its top edge already shows under the hero, hence the margin)
    let started = false;
    let idle = 0;
    const start = () => {
      if (started) return;
      started = true;
      begin.disconnect();
      window.removeEventListener("load", onLoad);
      cancelIdle(idle);
      setup();
    };
    const begin = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) start();
    }, { rootMargin: "0px 0px -15% 0px" });
    begin.observe(box);
    const requestIdle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const onLoad = () => {
      idle = requestIdle(start, { timeout: 2000 });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    async function setup() {
      const { Color, DoubleSide, Mesh, PerspectiveCamera, PlaneGeometry, SRGBColorSpace, Scene, ShaderMaterial, TextureLoader, WebGLRenderer } = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.className = "absolute inset-0 size-full";
      box.appendChild(renderer.domElement);

      const scene = new Scene();
      const camera = new PerspectiveCamera(62, 1, 0.05, 30);
      const bg = new Color(BG);

      const loader = new TextureLoader();
      const disposables: { dispose(): void }[] = [];
      const geo = new PlaneGeometry(PLANE_W, PLANE_H);
      disposables.push(geo);

      const materials = photos.map((src) => {
        const mat = new ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          side: DoubleSide,
          uniforms: {
            uMap: { value: null },
            uImgAspect: { value: 1 },
            uPlaneAspect: { value: PLANE_W / PLANE_H },
            uBg: { value: bg },
          },
        });
        loader.load(src, (tex) => {
          tex.colorSpace = SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          mat.uniforms.uMap.value = tex;
          mat.uniforms.uImgAspect.value = tex.image.width / tex.image.height;
          disposables.push(tex);
          draw();
        });
        disposables.push(mat);
        return mat;
      });

      // The helix, centred on the camera's starting height. Each photo sits a
      // little nearer or farther and is a little larger or smaller, so the
      // wall has depth rather than being a smooth drum.
      const jitter = (i: number, k: number) => {
        const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      for (let i = 0; i < COUNT; i++) {
        const a = ((i * (1 + TWIST / PER_TURN)) / PER_TURN) * Math.PI * 2;
        const y = (i - COUNT / 2) * RISE;
        const r = RADIUS * (0.85 + 0.35 * jitter(i, 1));
        const mesh = new Mesh(geo, materials[(i * 3) % materials.length]);
        mesh.position.set(Math.sin(a) * r, y, -Math.cos(a) * r);
        mesh.scale.setScalar(0.8 + 0.35 * jitter(i, 2));
        mesh.lookAt(0, y, 0); // face the axis, where the camera stands
        scene.add(mesh);
      }

      let progress = 0; // -1 … 1 as the section passes through the viewport
      let drift = 0;    // slow turn of its own, like the globe's
      function draw() {
        if (disposed) return;
        // About half a turn and a climb of one row across the section's pass,
        // on top of the idle drift
        camera.rotation.set(0, -progress * Math.PI * 0.5 - drift, 0, "YXZ");
        camera.position.set(0, -progress * PER_TURN * RISE * 0.6, 0);
        renderer.render(scene, camera);
      }

      function measure() {
        const r = box.getBoundingClientRect();
        const vh = window.innerHeight;
        progress = Math.max(-1.2, Math.min(1.2, (r.top + r.height / 2 - vh / 2) / vh));
      }

      function resize() {
        const { width, height } = box.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Keep about the same field of view across the width on phones
        camera.fov = camera.aspect < 0.8 ? 78 : 62;
        camera.updateProjectionMatrix();
        draw();
      }

      // While on screen: a frame loop that advances the drift and follows
      // the scroll position. Off screen (or with reduced motion) nothing runs.
      let raf = 0;
      let last = 0;
      const frame = (now: number) => {
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
        last = now;
        drift -= 0.045 * dt; // radians per second, against the scroll turn: one turn in about 2⅓ minutes
        measure();
        draw();
        raf = requestAnimationFrame(frame);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(box);
      const io = new IntersectionObserver(([e]) => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (e.isIntersecting && !still) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      });
      io.observe(box);
      measure();
      resize();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      disposed = true;
      begin.disconnect();
      window.removeEventListener("load", onLoad);
      cancelIdle(idle);
      cleanup();
    };
  }, [photos]);

  return <div ref={boxRef} aria-hidden="true" className="absolute inset-0" />;
}
