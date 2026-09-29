import { paragraphs } from "../lib/content.jsx";

/** Teksts no admin: tukša rinda = jauna rindkopa, viena rinda = <br>. */
export function Lines({ text }) {
  const parts = (text || "").split("\n");
  return parts.flatMap((s, i) => (i ? [<br key={`br${i}`} />, s] : [s]));
}

export default function Paragraphs({ text }) {
  return paragraphs(text).map((p, i) => (
    <p key={i}>
      <Lines text={p} />
    </p>
  ));
}
