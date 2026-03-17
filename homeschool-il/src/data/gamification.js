export const DIFFICULTY_XP = {
  starter: 10,
  basic: 20,
  intermediate: 35,
  advanced: 50,
};

export const XP_RANKS = [
  { minXp: 0,   title: "גיבור מתחיל", emoji: "🌱" },
  { minXp: 50,  title: "לומד סקרן",   emoji: "📖" },
  { minXp: 150, title: "חוקר חכם",    emoji: "🔍" },
  { minXp: 300, title: "אלוף הכיתה",  emoji: "🏆" },
  { minXp: 450, title: "גאון על",     emoji: "⭐" },
];

export function getXpForLesson(difficulty, score, total) {
  const base = DIFFICULTY_XP[difficulty] ?? 10;
  return Math.round(base * (score / total));
}

export function getRankForXp(totalXp) {
  let rank = XP_RANKS[0];
  for (const r of XP_RANKS) {
    if (totalXp >= r.minXp) rank = r;
  }
  return rank;
}
