import child1Math from "../data/curriculum/child1-math";
import child1English from "../data/curriculum/child1-english";
import child2Math from "../data/curriculum/child2-math";
import child2English from "../data/curriculum/child2-english";

const CURRICULA = {
  child1: { math: child1Math, english: child1English },
  child2: { math: child2Math, english: child2English },
};

export function getSubjectStats(childId, subject, progress) {
  const curriculum = CURRICULA[childId]?.[subject];
  if (!curriculum) return { completed: 0, total: 0, percent: 0, avgScore: 0 };

  let total = 0;
  let completed = 0;
  let scoreSum = 0;
  let scoreCount = 0;

  for (const lessons of Object.values(curriculum)) {
    for (const lesson of lessons) {
      total++;
      const key = `${childId}.${subject}.${lesson.id}`;
      const result = progress[key];
      if (result) {
        completed++;
        scoreSum += result.score / result.total;
        scoreCount++;
      }
    }
  }

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgScore = scoreCount > 0 ? Math.round((scoreSum / scoreCount) * 100) : 0;

  return { completed, total, percent, avgScore };
}

export function getChildStats(childId, progress) {
  const math = getSubjectStats(childId, "math", progress);
  const english = getSubjectStats(childId, "english", progress);
  return { math, english };
}

export function getLessonResult(childId, subject, lessonId, progress) {
  const key = `${childId}.${subject}.${lessonId}`;
  return progress[key] || null;
}

export function getChildTotalXp(childId, progress) {
  const prefix = `${childId}.`;
  return Object.entries(progress)
    .filter(([key]) => key.startsWith(prefix))
    .reduce((sum, [, entry]) => sum + (entry.xp || 0), 0);
}
