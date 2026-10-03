import Image from "next/image";
import aaronPortrait from "@/public/contributors/aaron.webp";
import nigelPortrait from "@/public/contributors/nigel.webp";
import { DeliveryLocationProvider } from "@/components/DeliveryLocation";
import { siteConfig } from "@/data/site";

function whatsappHref(message = siteConfig.whatsappMessage) {
  const text = encodeURIComponent(message);
  return siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export default function ProjectInfo() {
  const collaboratorWhatsapp = whatsappHref(siteConfig.collaboratorWhatsappMessage);

  return (
    <DeliveryLocationProvider><main>

      {/* §1 — THE PROBLEM */}
      <section className="why page-shell section-space">
        <div className="why-copy">
          <span className="why-note">WHOLESOME. HONEST. HOMEMADE.</span>
          <div className="why-card">
            <p style={{ marginTop: 0 }}>
              Food has become easy to get. But finding food that feels homemade with honest ingredients, intention, and love is still hard to find. Between endless menus, discounts, and free delivery, speed and convenience often come before nourishment.
            </p>
            <p>
              <strong>Food was meant to nourish your body and feed your soul energizing you to do the things you love with the people who matter most.</strong>
            </p>
            <h3 style={{
              fontFamily: "var(--font-editorial), Georgia, serif",
              fontSize: "clamp(24px, 2.8vw, 30px)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: "var(--ink)",
              margin: "32px 0 12px",
            }}>
              Homecooked with ❤️
            </h3>
            <p>
              The Local Food Drop connects you with home cooks in your town, their food, their culture, and the stories that simmer into every dish.
            </p>
            <p>
              Limited preorders help homecooks make what&apos;s needed with less waste. Fairer economics give them more control and room for better ingredients, making home cooking work better for them and for you.
            </p>
          </div>
        </div>
      </section>


      {/* §3 — NEIGHBOURHOOD */}
      <section className="locality section-space">
        <div className="page-shell locality-inner">
          <div className="locality-copy">
            <div className="section-kicker">STARTING SMALL</div>
            <h2>A <em>town</em>-sized beginning.</h2>
            <p>We&apos;re starting around Margao and nearby villages. As the drop grows, more localities get their own — and eventually, a different chef for every day of the week.</p>
          </div>
          <div className="locality-cloud" aria-label="Current and upcoming localities">
            {siteConfig.localities.map((place) => {
              if (place.active && place.pincode) {
                return (
                  <span
                    key={place.name}
                    className="locality-tag hand-note has-flip"
                    tabIndex={0}
                    role="button"
                    title={`${place.name} · PIN ${place.pincode}`}
                    aria-label={`${place.name}, postal pin code ${place.pincode}`}
                  >
                    <span className="locality-flip-inner">
                      <span className="locality-face locality-front">{place.name}</span>
                      <span className="locality-face locality-back">{place.pincode}</span>
                    </span>
                  </span>
                );
              }

              return (
                <span key={place.name} className="locality-tag future">
                  {place.name}
                </span>
              );
            })}
          </div>

          <div className="locality-project">
            <span className="locality-project-text">Learn more about The Town Square Project</span>
            <a href="https://www.thetownsquare.xyz" target="_blank" rel="noreferrer" className="locality-project-pill">
              www.thetownsquare.xyz
            </a>
          </div>
        </div>
      </section>

      {/* §4 — COME BUILD THIS */}
      <section className="whatsapp-cta page-shell section-space">
        <div className="join-us">
          <div className="join-us-intro">
            <h3>Psst Psst.. there&apos;s room at the table</h3>
            <span className="hand-note">COME COOK THIS WITH US!</span>
          </div>

          <div className="join-compact">
            <div className="join-compact-row">
              <div className="join-compact-info">
                <span className="join-label" style={{ marginBottom: "14px" }}>
                  COOKS · CREATORS · PARTNERS
                </span>
                <p>
                  We’re building a neighbourhood food collective. Whether you cook dishes, shoot content, or want to host local drops—reach out and tell us how you&apos;d like to collaborate.
                </p>
              </div>
              <a href={collaboratorWhatsapp} target="_blank" rel="noreferrer" className="join-compact-btn" style={{ marginTop: "20px" }}>
                REACH OUT ON WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* §5 — CONTRIBUTORS */}
      <section className="contributors page-shell" aria-labelledby="contributors-title">
        <h2 id="contributors-title" className="contributors-heading">Contributors building The Local Food Drop</h2>
        <div className="contributors-grid">
          {[
            { name: "Aaron", role: "May-err", image: aaronPortrait },
            { name: "Nigel", role: "Tick Talker", image: nigelPortrait },
            { name: "Zara", role: "Silent Knight", image: "/contributors/zara.webp" },
          ].map((contributor) => (
            <article className="contributor" key={contributor.name}>
              <Image src={contributor.image} alt={`Line drawing representing ${contributor.name}`} width={480} height={480} sizes="(max-width: 480px) 160px, 220px" className="contributor-portrait" />
              <h3>{contributor.name}</h3>
              <p className="contributor-role">{contributor.role}</p>
              <p className="contributor-handle">@thetownsquare.xyz</p>
            </article>
          ))}

          <article className="contributor contributor-join-card">
            <div className="contributor-join-body">
              <p className="contributor-role">NEXT CONTRIBUTOR</p>
              <h3>You?</h3>
              <p className="contributor-join-copy">
                Guided by open-source values &amp; decentralization, we believe communities are most resilient when built together. Have an idea or want to build with us?
              </p>
            </div>
            <a
              href={whatsappHref("Hey! 👋 I’d love to get in touch about The Local Food Drop / share some ideas. Can we chat?")}
              target="_blank"
              rel="noreferrer"
              className="contributor-join-btn"
            >
              GET IN TOUCH
            </a>
          </article>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer page-shell">
        <div>
          <p className="footer-title">The Local Food Drop</p>
          <p>Small-batch food, stories and people from around the Town Square.</p>
        </div>
        <div className="footer-project">
          <span>An experiment by</span>
          <a href="https://thetownsquare.xyz" target="_blank" rel="noreferrer" className="footer-project-pill">thetownsquare.xyz</a>
        </div>
      </footer>
    </main></DeliveryLocationProvider>
  );
}
