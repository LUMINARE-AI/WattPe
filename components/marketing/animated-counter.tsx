"use client";

import { useEffect, useRef, useState } from "react";

const NUMBER_PATTERN = /[\d,]+(\.\d+)?/;

function formatLike(sample: string, current: number) {
  const hasComma = sample.includes(",");
  const decimalMatch = sample.match(/\.(\d+)/);
  const decimals = decimalMatch ? decimalMatch[1].length : 0;

  const rounded = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
  if (!hasComma) return rounded;

  const [whole, frac] = rounded.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}

export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => value.replace(NUMBER_PATTERN, (m) => formatLike(m, 0)));

  useEffect(() => {
    const match = value.match(NUMBER_PATTERN);
    const node = ref.current;
    if (!match || !node) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(match[0].replace(/,/g, ""));
    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 1400;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(value.replace(NUMBER_PATTERN, formatLike(match[0], current)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
