import Image from "next/image";
import { DeliveryLocationProvider } from "@/components/DeliveryLocation";
import { siteConfig } from "@/data/site";

function whatsappHref(message = siteConfig.whatsappMessage) {
  const text = encodeURIComponent(message);
  return siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export default function ProjectInfo() {
  const whatsapp = whatsappHref();
  const chefWhatsapp = whatsappHref(siteConfig.chefWhatsappMessage);
  const collaboratorWhatsapp = whatsappHref(siteConfig.collaboratorWhatsappMessage);
  const hostWhatsapp = whatsappHref(siteConfig.hostWhatsappMessage);

  return (
    <DeliveryLocationProvider><main>

      {/* §1 — THE PROBLEM */}
      <section className="why page-shell section-space">
        <div className="why-graphic" aria-hidden="true">
          <Image src="/plate-licking-bob-v5.png" alt="" width={639} height={637} sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1050px) 650px, 480px" className="why-editorial-art" />
          <span className="why-note">LESS SQUEEZING. MORE COOKING.</span>
        </div>
        <div className="why-copy">
          <h2 className="why-title-main">Did you know?</h2>
          <div className="why-card">
            <p className="why-stat-line">Delivery apps, platform ads and commissions can eat up 28% to 70% of what you pay for a dish.</p>
            <p>When chefs are forced to absorb these massive commissions, the only way to make the math work is by compromising on quality &amp; ingredients and simplifying what they can cook. Instead of perfecting their culinary craft, chefs are trapped performing for algorithms — <strong>twerking, dancing, entertaining, and pulling stunts on camera chasing views, likes, shares &amp; virality — just to sell a plate.</strong> Somewhere in all this madness, cooking genuinely wholesome food stopped being what mattered.</p>
            <p>The Local Food Drop aims to flip that math, putting chefs back in control with complete honesty and transparency. <strong>Food should be about feeding your body and nourishing your soul — energizing you to do what you love with the people who matter most.</strong></p>
            <p>We hope that through the local food drop, you get to taste what that actually feels like.</p>
          </div>
        </div>
      </section>

      {/* §2 — HOW IT WORKS */}
      <section id="how" className="how-wrap section-space">
        <div className="page-shell">
          <div className="how-heading">
            <div>
              <h2>How the local food drop works.</h2>
            </div>
          </div>

          <ol className="how-compact">
            <li>
              <div className="how-step-content">
                <strong>Pre-orders open</strong>
                <span>Browse dishes and reserve your plate. Portions are capped.</span>
              </div>
            </li>
            <li>
              <div className="how-step-content">
                <strong>Pre-orders close</strong>
                <span>Orders close 24 hours prior so chefs can prep and cook fresh.</span>
              </div>
            </li>
            <li>
              <div className="how-step-content">
                <strong>Drop day</strong>
                <span>Delivered straight to your door or ready for self-pickup.</span>
              </div>
            </li>
          </ol>
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
                <p className="join-label">RESTAURANT &amp; HOME CHEFS</p>
                <p>Have a prized dish that doesn&apos;t fit a regular menu? We handle the pre-orders so you can just cook.</p>
              </div>
              <a href={chefWhatsapp} target="_blank" rel="noreferrer" className="join-compact-btn">
                Tell us more
              </a>
            </div>

            <div className="join-compact-row">
              <div className="join-compact-info">
                <p className="join-label">CREATORS &amp; ENTREPRENEURS</p>
                <p>Shoot video, run delivery, host a pickup spot — there&apos;s a seat at the table.</p>
              </div>
              <a href={collaboratorWhatsapp} target="_blank" rel="noreferrer" className="join-compact-btn">
                Get involved
              </a>
            </div>

            <div className="join-compact-row">
              <div className="join-compact-info">
                <p className="join-label">FOOD INFLUENCERS &amp; CURATORS</p>
                <p>Want to bring food drops to your town? We&apos;ll share the playbook.</p>
              </div>
              <a href={hostWhatsapp} target="_blank" rel="noreferrer" className="join-compact-btn">
                Start a drop
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* §5 — CONTRIBUTORS */}
      <section className="contributors page-shell" aria-labelledby="contributors-title">
        <h2 id="contributors-title" className="contributors-heading">Contributors building the local food drop</h2>
        <div className="contributors-grid">
          {[
            { name: "Aaron", role: "May-err", image: "aaron" },
            { name: "Nigel", role: "Tick Talker", image: "nigel" },
            { name: "Zara", role: "Silent Knight", image: "zara" },
          ].map((contributor) => (
            <article className="contributor" key={contributor.name}>
              <Image src={`/contributors/${contributor.image}.webp`} alt={`Line drawing representing ${contributor.name}`} width={480} height={480} sizes="(max-width: 480px) 160px, 220px" className="contributor-portrait" />
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
