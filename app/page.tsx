import BookingForm from "./components/BookingForm";
import SiteHeader from "./components/SiteHeader";
import SystemThemeIndicator from "./components/SystemThemeIndicator";
import Image from "next/image";

const services = [
  {
    number: "01",
    title: "Full-service event bars",
    text: "A complete mobile bar experience for weddings, private celebrations, corporate gatherings, and mountain retreats.",
    details: ["Professional bartending", "Event-day service flow", "Menu and glassware guidance"],
  },
  {
    number: "02",
    title: "Signature cocktail stations",
    text: "A focused menu of event-specific cocktails designed around the season, setting, and people you are bringing together.",
    details: ["Custom cocktail direction", "Batching and garnish planning", "Polished menu presentation"],
  },
  {
    number: "03",
    title: "Welcome drinks",
    text: "A considered first pour for ceremonies, receptions, retreats, and guest arrivals where timing and presentation matter.",
    details: ["Arrival-service planning", "Alcoholic and zero-proof options", "Venue-aware setup guidance"],
  },
  {
    number: "04",
    title: "Zero-proof programs",
    text: "Balanced non-alcoholic cocktails with the same attention to flavour, structure, garnish, and presentation as the full menu.",
    details: ["Inclusive drink menus", "Seasonal ingredients", "Intentional presentation"],
  },
];

const processSteps = [
  { title: "Tell us about the event", text: "Share the venue, date, guest count, service style, and the atmosphere you want to create." },
  { title: "Shape the service", text: "We align the bar format, menu direction, staffing, timing, and venue requirements." },
  { title: "Refine the details", text: "Cocktails, zero-proof options, batching, garnish, glassware, and service flow are dialed in." },
  { title: "Host with confidence", text: "The bar experience arrives prepared, composed, and ready for the pace of your event." },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Image
              src="/og-v2.png"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-content">
              <p className="eyebrow eyebrow-light">Mobile bar experiences · Canmore, Alberta</p>
              <h1 id="hero-title">Mountain<br />Mixology</h1>
              <p className="hero-copy">
                Cocktail catering shaped for weddings, retreats, private dinners, and
                celebrations across Canmore, Banff, Kananaskis, and the Bow Valley.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#booking">Start an inquiry</a>
                <a className="button button-quiet" href="#services">Explore services</a>
              </div>
            </div>

            <dl className="hero-facts" aria-label="Service highlights">
              <div>
                <dt>Based in</dt>
                <dd>Canmore, Alberta</dd>
              </div>
              <div>
                <dt>Designed for</dt>
                <dd>Mountain events</dd>
              </div>
              <div>
                <dt>Service style</dt>
                <dd>Tailored and host-ready</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="positioning-band" aria-label="Mountain Mixology approach">
          <p>Locally based. Venue-aware. Built around the way your event should feel.</p>
          <span>Premium cocktail catering throughout the Bow Valley</span>
        </section>

        <section className="section services-section" id="services" aria-labelledby="services-title">
          <div className="section-intro">
            <p className="eyebrow">Services</p>
            <h2 id="services-title">A bar program that belongs at your event.</h2>
            <p>
              The best event bars feel effortless to guests because the planning underneath
              is precise. Every service is shaped around your venue, timing, guest profile,
              and the kind of gathering you are hosting.
            </p>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article className="service-item" key={service.title}>
                <span className="service-number" aria-hidden="true">{service.number}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
                <ul aria-label={`${service.title} includes`}>
                  {service.details.map((detail) => <li key={detail}>{detail}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="section approach-inner">
            <div className="approach-heading">
              <p className="eyebrow eyebrow-light">How it comes together</p>
              <h2 id="approach-title">Calm planning.<br />Polished service.</h2>
              <p>
                From the first venue detail to the last pour, the process stays clear,
                collaborative, and grounded in real event logistics.
              </p>
            </div>

            <ol className="process-list">
              {processSteps.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="booking-section" id="booking" aria-labelledby="booking-title">
          <div className="section booking-layout">
            <div className="booking-copy">
              <p className="eyebrow eyebrow-light">Start planning</p>
              <h2 id="booking-title">Tell us what you are bringing together.</h2>
              <p>
                Share the practical details and the feeling you want to create. We will use
                your inquiry to understand the service fit, scope, and next conversation.
              </p>
              <div className="booking-note">
                <strong>What helps us scope your event</strong>
                <ul>
                  <li>Date, venue, and guest count</li>
                  <li>Preferred bar or cocktail format</li>
                  <li>Drink direction and zero-proof needs</li>
                  <li>Venue rules or timing constraints</li>
                </ul>
              </div>
              <a className="email-link" href="mailto:mountainmixologyca@gmail.com">
                mountainmixologyca@gmail.com
              </a>
            </div>
            <BookingForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="footer-brand" href="#top">Mountain Mixology</a>
          <p>Premium cocktail catering in Canmore, Alberta, and the surrounding mountain communities.</p>
          <div className="footer-meta">
            <span>Canmore · Alberta · Canada</span>
            <a href="mailto:mountainmixologyca@gmail.com">Email us</a>
            <a href="#booking">Booking inquiry</a>
            <SystemThemeIndicator />
          </div>
        </div>
      </footer>
    </>
  );
}
