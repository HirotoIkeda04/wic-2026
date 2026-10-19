"use client";

import { useEffect, useRef, useState } from "react";
import landDots from "./land-dots.json";

/**
 * Dotted globe (Three.js) in the manner of cloudflare.com, in black and white:
 * a dark sphere, land drawn as a grid of dots, a faint rim, and a marker for
 * each WIC2025 university with its name beside it (HTML, placed every frame).
 * It turns slowly and can be dragged. Without WebGL the box stays empty
 * apart from its label; with reduced motion it renders one still frame.
 */

type Site = {
  lat: number;
  lon: number;
  /** "University, country code" lines; one marker per city */
  names: string[];
  /** Which side of the marker the label sits on, and a nudge in px to keep neighbours apart */
  side: "left" | "right";
  dy?: number;
};

/** WIC2025 universities (Past.tsx, UNIVERSITIES_2025), grouped by city. */
const SITES: Site[] = [
  { lat: 48.14, lon: 11.58, names: ["LMU Munich, DE", "TU Munich, DE"], side: "right", dy: 6 },
  { lat: 50.78, lon: 6.08, names: ["RWTH Aachen, DE"], side: "right", dy: -10 },
  { lat: 46.2, lon: 6.14, names: ["Univ. of Geneva, CH"], side: "left", dy: 6 },
  { lat: 53.38, lon: -1.47, names: ["Univ. of Sheffield, GB"], side: "left", dy: -6 },
  { lat: 53.55, lon: -113.49, names: ["Univ. of Alberta, CA"], side: "right" },
  { lat: 43.66, lon: -79.4, names: ["Univ. of Toronto, CA"], side: "left", dy: -6 },
  { lat: 34.07, lon: -118.44, names: ["UCLA, US"], side: "left" },
  { lat: 41.67, lon: -71.27, names: ["Roger Williams Univ., US"], side: "right", dy: 6 },
  { lat: 29.87, lon: 77.89, names: ["IIT Roorkee, IN"], side: "right", dy: -6 },
  { lat: 28.69, lon: 77.21, names: ["Univ. of Delhi, IN"], side: "left", dy: 6 },
  { lat: -33.92, lon: 151.23, names: ["UNSW Sydney, AU"], side: "right" },
  { lat: 2.93, lon: 101.78, names: ["Univ. Kebangsaan Malaysia, MY"], side: "left" },
  { lat: 35.71, lon: 139.72, names: ["Waseda Univ., JP", "Keio Univ., JP", "Meiji Univ., JP"], side: "right" },
];

const R = 1;
const INK = [0.95, 0.95, 0.95] as const;

function toXYZ(lat: number, lon: number, r = R): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

