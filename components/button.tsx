"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

function Arrow() {
  return (
    <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function Button({
  href,
  children,
  size = "md",
  type = "button",
  onClick,
  arrow = true,
}: {
  href?: string;
  children: ReactNode;
  size?: "sm" | "md";
  type?: "button" | "submit";
  onClick?: () => void;
  arrow?: boolean;
}) {
  const hovering = useRef(false);
  const frame = useRef<number | null>(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 75, y: 75 });

  useEffect(() => {
    return () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function onEnter() {
    hovering.current = true;
    setHover(true);
  }

  function onLeave() {
    hovering.current = false;
    setHover(false);
  }

  function onMove(event: MouseEvent<HTMLElement>) {
    if (!hovering.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (frame.current != null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setPos({ x, y }));
  }

  const glowStyle = {
    top: `${pos.y}%`,
    left: `${pos.x}%`,
    opacity: hover ? 1 : 0,
    "--_scale": hover ? 1 : 0.75,
  } as CSSProperties;

  const inner = (
    <span className="btn-content">
      <span className="btn-bg" style={glowStyle} />
      <span className="btn-label">
        <span>{children}</span>
        {arrow ? <Arrow /> : null}
      </span>
    </span>
  );

  const className = `btn btn-${size}`;
  const handlers = {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseMove: onMove,
  };

  if (href) {
    return (
      <a className={className} href={href} {...handlers}>
        {inner}
      </a>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick} {...handlers}>
      {inner}
    </button>
  );
}
