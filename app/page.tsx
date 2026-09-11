import Link from "next/link";

import { SCENE_COPY } from "@/lib/content/microwave-bread";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--ink)]">
      <header className="px-6 py-5">
        <p className="text-sm font-medium tracking-wide text-[var(--ink-muted)]">
          {SCENE_COPY.productName}
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-20">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          Scene 01
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          Microwave Bread
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          A slice of bread is heated in a microwave oven. Investigate the change
          yourself — the lab owns the physical world, and you own the thinking.
        </p>

        <Link
          href="/scenes/microwave-bread"
          className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-[var(--heat)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--heat-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          Enter the lab
        </Link>
      </main>
    </div>
  );
}
