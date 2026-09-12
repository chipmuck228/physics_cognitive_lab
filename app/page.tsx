import Link from "next/link";

import { HEAT_COPY } from "@/lib/content/equal-mass-heated-samples";
import { SAMPLES_COPY } from "@/lib/content/equal-volume-material-samples";
import { CART_COPY } from "@/lib/content/horizontal-force-cart";
import { ENGINE_COPY } from "@/lib/content/four-stroke-engine";
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
        <p className="text-sm tracking-[0.18em] text-[var(--ink-muted)]">
          {SCENE_COPY.landingKicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {SCENE_COPY.landingTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          {SCENE_COPY.landingBody}
        </p>

        <Link
          href="/scenes/microwave-bread"
          className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-[var(--heat)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--heat-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          {SCENE_COPY.landingCta}
        </Link>

        <p className="text-sm tracking-[0.18em] text-[var(--ink-muted)] pt-10">
          {ENGINE_COPY.landingKicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {ENGINE_COPY.landingTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          {ENGINE_COPY.landingBody}
        </p>

        <Link
          href="/scenes/four-stroke-engine"
          className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-[var(--heat)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--heat-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          {ENGINE_COPY.landingCta}
        </Link>

        <p className="text-sm tracking-[0.18em] text-[var(--ink-muted)] pt-10">
          {CART_COPY.landingKicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {CART_COPY.landingTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          {CART_COPY.landingBody}
        </p>

        <Link
          href="/scenes/horizontal-force-cart"
          className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-[var(--heat)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--heat-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          {CART_COPY.landingCta}
        </Link>

        <p className="text-sm tracking-[0.18em] text-[var(--ink-muted)] pt-10">
          {SAMPLES_COPY.landingKicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {SAMPLES_COPY.landingTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          {SAMPLES_COPY.landingBody}
        </p>

        <Link
          href="/scenes/equal-volume-material-samples"
          className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-[var(--heat)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--heat-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          {SAMPLES_COPY.landingCta}
        </Link>

        <p className="text-sm tracking-[0.18em] text-[var(--ink-muted)] pt-10">
          {HEAT_COPY.landingKicker}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {HEAT_COPY.landingTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]">
          {HEAT_COPY.landingBody}
        </p>

        <Link
          href="/scenes/equal-mass-heated-samples"
          className="mt-10 inline-flex h-12 w-fit items-center rounded-full bg-[var(--heat)] px-6 text-base font-medium text-white transition-colors hover:bg-[var(--heat-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--heat)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          {HEAT_COPY.landingCta}
        </Link>
      </main>
    </div>
  );
}
