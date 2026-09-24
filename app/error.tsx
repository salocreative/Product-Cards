"use client";

import { Button } from "@/components/button";
import { Shell } from "@/components/shell";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Shell>
      <div className="wrap">
        <header className="page-intro">
          <p className="eyebrow">Salo</p>
          <h1>This page didn’t load</h1>
          <p className="lede">Try again in a moment.</p>
          <p className="next-copy" style={{ marginTop: "1.5rem" }}>
            <Button type="button" onClick={() => reset()} arrow={false}>
              Try again
            </Button>
          </p>
        </header>
      </div>
    </Shell>
  );
}
