import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before starting
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 18,
  delay = 0,
  className,
  onComplete,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    const startTimeout = setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (indexRef.current < text.length) {
          indexRef.current++;
          setDisplayed(text.slice(0, indexRef.current));
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
          setDone(true);
          onComplete?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, delay, onComplete]);

  // Allow tapping to skip animation
  const skip = () => {
    if (!done) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayed(text);
      setDone(true);
      onComplete?.();
    }
  };

  return (
    <span className={className} onClick={skip} style={{ cursor: done ? 'default' : 'pointer' }}>
      {displayed}
      {!done && <span className="typewriter-cursor">▌</span>}
    </span>
  );
}
