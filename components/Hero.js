// Home page banner: the orange MAntor wordmark with its burst lines, then the tagline band.
import { APP_NAME, HERO_TAGLINE } from "@/lib/config";

export default function Hero() {
  return (
    <section className="hero-banner bleed">
      <div className="hero-top">
        <div className="wordmark">
          <svg className="ray ray-tl" viewBox="0 0 50 50" aria-hidden="true">
            <polygon points="0,8 8,0 50,50" />
          </svg>
          <svg className="ray ray-tr" viewBox="0 0 110 125" aria-hidden="true">
            <polygon points="75,0 110,28 10,125 0,117" />
          </svg>
          <svg className="ray ray-bl" viewBox="0 0 76 66" aria-hidden="true">
            <polygon points="0,48 14,66 76,8 72,0" />
          </svg>
          <svg className="ray ray-br" viewBox="0 0 76 68" aria-hidden="true">
            <polygon points="4,0 0,8 56,68 76,44" />
          </svg>
          <div className="wordmark-text">{APP_NAME}</div>
        </div>
      </div>
      <div className="hero-band">
        <p>{HERO_TAGLINE}</p>
      </div>
    </section>
  );
}
