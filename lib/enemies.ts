import type { EnemyId } from "@/lib/enemy-sprites";

export type Enemy = {
  id: EnemyId;
  name: string;
  hp: number; // hits to defeat
  w: number;
  h: number;
  boss?: boolean;
  float?: number; // hovers this many px above the ground
  appear: string;
  lunge: string;
  defeat: string;
};

export const NORMAL: Enemy[] = [
  { id: "conflict", name: "Merge Conflict", hp: 3, w: 24, h: 20, appear: "A wild Merge Conflict appeared!", lunge: "Merge Conflict rebases onto you!", defeat: "Merge Conflict was resolved. (By deleting it.)" },
  { id: "null", name: "Null Pointer", hp: 3, w: 22, h: 28, float: 4, appear: "A Null Pointer floats in. It points at nothing.", lunge: "Null Pointer dereferences you!", defeat: "Null Pointer was caught by a null check." },
  { id: "bat", name: "404 Bat", hp: 2, w: 32, h: 24, float: 8, appear: "A 404 Bat swoops in. Page not found.", lunge: "404 Bat screeches! File not found.", defeat: "404 Bat was redirected to the homepage." },
  { id: "leak", name: "Memory Leak", hp: 4, w: 26, h: 26, appear: "A Memory Leak oozes closer. It is eating your RAM.", lunge: "Memory Leak allocates on you!", defeat: "Memory Leak was garbage collected." },
  { id: "debt", name: "Tech Debt", hp: 5, w: 32, h: 32, appear: "Tech Debt stomps in. It has 400 sticky notes.", lunge: "Tech Debt demands interest!", defeat: "Tech Debt was refactored. (Just kidding, it was moved to next sprint.)" },
  { id: "loop", name: "Infinite Loop", hp: 3, w: 28, h: 28, appear: "An Infinite Loop appeared! It will appear again.", lunge: "Infinite Loop circles back!", defeat: "Infinite Loop hit its break condition." },
];

export const BOSSES: Enemy[] = [
  { id: "hydra", name: "SPAGHETTI HYDRA", hp: 9, w: 52, h: 44, boss: true, appear: "The Spaghetti Hydra rises! Cut one head and two merge back.", lunge: "Spaghetti Hydra whips three noodles!", defeat: "The Spaghetti Hydra was untangled. Dropped: 1 clean architecture." },
  { id: "scope", name: "SCOPE CREEP", hp: 10, w: 52, h: 46, boss: true, appear: "Scope Creep stares at you. \"Just one small change.\"", lunge: "Scope Creep adds a feature!", defeat: "Scope Creep was descoped. Dropped: 1 signed brief." },
  { id: "deploy", name: "FRIDAY DEPLOY", hp: 10, w: 54, h: 44, boss: true, appear: "FRIDAY DEPLOY lands. It is 4:59 p.m.", lunge: "Friday Deploy breathes production fire!", defeat: "Friday Deploy was rolled back. Dropped: 1 weekend." },
];

/** Fight n (0-based): three regular monsters, then the next boss, and round again. */
export function enemyFor(n: number): Enemy {
  if (n % 4 === 3) return BOSSES[Math.floor(n / 4) % BOSSES.length];
  return NORMAL[(n - Math.floor(n / 4)) % NORMAL.length];
}
