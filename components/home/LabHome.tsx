import Link from "next/link";

import { Card } from "@/components/common/Card";
import {
  HOME_COPY,
  HOME_PATH_STEPS,
  HOME_ROLES,
  LAB_SCENES,
  sceneEnterAria,
} from "@/lib/content/home";

const FOCUS_LINK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

export function LabHome() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--ink)]">
      <header className="px-6 py-5">
        <p className="mx-auto w-full max-w-3xl text-sm font-medium tracking-wide text-[var(--ink-muted)]">
          {HOME_COPY.productName}
        </p>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pb-16">
        <p className="text-sm tracking-[0.18em] text-[var(--ink-muted)]">
          {HOME_COPY.kicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {HOME_COPY.title}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          {HOME_COPY.lead}
        </p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--ink-muted)]">
          {HOME_COPY.contrast}
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          {HOME_ROLES.map((role) => (
            <li key={role.title}>
              <Card className="h-full p-4" as="article">
                <h2 className="font-serif text-lg">{role.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {role.body}
                </p>
              </Card>
            </li>
          ))}
        </ul>

        <section className="mt-12" aria-labelledby="home-path-heading">
          <h2 id="home-path-heading" className="text-sm font-medium tracking-wide text-[var(--ink-muted)]">
            {HOME_COPY.pathTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed sm:text-base">
            {HOME_PATH_STEPS.join(" → ")}
          </p>
        </section>

        <section className="mt-12" aria-labelledby="home-scenes-heading">
          <h2 id="home-scenes-heading" className="font-serif text-2xl">
            {HOME_COPY.scenesTitle}
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{HOME_COPY.scenesHint}</p>

          <ul className="mt-6 space-y-3">
            {LAB_SCENES.map((scene) => (
              <li key={scene.id}>
                <Link
                  href={scene.href}
                  aria-label={sceneEnterAria(scene)}
                  className={`group flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 transition-colors hover:border-[var(--heat)] sm:flex-row sm:items-center sm:justify-between ${FOCUS_LINK}`}
                >
                  <span>
                    <span className="block text-xs font-medium tracking-wide text-[var(--ink-muted)]">
                      {scene.kicker}
                    </span>
                    <span className="mt-1 block font-serif text-xl leading-snug">
                      {scene.title}
                    </span>
                    <span className="mt-2 block text-[var(--ink-muted)]">
                      {scene.question}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-medium text-[var(--heat)] group-hover:text-[var(--heat-strong)]">
                    {scene.cta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-6 py-5">
        <p className="mx-auto w-full max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)]">
          {HOME_COPY.footer}
        </p>
      </footer>
    </div>
  );
}
