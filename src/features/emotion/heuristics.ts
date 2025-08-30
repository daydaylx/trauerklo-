export type Emotion = "happy" | "meh" | "concerned";

const happyWords = ["geschafft","cool","liebe","danke","yay","nice","gut","super","yeah"];
const sadWords = ["müde","stress","sorge","traurig","kann nicht","überfordert","kaputt"];

export function detectEmotion(text: string): Emotion {
  const t = text.toLowerCase();
  if (happyWords.some(w => t.includes(w))) return "happy";
  if (sadWords.some(w => t.includes(w))) return "concerned";
  return "meh";
}
