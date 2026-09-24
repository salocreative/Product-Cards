import Image from "next/image";
import { Button } from "@/components/button";
import { CoverImage } from "@/components/cover-image";
import { SummaryCard } from "@/components/summary-card";
import { ctaHref, ctaLabel, priceLabel, sectionItems } from "@/lib/format";
import { FLEXI_PACKS_URL, SALO_HOME, storageUrl } from "@/lib/site";
import type { ProductCard, ProductCardExample, ProductCardItem } from "@/lib/types";

const SECTIONS = [
  { key: "choose_when", title: "Choose this when" },
  { key: "approach", title: "How we do it" },
  { key: "outcome", title: "What you receive" },
] as const;

function videoEmbed(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function ItemList({ items }: { items: ProductCardItem[] }) {
  return (
    <ul className="item-list">
      {items.map((item) => (
        <li className={item.title ? "item" : "item item-plain"} key={`${item.section}-${item.sort_order}-${item.title}`}>
          {item.title ? <h3>{item.title}</h3> : null}
          {item.body ? <p>{item.body}</p> : null}
        </li>
      ))}
    </ul>
  );
}

function ExampleFigure({ example }: { example: ProductCardExample }) {
  const file = example.storage_path ? storageUrl(example.storage_path) : null;
  const embed = example.url ? videoEmbed(example.url) : null;
  const alt =
    example.kind === "logo"
      ? example.company_name || example.title || "Client logo"
      : example.title || example.caption || "Work example";

  if (example.kind === "quote") {
    return (
      <figure className="example example-quote">
        <blockquote>
          <p>{example.caption || example.title}</p>
          {example.company_name ? <footer>{example.company_name}</footer> : null}
        </blockquote>
      </figure>
    );
  }

  const media = file ? (
    example.kind === "video" ? (
      <video controls playsInline preload="metadata" src={file} aria-label={alt} />
    ) : (
      <Image src={file} alt={alt} fill sizes="(min-width: 800px) 36rem, 100vw" className="example-img" />
    )
  ) : example.kind === "video" && embed ? (
    <iframe src={embed} title={alt} allow="fullscreen; picture-in-picture" allowFullScreen />
  ) : null;

  return (
    <figure className={example.kind === "logo" ? "example example-logo" : "example"}>
      {media ? <div className="example-media">{media}</div> : null}
      <figcaption>
        {example.title ? <strong>{example.title}</strong> : null}
        {example.caption ? <span>{example.caption}</span> : null}
        {example.company_name && example.kind === "logo" ? <span>{example.company_name}</span> : null}
        {example.url ? (
          <a href={example.url} target="_blank" rel="noreferrer">
            View project
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function ProductPage({ card }: { card: ProductCard }) {
  const retired = card.status === "retired";
  const href = ctaHref(card.cta_kind, card.cta_target);
  const price = priceLabel(card);
  const examples = card.examples.slice().sort((a, b) => a.sort_order - b.sort_order);
  const terms = sectionItems(card.items, "terms");
  const faqs = sectionItems(card.items, "faq");
  const related = card.related.slice().sort((a, b) => a.sort_order - b.sort_order);

  return (
    <article className="wrap product">
      {retired ? (
        <p className="retired" role="status">
          No longer offered
        </p>
      ) : null}

      <header className="hero">
        {card.category ? <p className="eyebrow">{card.category}</p> : null}
        <h1>{card.name}</h1>
        {card.decision_statement ? <p className="lede">{card.decision_statement}</p> : null}
        {card.cover_image_url ? (
          <CoverImage
            url={card.cover_image_url}
            alt={card.cover_image_alt}
            source={card.cover_image_source}
            priority
            sizes="(min-width: 800px) 72rem, calc(100vw - 2.5rem)"
            className="hero-cover"
          />
        ) : null}
        <p className="who">
          <a href={SALO_HOME}>Salo</a> is a design studio. Senior design expertise, embedded in your team.
        </p>

        <dl className="facts">
          <div className="frame">
            <div className="frame-inner fact">
              <dt>{card.pricing_model === "flexi" ? "Credits" : "Price"}</dt>
              <dd>
                {price}
                {card.pricing_model === "flexi" && card.flexi_service_title ? (
                  <span className="fact-note">{card.flexi_service_title}</span>
                ) : null}
                {card.price_note ? <span className="fact-note">{card.price_note}</span> : null}
              </dd>
            </div>
          </div>
          <div className="frame">
            <div className="frame-inner fact">
              <dt>Timeline</dt>
              <dd>{card.timeline_text}</dd>
            </div>
          </div>
          <div className="frame">
            <div className="frame-inner fact">
              {card.pricing_model === "flexi" ? (
                <>
                  <dt>Payment</dt>
                  <dd>
                    Paid from <a href={FLEXI_PACKS_URL}>Flexi-Design credits</a>
                  </dd>
                </>
              ) : (
                <>
                  <dt>Payment</dt>
                  <dd>{card.payment_terms}</dd>
                </>
              )}
            </div>
          </div>
        </dl>
      </header>

      {SECTIONS.map((section) => {
        const items = sectionItems(card.items, section.key);
        if (items.length === 0) return null;
        return (
          <section className="section" key={section.key} aria-labelledby={section.key}>
            <h2 id={section.key}>{section.title}</h2>
            <ItemList items={items} />
          </section>
        );
      })}

      {examples.length > 0 ? (
        <section className="section" aria-labelledby="examples">
          <h2 id="examples">Work examples</h2>
          <div className="examples">
            {examples.map((example) => (
              <ExampleFigure example={example} key={`${example.kind}-${example.sort_order}-${example.title}`} />
            ))}
          </div>
        </section>
      ) : null}

      {terms.length > 0 ? (
        <section className="section" aria-labelledby="terms">
          <h2 id="terms">Terms</h2>
          <ItemList items={terms} />
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="section" aria-labelledby="faq">
          <h2 id="faq">Questions</h2>
          <div className="faq">
            {faqs.map((item) => (
              <details key={`${item.sort_order}-${item.title}`}>
                <summary>{item.title || item.body}</summary>
                {item.title && item.body ? <p>{item.body}</p> : null}
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section next-step" aria-labelledby="next">
        <h2 id="next">Next step</h2>
        {retired ? (
          <>
            <p className="next-copy">This is no longer offered.</p>
            <Button href="/">Current products</Button>
          </>
        ) : (
          <>
            <Button href={href}>{ctaLabel(card.cta_kind)}</Button>
            <p className="print-url">{href}</p>
          </>
        )}
      </section>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="related">
          <h2 id="related">Related products</h2>
          <div className="summary-list">
            {related.map((item) => (
              <SummaryCard card={item} key={item.slug} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
