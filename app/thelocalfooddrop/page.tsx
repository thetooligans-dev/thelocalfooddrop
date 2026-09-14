import Image from "next/image";
import { DeliveryLocationProvider } from "@/components/DeliveryLocation";
import { ChefCard } from "@/components/ChefCard";
import { chefs, siteConfig } from "@/data/site";

function whatsappHref(message = siteConfig.whatsappMessage) {
  const text = encodeURIComponent(message);
  return siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export default function LocalFoodDropPage() {
  const isLive = siteConfig.dropStatus === "live";
  const whatsapp = whatsappHref();
  const chefWhatsapp = whatsappHref(siteConfig.chefWhatsappMessage);
  const collaboratorWhatsapp = whatsappHref(siteConfig.collaboratorWhatsappMessage);
  const hostWhatsapp = whatsappHref(siteConfig.hostWhatsappMessage);

  return (
    <DeliveryLocationProvider><main>
      <nav className="site-nav page-shell">
        <a href="#top" className="wordmark" aria-label="The Local Food Drop home">
          The Local Food Drop
        </a>
        <div className="nav-right">
          <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">
            WhatsApp us ↗
          </a>
        </div>
      </nav>

      <section id="top" className="hero page-shell">
        <div className="hero-copy">

          <h1>
            <span className="hero-main-line hero-punch">A chef&apos;s prized dish</span>
            <span className="hero-main-line">Only if you are nearby</span>
            <span className="hero-main-line">Once it&apos;s gone, it&apos;s gone</span>
          </h1>

          {isLive ? (
            <div className="hero-actions">
              <a className="primary-button" href={siteConfig.liveOrderHref}>See this week&apos;s drop <span>↗</span></a>
              <p>Pre-orders close 24 hours before delivery.</p>
            </div>
          ) : (
            <div className="hero-whatsapp-cta">
              <a className="hero-whatsapp-button" href={whatsapp} target="_blank" rel="noreferrer">
                GET ON THE DROP LIST TODAY <span>↗</span>
              </a>
            </div>
          )}

          <div className="hero-rhythm" aria-label="Pre-order schedule">
            <span className="hero-rhythm-dot" aria-hidden="true">✦</span>
            <span>Pre-orders close 24 hours before delivery</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-doodle-wrap"><Image src="/hero-three-chefs-logo.png" alt="" width={1381} height={1139} sizes="(max-width: 768px) calc(100vw - 32px), 520px" priority className="hero-editorial-art" /></div>
          <div className="drop-stamp"><span>DROP</span><strong>01</strong><small>coming soon</small></div>
        </div>
      </section>

      <section className="ticker" aria-label="What makes a food drop different">
        <div className="ticker-track">
          <div className="ticker-item">
            <b className="ticker-star" aria-hidden="true">✦</b>
            <span>ONE CAREFUL BATCH</span>
          </div>
          <b className="ticker-divider" aria-hidden="true">✦</b>
          <div className="ticker-item">
            <b className="ticker-star" aria-hidden="true">✦</b>
            <span>ZERO INGREDIENT SHORTCUTS</span>
          </div>
          <b className="ticker-divider" aria-hidden="true">✦</b>
          <div className="ticker-item">
            <b className="ticker-star" aria-hidden="true">✦</b>
            <span>LIMITED PORTION</span>
          </div>
          <b className="ticker-divider" aria-hidden="true">✦</b>
          <div className="ticker-item">
            <b className="ticker-star" aria-hidden="true">✦</b>
            <span>NOT ON SWIGGY OR ZOMATO</span>
          </div>
        </div>
      </section>

      <section className="story-intro page-shell section-space">
        <div className="story-intro-grid">
          <div className="story-intro-title-wrap">
            <div className="story-drop-stamp" aria-label="Drop 01 coming soon">
              <span>DROP</span>
              <strong>01</strong>
              <small>coming soon</small>
            </div>
            <h2><span>Four chefs, four prized dishes</span><em>you won&apos;t find on any regular menu.</em></h2>
          </div>
          <div className="story-intro-copy">
            <p>When you strip away unnecessary commissions and 15-minute rush tickets, chefs can finally cook with the ingredients, technique, and patience they’re proud of. One careful batch each. Pre-ordered specially for you!</p>
          </div>
        </div>
      </section>

      <section className="chef-grid page-shell">
        {chefs.map((chef, index) => (
          <ChefCard key={chef.name} chef={chef} index={index} />
        ))}
      </section>

      <section id="how" className="how-wrap section-space">
        <div className="page-shell">
          <div className="how-heading">
            <div>
              <div className="section-kicker">GOOD FOOD TAKES A LITTLE PLANNING</div>
              <h2>How a food drop works, <span className="hand-note">from kitchen to table.</span></h2>
            </div>
            <p>By locking in pre-orders 24 hours before each chef cooks, kitchens eliminate food waste, skip third-party commissions, and invest every rupee directly into fresh sourcing and unhurried kitchen craft.</p>
          </div>

          <div className="calendar-strip">
            <div className="calendar-card calendar-open">
              <span className="calendar-day">TUESDAY</span>
              <strong>The menu goes live.</strong>
              <p>Browse this drop&apos;s prized dishes and reserve your plate. Portions are capped per kitchen; first come, first served.</p>
            </div>
            <div className="calendar-arrow">→</div>
            <div className="calendar-card">
              <span className="calendar-day">24H BEFORE COOKING</span>
              <strong>The kitchen locks the count.</strong>
              <p>Orders close 24 hours before cooking, or once portions are sold out. This lets them source fresh morning ingredients and begin slow marinades.</p>
            </div>
            <div className="calendar-arrow">→</div>
            <div className="calendar-card calendar-weekend">
              <span className="calendar-day">ON DROP DAY</span>
              <strong>Fresh off the stove.</strong>
              <p>Each chef drops on their specific day. Pick it up locally from their kitchen or have it delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why page-shell section-space">
        <div className="why-graphic" aria-hidden="true">
          <Image src="/plate-licking-bob-v3.png" alt="" width={1254} height={1254} sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1050px) 650px, 480px" className="why-editorial-art" />
          <span className="hand-note why-note">less squeezing. more cooking.</span>
        </div>
        <div className="why-copy">
          <div className="section-kicker">THE INGREDIENT SQUEEZE</div>
          <h2>Delivery apps sometimes take up to 50% of the bill. Guess where kitchens make up the difference?</h2>
          <p>When commissions, rent, and ad spend swallow more than half the bill, kitchens are pushed into a corner. The only place left to cut is the food itself—cheaper oils, frozen proteins, and rushed preparation.</p>
          <p>We built The Local Food Drop to flip that math. When a chef cooks one dedicated batch, every rupee goes back where it belongs: into quality ingredients, real kitchen craft, and a meal that feeds your body and nourishes your soul.</p>
        </div>
      </section>

      <section className="locality section-space">
        <div className="page-shell locality-inner">
          <div className="locality-copy">
            <div className="section-kicker">STARTING SMALL, CLOSE TO HOME</div>
            <h2>A neighbourhood-sized beginning.</h2>
            <p>For now, the drop is beginning around Margao and the neighbouring villages. As it grows, different localities will have their own drops — and eventually, there&apos;ll be one special dish from a different chef for every day of the week.</p>
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
        </div>
      </section>

      <section className="whatsapp-cta page-shell section-space">
        <div className="whatsapp-card">
          <div className="whatsapp-copy">
            <span className="hand-note">NEVER MISS A BATCH</span>
            <h2>These portions sell out fast.</h2>
            <p>Drops open on Tuesday and close as soon as portions run out. Join our private WhatsApp broadcast to get the 15-minute early heads-up before the public link goes out.</p>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="whatsapp-button">
              Get Early Drop Access on WhatsApp <span>↗</span>
            </a>
          </div>
        </div>

        <div className="join-us">
          <div className="join-us-intro">
            <h3>There is room at the table</h3>
            <span className="hand-note">Come cook this with us!</span>
          </div>

          <div className="join-us-grid">
            <article className="join-card">
              <p className="join-label">HOME CHEFS &amp; RESTAURANT CHEFS</p>
              <h4>Have a prized dish you wanted to serve but couldn&apos;t on a regular menu?</h4>
              <p>If there’s an uncompromised plate you’ve always wanted to cook—one that only makes sense in a dedicated, pre-funded batch—we handle the pre-orders and help with the logistics so you can just cook.</p>
              <a href={chefWhatsapp} target="_blank" rel="noreferrer" className="join-button">
                Let&apos;s Cook a Drop <span>↗</span>
              </a>
            </article>

            <article className="join-card">
              <p className="join-label">STORYTELLERS, DISPATCH &amp; NEIGHBOURS</p>
              <h4>It takes a neighbourhood to run an independent food drop.</h4>
              <p>We’re building an alternative to venture-backed delivery algorithms. If you shoot video, capture kitchens, run local delivery, host a neighborhood pickup spot, or want to help operate a drop—there’s a seat at the table.</p>
              <a href={collaboratorWhatsapp} target="_blank" rel="noreferrer" className="join-button">
                Build It With Us <span>↗</span>
              </a>
            </article>

            <article className="join-card">
              <p className="join-label">HOSTS &amp; LOCAL OPERATORS</p>
              <h4>Want to run a local food drop in your townsquare?</h4>
              <p>You don’t need venture capital or a tech team to fix food in your town. If you know great local chefs and want to bring this weekly batch rhythm to your locality, we’ll share our playbook, tools, and lessons to help you launch local food drops in your vicinity!</p>
              <a href={hostWhatsapp} target="_blank" rel="noreferrer" className="join-button">
                Bring It to Your City <span>↗</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="contributors page-shell" aria-labelledby="contributors-title">
        <h2 id="contributors-title" className="section-kicker">Contributors building the local food drop</h2>
        <div className="contributors-grid">
          {[
            { name: "Aaron", role: "May-err", image: "aaron" },
            { name: "Nigel", role: "Tick Talker", image: "nigel" },
            { name: "Zara", role: "Stalker", image: "zara" },
          ].map((contributor) => (
            <article className="contributor" key={contributor.name}>
              <Image src={`/contributors/${contributor.image}.webp`} alt={`Line drawing representing ${contributor.name}`} width={480} height={480} sizes="(max-width: 480px) 160px, 220px" className="contributor-portrait" />
              <h3>{contributor.name}</h3>
              <p className="contributor-role">{contributor.role}</p>
              <p className="contributor-handle">@thetownsquare.xyz</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer page-shell">
        <div>
          <p className="footer-title">The Local Food Drop</p>
          <p>Small-batch food, stories and people from around the neighbourhood.</p>
        </div>
        <div className="footer-project">
          <span>An experiment by</span>
          <a href="https://thetownsquare.xyz" target="_blank" rel="noreferrer">The Town Square Project ↗</a>
        </div>
      </footer>
    </main></DeliveryLocationProvider>
  );
}
