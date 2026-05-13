'use client';

export default function LogoGlow({ investor }) {
  if (!investor?.domain) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-[350px] -left-[200px] w-[700px] h-[700px] -z-10 opacity-15 dark:opacity-30"
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${investor.domain}&sz=128`}
        alt=""
        className="w-full h-full object-cover opacity-50"
        style={{ filter: 'blur(150px) saturate(2)' }}
      />
    </div>
  );
}
