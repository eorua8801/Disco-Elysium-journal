import { useRef, useMemo, useEffect } from 'react';
import './FilmStrip.css';

const FRAME_H = 80;   // px per frame
const VISIBLE = 5;    // frames shown in window (odd → clean center)
const CENTER = Math.floor(VISIBLE / 2); // index 2
const PREFIX = 22;    // random frames before the result
const SUFFIX = 2;     // random frames after (fills bottom of window)
const DURATION = 0.65; // seconds, strictly linear — no ease-out

interface FilmStripProps {
  /** 1–6, the actual die result (already rolled) */
  finalValue: number;
  /** true = start scrolling animation */
  active: boolean;
  onDone?: () => void;
}

export function FilmStrip({ finalValue, active, onDone }: FilmStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const calledRef = useRef(false);

  // Build frame sequence once per mount (key-controlled from parent)
  const frames = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < PREFIX; i++) arr.push(Math.ceil(Math.random() * 6));
    arr.push(finalValue);
    for (let i = 0; i < SUFFIX; i++) arr.push(Math.ceil(Math.random() * 6));
    return arr;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // translateY that puts frame index PREFIX at the center of the window
  const targetY = -(PREFIX - CENTER) * FRAME_H; // e.g. -(22-2)*80 = -1600

  useEffect(() => {
    if (!active || !trackRef.current) return;
    calledRef.current = false;
    const track = trackRef.current;

    // snap back to top (no transition so it's instant)
    track.style.transition = 'none';
    track.style.transform = 'translateY(0px)';
    void track.offsetHeight; // force reflow

    // scroll to result: linear — stops dead, no coast
    track.style.transition = `transform ${DURATION}s linear`;
    track.style.transform = `translateY(${targetY}px)`;

    const timer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onDone?.();
      }
    }, DURATION * 1000 + 40);

    return () => clearTimeout(timer);
  }, [active, onDone, targetY]);

  return (
    <div
      className={`film-strip${active ? ' film-strip--rolling' : ''}`}
      style={{ height: VISIBLE * FRAME_H }}
    >
      {/* Left sprocket column */}
      <div className="film-strip__sprockets">
        {Array.from({ length: VISIBLE }).map((_, i) => (
          <div key={i} className="film-sprocket" />
        ))}
      </div>

      {/* Scrolling window */}
      <div className="film-strip__window">
        <div className="film-strip__track" ref={trackRef}>
          {frames.map((val, i) => (
            <div key={i} className="film-frame" style={{ height: FRAME_H }}>
              <span className="film-frame__num">{val}</span>
            </div>
          ))}
        </div>
        {/* Amber gate marks the center frame */}
        <div
          className="film-strip__gate"
          style={{ top: CENTER * FRAME_H, height: FRAME_H }}
        />
      </div>

      {/* Right sprocket column */}
      <div className="film-strip__sprockets">
        {Array.from({ length: VISIBLE }).map((_, i) => (
          <div key={i} className="film-sprocket" />
        ))}
      </div>
    </div>
  );
}
