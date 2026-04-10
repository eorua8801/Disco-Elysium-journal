/* sounds.ts — Web Audio API synthesis for DE-style film camera effects */

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === 'suspended') void _ctx.resume();
  return _ctx;
}

function playBuffer(data: Float32Array, volume = 1) {
  try {
    const ac = getCtx();
    const buf = ac.createBuffer(1, data.length, ac.sampleRate);
    buf.getChannelData(0).set(data);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const gain = ac.createGain();
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(ac.destination);
    src.start();
  } catch {
    // audio blocked or not supported
  }
}

/** Light mechanical click — UI navigation / button presses */
export function playClick() {
  try {
    const ac = getCtx();
    const sr = ac.sampleRate;
    const len = Math.floor(sr * 0.04);
    const d = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      d[i] =
        (Math.random() * 2 - 1) * Math.exp(-t * 200) * 0.32 +
        Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 280) * 0.12;
    }
    playBuffer(d);
  } catch {}
}

/** Single rapid tick — for film winding train */
function playTick() {
  try {
    const ac = getCtx();
    const sr = ac.sampleRate;
    const len = Math.floor(sr * 0.011);
    const d = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 700) * 0.18;
    }
    playBuffer(d);
  } catch {}
}

let _windActive = false;

/** Start rapid mechanical ticking — call when film strip begins rolling */
export function startFilmWind() {
  _windActive = true;
  const tick = () => {
    if (!_windActive) return;
    playTick();
    // slight jitter for organic mechanical feel
    const interval = 30 + (Math.random() - 0.5) * 8;
    setTimeout(tick, interval);
  };
  tick();
}

/** Stop film winding ticks */
export function stopFilmWind() {
  _windActive = false;
}

/** Heavy frame-lock shutter — plays when film strip snaps to result */
export function playShutter() {
  try {
    const ac = getCtx();
    const sr = ac.sampleRate;
    const len = Math.floor(sr * 0.075);
    const d = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      // transient impact + resonant body
      d[i] =
        (Math.random() * 2 - 1) * Math.exp(-t * 100) * 0.48 +
        Math.sin(2 * Math.PI * 850 * t) * Math.exp(-t * 55) * 0.28 +
        Math.sin(2 * Math.PI * 1700 * t) * Math.exp(-t * 110) * 0.10;
    }
    playBuffer(d);
  } catch {}
}
