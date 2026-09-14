export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 38" fill="none" aria-hidden="true">
      <path d="M4 24c25-18 46 2 70-8 23-9 37-17 57-8 15 7 28 10 45 1" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 31c26-9 49 4 72-4 17-6 34-10 50-3 15 7 27 7 42 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}
