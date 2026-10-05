import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import {
  BUBBLE_MIN_SPEED,
  BUBBLE_MAX_SPEED,
  BUBBLE_MAX_FRAME_SECONDS,
  BUBBLE_PLACE_TRIES,
} from '../constant/Constants';
import { randomBetween } from '../utils/gameUtils';

// Drops each bubble at a random spot that does not overlap the ones placed
// before it. If the box is too full to find one in a few tries it takes the
// last spot tried; the first collision pass then pushes it clear.
const placeBodies = (count, arena, size) => {
  const maxX = Math.max(arena.w - size, 0);
  const maxY = Math.max(arena.h - size, 0);
  const bodies = [];
  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    for (let t = 0; t < BUBBLE_PLACE_TRIES; t++) {
      x = randomBetween(0, maxX);
      y = randomBetween(0, maxY);
      if (bodies.every((b) => Math.hypot(b.x - x, b.y - y) >= size)) break;
    }
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(BUBBLE_MIN_SPEED, BUBBLE_MAX_SPEED);
    bodies.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
  }
  return bodies;
};

// Bubbles are equal circles of equal mass, so a head-on hit just swaps their
// velocity along the line between their centres.
const collide = (a, b, size) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0 || dist >= size) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const push = (size - dist) / 2;
  a.x -= nx * push;
  a.y -= ny * push;
  b.x += nx * push;
  b.y += ny * push;

  const approach = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (approach > 0) {
    a.vx -= approach * nx;
    a.vy -= approach * ny;
    b.vx += approach * nx;
    b.vy += approach * ny;
  }
};

/**
 * Keeps `count` bubbles moving inside `arena`, bouncing off its walls and off
 * each other. Returns one { x, y } pair of Animated.Values per bubble id; the
 * loop writes to them directly, so React never re-renders for a frame.
 *
 * `resetKey` re-deals every bubble. `activeIds` are the bubbles still on the
 * board — a picked one stops moving and stops colliding.
 */
const useBubblePhysics = ({ count, arena, size, resetKey, activeIds }) => {
  const values = useMemo(
    () => Array.from({ length: count }, () => ({ x: new Animated.Value(0), y: new Animated.Value(0) })),
    // resetKey is the intended trigger: same count, new round, new values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, resetKey],
  );
  const activeRef = useRef(activeIds);
  useEffect(() => {
    activeRef.current = activeIds;
  });

  useEffect(() => {
    if (!arena.w || !arena.h) return undefined;

    const bodies = placeBodies(count, arena, size);
    const maxX = Math.max(arena.w - size, 0);
    const maxY = Math.max(arena.h - size, 0);
    let last = null;
    let frame;

    const step = (now) => {
      const dt = last === null ? 0 : Math.min((now - last) / 1000, BUBBLE_MAX_FRAME_SECONDS);
      last = now;
      const live = activeRef.current.map((id) => bodies[id]);

      live.forEach((b) => {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      });
      for (let i = 0; i < live.length; i++) {
        for (let j = i + 1; j < live.length; j++) collide(live[i], live[j], size);
      }
      live.forEach((b) => {
        if (b.x < 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx);
        } else if (b.x > maxX) {
          b.x = maxX;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y < 0) {
          b.y = 0;
          b.vy = Math.abs(b.vy);
        } else if (b.y > maxY) {
          b.y = maxY;
          b.vy = -Math.abs(b.vy);
        }
      });

      bodies.forEach((b, id) => {
        values[id].x.setValue(b.x);
        values[id].y.setValue(b.y);
      });
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [values, arena, count, size]);

  return values;
};

export default useBubblePhysics;