export function Globe({ label }: { label: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const box = boxRef.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;
      }
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.domElement.className = "absolute inset-0 size-full touch-pan-y";
      box.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0, 4.4);

      const globe = new THREE.Group();
      globe.rotation.x = 0.3;                // tilt the north toward the viewer
      globe.rotation.y = -2.5;               // start over Europe and India
      scene.add(globe);
      const disposables: { dispose(): void }[] = [];
      const track = <T extends { dispose(): void }>(d: T) => (disposables.push(d), d);

      // Dark body; hides the dots on the far side
      globe.add(new THREE.Mesh(
        track(new THREE.SphereGeometry(R * 0.995, 96, 64)),
        track(new THREE.MeshBasicMaterial({ color: 0x0e0e0e })),
      ));

      // Rim: a hairline on the silhouette, which sits in front of the centre
      // (at z = R²/d) with radius R·√(1 − R²/d²) for a camera at distance d
      const d = camera.position.z;
      const rs = R * Math.sqrt(1 - (R * R) / (d * d));
      const rim = new THREE.Mesh(
        track(new THREE.RingGeometry(rs, rs * 1.004, 256)),
        track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false })),
      );
      rim.position.z = (R * R) / d;
      scene.add(rim);

      // Land dots
      const pts: number[] = [];
      for (let i = 0; i < landDots.length; i += 2) pts.push(...toXYZ(landDots[i], landDots[i + 1], R * 1.002));
      const dotGeo = track(new THREE.BufferGeometry());
      dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      const dotMat = track(new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uSize: { value: 2.1 * dpr }, uColor: { value: new THREE.Color(...INK) } },
        vertexShader: `uniform float uSize; varying float vFace;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            // Dots turned away from the camera fade toward the limb
            vFace = dot(normalize(normalMatrix * position), normalize(-mv.xyz));
            gl_PointSize = uSize;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `uniform vec3 uColor; varying float vFace;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(uColor, (0.12 + 0.48 * smoothstep(0.0, 0.7, vFace)) * smoothstep(0.5, 0.3, d));
          }`,
      }));
      globe.add(new THREE.Points(dotGeo, dotMat));

      // Markers: a solid dot with a ring that breathes
      const sitePos = SITES.map((s) => new THREE.Vector3(...toXYZ(s.lat, s.lon, R * 1.004)));
      const markGeo = track(new THREE.BufferGeometry().setFromPoints(sitePos));
      markGeo.setAttribute("size", new THREE.Float32BufferAttribute(SITES.map(() => 14), 1));
      const markMat = track(new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uDpr: { value: dpr } },
        vertexShader: `attribute float size; uniform float uDpr; varying float vFace;
          void main(){
            vec4 mv = modelViewMatrix * vec4(position,1.0);
            vFace = dot(normalize(normalMatrix * position), normalize(-mv.xyz));
            gl_PointSize = size * uDpr;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `uniform float uTime; varying float vFace;
          void main(){
            if (vFace < 0.0) discard;
            float d = length(gl_PointCoord - 0.5) * 2.0;
            float core = smoothstep(0.34, 0.26, d);
            float r = 0.45 + 0.4 * fract(uTime * 0.5);
            float ring = smoothstep(0.07, 0.0, abs(d - r)) * (1.0 - fract(uTime * 0.5));
            float a = max(core, ring * 0.8);
            if (a < 0.01) discard;
            gl_FragColor = vec4(vec3(1.0), a);
          }`,
      }));
      globe.add(new THREE.Points(markGeo, markMat));

      function resize() {
        const { width, height } = box.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      // Labels follow their marker and fade out as it turns toward the limb
      const p = new THREE.Vector3(), toCam = new THREE.Vector3();
      function placeLabels() {
        const { width, height, left } = box.getBoundingClientRect();
        // Labels may hang outside the box, but not off the screen
        const minX = 8 - left, maxX = document.documentElement.clientWidth - left - 8;
        globe.updateMatrixWorld();
        sitePos.forEach((local, i) => {
          const el = labelRefs.current[i];
          if (!el) return;
          p.copy(local).applyMatrix4(globe.matrixWorld);
          toCam.copy(camera.position).sub(p).normalize();
          const facing = p.clone().normalize().dot(toCam);
          const opacity = Math.min(1, Math.max(0, (facing - 0.2) / 0.25));
          p.project(camera);
          const x = ((p.x + 1) / 2) * width, y = ((1 - p.y) / 2) * height + (SITES[i].dy ?? 0);
          const w = el.offsetWidth;
          let lx = SITES[i].side === "left" ? x - 10 - w : x + 10;
          lx = Math.min(Math.max(lx, minX), maxX - w);
          el.style.transform = `translate(${lx.toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)`;
          el.style.opacity = String(opacity);
        });
      }
      function draw() {
        renderer.render(scene, camera);
        placeLabels();
      }

      const ro = new ResizeObserver(() => { resize(); draw(); });
      ro.observe(box);
      resize();

      // Drag to turn; it eases back to the slow spin on release
      let dragging = false, lastX = 0, velocity = 0;
      const el = renderer.domElement;
      const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; el.setPointerCapture(e.pointerId); };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        velocity = dx * 0.005;
        globe.rotation.y += velocity;
        if (still) draw();
      };
      const up = () => { dragging = false; };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);

      let raf = 0, last = performance.now(), visible = false, t = 0;
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        t += dt;
        if (!dragging) {
          velocity *= 0.94;
          globe.rotation.y += 0.07 * dt + velocity;
        }
        markMat.uniforms.uTime.value = t;
        draw();
        if (visible) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible && !still) { last = performance.now(); raf = requestAnimationFrame(frame); }
      });
      if (still) {
        draw();
      } else {
        io.observe(box);
      }
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        el.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label={label}
      className={`relative mx-auto aspect-square w-full max-w-[40rem] cursor-grab bg-[radial-gradient(circle_at_50%_50%,rgb(255_255_255/0.07)_0%,rgb(255_255_255/0.025)_38%,transparent_62%)] transition-opacity duration-700 active:cursor-grabbing ${live ? "opacity-100" : "opacity-0"}`}
    >
      {SITES.map((s, i) => (
        <span
          key={s.names[0]}
          ref={(el) => { labelRefs.current[i] = el; }}
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap text-[11px] leading-[1.35] text-[#f2f2f2]/85 opacity-0 [text-shadow:0_0_6px_#0e0e0e,0_0_2px_#0e0e0e] sm:text-[12px] ${s.side === "left" ? "text-right" : ""}`}
        >
          {s.names.map((n) => <span key={n} className="block">{n}</span>)}
        </span>
      ))}
    </div>
  );
}
