import { ContactForm } from "@/components/ContactForm";
import { NavLinks } from "@/components/NavLinks";
import { isExternal, mailHref, mapsLink, safeHref, safeImage, telHref, waHref } from "@/lib/links";
import { themeStyle } from "@/lib/theme";
import type { SiteContent } from "@/lib/types";

function Frame({
  src,
  alt,
  className,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const image = safeImage(src);
  if (!image) return <div className={`photo-fallback ${className ?? ""}`} />;
  return (
    <img
      src={image}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}

function LineLink({ href, label }: { href: string; label: string }) {
  if (!href || !label.trim()) return null;
  const external = isExternal(href);
  return (
    <a className="btn-line" href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {label}
    </a>
  );
}

export function SiteView({ content }: { content: SiteContent }) {
  const showBar = Boolean(content.header.brand.trim() || content.header.nav.some((item) => item.label && item.href));
  const cityLine = [content.contact.postalCode, content.contact.city].filter(Boolean).join(" ");
  const mapHref = safeHref(content.contact.mapsUrl) || mapsLink(content.contact.street, content.contact.postalCode, content.contact.city);
  const phoneHref = telHref(content.contact.phone);
  const phone2Href = telHref(content.contact.phone2);
  const emailHref = mailHref(content.contact.email);
  const whatsappHref = waHref(content.contact.whatsappNumber);
  const bandHref = safeHref(content.about.bandButtonHref);

  return (
    <div className={showBar ? "site" : "site no-bar"} style={themeStyle(content.colors)}>
      <a className="skip" href="#uslugi">
        Przejdź do treści
      </a>
      {showBar ? (
        <header className="topbar">
          <div className="wrap topbar-inner">
            {content.header.brand.trim() ? (
              <a className="brand" href="#strona">
                {content.header.brand}
              </a>
            ) : null}
            <NavLinks items={content.header.nav} />
          </div>
        </header>
      ) : null}

      <main>
        {content.hero.visible ? (
          <section className="hero" id="strona">
            <Frame src={content.hero.image} alt={content.hero.imageAlt || content.hero.title} className="hero-img" priority />
            <div className="hero-shade" />
            <div className="wrap hero-inner">
              {content.hero.title ? <h1 className="hero-title">{content.hero.title}</h1> : null}
              {content.hero.subtitle ? <p className="hero-sub">{content.hero.subtitle}</p> : null}
            </div>
          </section>
        ) : null}

        {content.services.visible ? (
          <section className="section" id="uslugi">
            <div className="wrap">
              {content.services.title ? <h2 className="section-title">{content.services.title}</h2> : null}
              {content.services.intro ? <p className="lead pre">{content.services.intro}</p> : null}
              <div className="services-grid">
                {content.services.items.map((item) => (
                  <article className="service-card" key={item.id}>
                    <div className="media service-media">
                      <Frame src={item.image} alt={item.imageAlt || item.title} />
                    </div>
                    {item.number ? <p className="service-no">{item.number}</p> : null}
                    {item.title ? <h3>{item.title}</h3> : null}
                    {item.description ? <p className="pre">{item.description}</p> : null}
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {content.about.visible ? (
          <section id="o-nas">
            <div className="band">
              <div className="wrap band-grid">
                {content.about.bandTitle ? <h2 className="section-title band-title">{content.about.bandTitle}</h2> : <span />}
                <div className="band-copy">
                  {content.about.bandText ? <p className="pre">{content.about.bandText}</p> : null}
                  {bandHref && content.about.bandButtonLabel.trim() ? (
                    <a className="btn-line" href={bandHref}>
                      {content.about.bandButtonLabel}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="section why-section">
              <div className="wrap">
                {content.about.title ? (
                  <h2 className="section-title" id="dlaczego">
                    {content.about.title}
                  </h2>
                ) : null}
                {content.about.intro ? <p className="lead pre">{content.about.intro}</p> : null}
                <div className="why-list">
                  {content.about.items.map((item) => (
                    <article className="why" key={item.id}>
                      <div className="why-copy">
                        <span className="why-no">{item.number}</span>
                        <h3>{item.title}</h3>
                        {item.description ? <p className="pre">{item.description}</p> : null}
                      </div>
                      <div className="media why-media">
                        <Frame src={item.image} alt={item.imageAlt || item.title} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {content.projects.visible ? (
          <section className="section" id="realizacje">
            <div className="wrap">
              {content.projects.title ? <h2 className="section-title">{content.projects.title}</h2> : null}
              {content.projects.intro ? <p className="lead pre">{content.projects.intro}</p> : null}
              <div className="project-list">
                {content.projects.items.map((item, index) => (
                  <article className={index % 2 === 1 ? "project reverse" : "project"} key={item.id}>
                    <div className="media project-media">
                      <Frame src={item.image} alt={item.imageAlt || item.title} />
                    </div>
                    <div className="project-copy">
                      {item.number ? <p className="project-no">{item.number}</p> : null}
                      {item.title ? <h3>{item.title}</h3> : null}
                      {item.description ? <p className="pre">{item.description}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {content.contact.visible ? (
        <footer className="contact" id="kontakt">
          <div className="wrap contact-grid">
            <div>
              <h2 className="visually-hidden">Kontakt</h2>
              {content.contact.brand ? <p className="contact-brand">{content.contact.brand}</p> : null}
              {content.contact.subtitle ? <p className="contact-kicker">{content.contact.subtitle}</p> : null}
              {content.contact.tagline ? <p className="tagline pre">{content.contact.tagline}</p> : null}
              {content.contact.companyName ? <p className="company">{content.contact.companyName}</p> : null}
              {content.contact.street || cityLine ? (
                <p className="addr">
                  <a href={mapHref} target="_blank" rel="noreferrer">
                    {content.contact.street}
                    {content.contact.street && cityLine ? <br /> : null}
                    {cityLine}
                  </a>
                </p>
              ) : null}
              <div className="contact-actions">
                <LineLink href={phoneHref} label={content.contact.phoneLabel || content.contact.phone} />
                <LineLink href={phone2Href} label={content.contact.phone2Label || content.contact.phone2} />
                <LineLink href={emailHref} label={content.contact.emailLabel} />
                <LineLink href={safeHref(content.contact.facebookUrl)} label={content.contact.facebookLabel} />
                <LineLink href={safeHref(content.contact.instagramUrl)} label={content.contact.instagramLabel} />
              </div>
            </div>
            <ContactForm
              title={content.contact.formTitle}
              nameLabel={content.contact.formNameLabel}
              emailLabel={content.contact.formEmailLabel}
              messageLabel={content.contact.formMessageLabel}
              submitLabel={content.contact.formSubmitLabel}
              success={content.contact.formSuccess}
              note={content.contact.formNote}
            />
          </div>
          <div className="wrap contact-bottom">
            {[content.contact.companyName, [content.contact.street, cityLine].filter(Boolean).join(", ")]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </footer>
      ) : null}

      {whatsappHref ? (
        <a className="wa" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={content.contact.whatsappLabel || "WhatsApp"}>
          <img src="/whatsapp.jpg" alt="" />
        </a>
      ) : null}
    </div>
  );
}
