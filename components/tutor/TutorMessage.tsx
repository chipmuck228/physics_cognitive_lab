interface TutorMessageProps {
  message: string;
}

export function TutorMessage({ message }: TutorMessageProps) {
  return (
    <p className="text-sm leading-relaxed text-[var(--ink)]">{message}</p>
  );
}
