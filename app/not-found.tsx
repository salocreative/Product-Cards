import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="wrap">
        <header className="page-intro">
          <p className="eyebrow">Salo</p>
          <h1>That page isn’t available</h1>
          <p className="lede">The link may be a draft, or the address may be wrong.</p>
        </header>
      </div>
    </Shell>
  );
}
