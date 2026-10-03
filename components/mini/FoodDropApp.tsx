"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { chefs, siteConfig } from "@/data/site";
import { Rupee } from "@/components/Rupee";

type Chef = (typeof chefs)[number] & { specialty?: string; background?: string; interests?: string; pickupTime?: string; pickupMapsLabel?: string; pickupMapsNote?: string };
type Sheet = { type: "order" | "chef"; index: number } | { type: "about" } | null;
type Order = { quantity: number; method: "pickup" | "delivery" | null; slot: string; pin: string; savedPin: string; address: string; savedAddress: string; editingPin: boolean; editingAddress: boolean; error: string };
const newOrder = (): Order => ({ quantity: 1, method: null, slot: "4pm to 6pm", pin: "", savedPin: "", address: "", savedAddress: "", editingPin: false, editingAddress: false, error: "" });
const slots = ["10am to 12pm", "4pm to 6pm"];
function whatsapp(message: string) { return `https://wa.me/${siteConfig.whatsappNumber || ""}?text=${encodeURIComponent(message)}`; }
function formatDietaryTag(dietary?: string) {
  if (!dietary) return "";
  const cleaned = dietary.replace(/\s+dish\b/gi, "").trim();
  if (/^non-vegetarian$/i.test(cleaned)) return "Non-Veg";
  if (/^vegetarian$/i.test(cleaned)) return "Veg";
  return cleaned;
}
function getPickupTime(chef: Chef) {
  if (chef.pickupTime) return chef.pickupTime;
  if (chef.pickupDate && chef.pickupDate.includes("·")) {
    return chef.pickupDate.split("·")[1].trim();
  }
  return "6:30–8 PM";
}

export function FoodDropApp({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const [closing, setClosing] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => chefs.map(newOrder));
  const modal = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const historyOpen = useRef(false);
  const sheetRef = useRef(sheet);
  sheetRef.current = sheet;

  // A sheet is a browser-history step: device Back dismisses it, never loses the menu.
  useEffect(() => {
    const pop = () => { historyOpen.current = false; setClosing(false); setSheet(null); };
    window.addEventListener("popstate", pop);
    return () => { window.removeEventListener("popstate", pop); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);
  useEffect(() => {
    const dialog = modal.current;
    if (sheet) {
      if (dialog && !dialog.open) dialog.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previous; };
    }
    if (dialog?.open) dialog.close();
    trigger.current?.focus({ preventScroll: true });
  }, [sheet]);

  function open(next: Exclude<Sheet, null>) {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    if (!sheetRef.current) {
      trigger.current = document.activeElement as HTMLElement;
      window.history.pushState({ foodDropSheet: true }, "");
      historyOpen.current = true;
    }
    setClosing(false); setSheet(next);
    requestAnimationFrame(() => { modal.current?.querySelector(".fd-sheet-scroll")?.scrollTo(0, 0); });
  }
  function close() {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      if (historyOpen.current) { historyOpen.current = false; window.history.back(); }
      else { setSheet(null); setClosing(false); }
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 190);
  }
  const index = sheet && sheet.type !== "about" ? sheet.index : 0;
  const chef: Chef = chefs[index];
  const order = orders[index];
  const patch = (change: Partial<Order>) => setOrders(current => current.map((value, i) => i === index ? { ...value, ...change } : value));
  const fee = order.method === "delivery" ? 60 : 0;
  const total = order.quantity * chef.price + fee;
  const max = Number(chef.portions.match(/\d+/)?.[0] || 20);
  const validDelivery = Boolean(order.savedPin && order.savedAddress && !order.editingPin && !order.editingAddress);
  const orderMessage = [
    `Hey! 👋 I'd like to order *${chef.dish.replace(/\n/g, " ")}* by ${chef.name}:`,
    `• Portions: *${order.quantity}* (₹${order.quantity * chef.price})`,
    `• Method: *${order.method === "delivery" ? "Doorstep Delivery (Rs 60 extra per order)" : "Pick it up yourself"}*`,
    order.method === "pickup"
      ? `• Pickup Date & Time: ${chef.pickupDay}, ${chef.pickupDate.includes("·") ? chef.pickupDate : `${chef.pickupDate} · ${getPickupTime(chef)}`}`
      : `• Delivery Date & Time: ${chef.pickupDay}, ${chef.pickupDate.includes("·") ? chef.pickupDate : `${chef.pickupDate} · ${getPickupTime(chef)}`}`,
    `• *Total to Pay: ₹${total}*`, "• Note: Pre-orders once placed cannot be cancelled", "", "Please share the payment details to confirm my order!",
  ].join("\n");

  // ── Browse-by filters ──
  type ViewMode = "dishes" | "chefs";
  const [viewMode, setViewMode] = useState<ViewMode>("dishes");
  
  type Diet = "all" | "Veg" | "Non-Veg" | "Eggetarian" | "Vegan" | "Dairy-Free" | "Gluten Free";
  type Spice = "all" | "Not spicy" | "Mildly spicy" | "Very spicy";
  const [diet, setDiet] = useState<Diet>("all");
  const [spice, setSpice] = useState<Spice>("all");
  
  const [sortMode, setSortMode] = useState<"date" | "price">("date");
  const [showMore, setShowMore] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<"diet" | "spice" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Rotating intro phrases
  const INTRO_PHRASES = [
    "available in limited portions",
    "pre-orders close when portions run out",
    "self pick up available",
    "home delivery in select locations",
    "made with honest ingredients",
    "cooked with care & love",
    "once it's gone, it's gone"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % INTRO_PHRASES.length);
        setIsFading(false);
      }, 400); // fade out duration before swapping
    }, 2800); // time each phrase stays visible
    return () => clearInterval(interval);
  }, [INTRO_PHRASES.length]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!activeDropdown) return;
    const handler = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setActiveDropdown(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeDropdown]);

  const clearAll = () => { setDiet("all"); setSpice("all"); setSortMode("date"); setViewMode("dishes"); setActiveDropdown(null); };

  const filtered = chefs
    .map((c, i) => ({ chef: c, index: i }))
    .filter(({ chef: c }) => {
      if (diet !== "all") {
        if (diet === "Veg" && c.dietary !== "Vegetarian" && c.dietary !== "Veg" && c.dietary !== "Vegetarian Dish") return false;
        if (diet === "Vegan" && c.dietary !== "Vegan" && c.dietary !== "Vegan Dish") return false;
        if (diet === "Non-Veg" && c.dietary !== "Non-Veg" && c.dietary !== "Non veg" && c.dietary !== "Non-Vegetarian" && c.dietary !== "Non-Vegetarian Dish") return false;
        if (["Eggetarian", "Dairy-Free / Lactose-Free", "Gluten Free"].includes(diet)) return false;
      }
      if (spice !== "all" && c.spice !== spice) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortMode) return 0;
      if (sortMode === "price") {
        if (a.chef.price !== b.chef.price) {
          return a.chef.price - b.chef.price;
        }
        return a.index - b.index;
      }
      if (sortMode === "date") {
        const parseD = (s: string) => {
          if (!s) return 0;
          const [d, m] = s.trim().split(" ");
          const ms: Record<string, number> = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
          return new Date(2026, ms[m] ?? 0, parseInt(d, 10)).getTime();
        };
        const da = parseD(a.chef.pickupDate || "");
        const db = parseD(b.chef.pickupDate || "");
        if (da !== db) return da - db;
        return a.index - b.index;
      }
      return 0;
    });

  return <div className="fd-app">
    <main id="drop" className="fd-main">
      <section className="fd-intro">
        <div className="fd-intro-left">
          <div className="fd-intro-logo">
            <Image src="/branding/logo.png" alt="The Local Food Drop logo" width={110} height={110} priority />
          </div>
          <div className="fd-intro-text">
            <h1 className="fd-intro-heading">Homemade dishes from around the town</h1>
            <div className="fd-rotating-wrap">
              <p className={`fd-rotating-phrase ${isFading ? "fd-phrase-hidden" : ""}`}>
                {INTRO_PHRASES[phraseIndex]}
              </p>
            </div>
            <div className="fd-early-access">
              <a href={whatsapp(siteConfig.whatsappMessage)} target="_blank" rel="noreferrer" className="fd-topbar-cta">
                Be the first to know on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse-by filter bar ── */}
      <nav className="fd-filters" aria-label="Browse dishes by" ref={dropdownRef}>
        <div className="fd-filter-row">
          <div className="fd-filter-group">
            <div
              className={`fd-slider-pill fd-slider-view ${viewMode === "chefs" ? "fd-slider-right" : "fd-slider-left"}`}
              role="group"
              aria-label="View mode"
            >
              <div className="fd-slider-track">
                <span className="fd-slider-indicator" aria-hidden="true" />
                <button
                  type="button"
                  className={`fd-slider-btn ${viewMode === "dishes" ? "fd-btn-active" : ""}`}
                  onClick={() => {
                    setViewMode("dishes");
                    setActiveDropdown(null);
                  }}
                  aria-pressed={viewMode === "dishes"}
                >
                  By Dish
                </button>
                <button
                  type="button"
                  className={`fd-slider-btn ${viewMode === "chefs" ? "fd-btn-active" : ""}`}
                  onClick={() => {
                    setViewMode("chefs");
                    setActiveDropdown(null);
                  }}
                  aria-pressed={viewMode === "chefs"}
                >
                  By Cook
                </button>
              </div>
            </div>
            <div
              className={`fd-slider-pill fd-slider-sort ${sortMode === "price" ? "fd-slider-right" : "fd-slider-left"}`}
              role="group"
              aria-label="Sort order"
            >
              <div className="fd-slider-track">
                <span className="fd-slider-indicator" aria-hidden="true" />
                <button
                  type="button"
                  className={`fd-slider-btn ${sortMode !== "price" ? "fd-btn-active" : ""}`}
                  onClick={() => {
                    setSortMode("date");
                    setActiveDropdown(null);
                  }}
                  aria-pressed={sortMode !== "price"}
                >
                  Date
                </button>
                <button
                  type="button"
                  className={`fd-slider-btn ${sortMode === "price" ? "fd-btn-active" : ""}`}
                  onClick={() => {
                    setSortMode("price");
                    setActiveDropdown(null);
                  }}
                  aria-pressed={sortMode === "price"}
                >
                  Price
                </button>
              </div>
            </div>
          </div>
          <span className="fd-filter-sep" aria-hidden="true">·</span>
          <button
            type="button"
            className={`fd-filter-icon-btn ${showMore || diet !== "all" || spice !== "all" ? "fd-filter-active" : ""}`}
            onClick={() => setShowMore(prev => !prev)}
            aria-label={showMore ? "Hide filters" : "Show filters"}
            aria-expanded={showMore}
          >
            <svg width="15.5" height="15.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="3 4, 21 4, 13.5 12, 13.5 20, 10.5 18, 10.5 12" />
            </svg>
          </button>
        </div>

        {showMore && (
          <div className="fd-filter-sub-row">
            <div className="fd-filter-more-wrap">
              <button className={`fd-filter-chip fd-filter-more ${diet !== "all" ? "fd-filter-active" : ""}`} onClick={() => setActiveDropdown(activeDropdown === "diet" ? null : "diet")}>{diet === "all" ? "Diet" : diet} {activeDropdown === "diet" ? "↑" : "↓"}</button>
              {activeDropdown === "diet" && <div className="fd-filter-dropdown">
                <div className="fd-filter-section">
                  <div className="fd-filter-options">
                    {(["all", "Veg", "Non-Veg", "Eggetarian", "Vegan", "Dairy-Free", "Gluten Free"] as Diet[]).map(d => 
                      <button key={d} className={`fd-filter-option ${diet === d ? "fd-filter-active" : ""}`} onClick={() => { setDiet(d); setActiveDropdown(null); }}>{d === "all" ? "Any diet" : d}</button>
                    )}
                  </div>
                </div>
              </div>}
            </div>
            <div className="fd-filter-more-wrap">
              <button className={`fd-filter-chip fd-filter-more ${spice !== "all" ? "fd-filter-active" : ""}`} onClick={() => setActiveDropdown(activeDropdown === "spice" ? null : "spice")}>{spice === "all" ? "Spice" : spice} {activeDropdown === "spice" ? "↑" : "↓"}</button>
              {activeDropdown === "spice" && <div className="fd-filter-dropdown">
                <div className="fd-filter-section">
                  <div className="fd-filter-options">
                    {(["all", "Not spicy", "Mildly spicy", "Very spicy"] as Spice[]).map(s => 
                      <button key={s} className={`fd-filter-option ${spice === s ? "fd-filter-active" : ""}`} onClick={() => { setSpice(s); setActiveDropdown(null); }}>{s === "all" ? "All" : s}</button>
                    )}
                  </div>
                </div>
              </div>}
            </div>
            {(diet !== "all" || spice !== "all") && (
              <button
                type="button"
                className="fd-filter-clear-selected"
                aria-label="Clear diet and spice filters"
                onClick={() => { setDiet("all"); setSpice("all"); setActiveDropdown(null); }}
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        )}
      </nav>

      <section className="fd-lineup" aria-label={viewMode === "dishes" ? "Chef dish lineup" : "Chef profiles"}>
        {filtered.length === 0 && <p className="fd-empty">No matches found for your filters. <button onClick={clearAll}>Show all</button></p>}
        {viewMode === "dishes" ? (
          <>
            {filtered.map(({ chef: item, index: i }) => {
              const profile: Chef = item;
              return <article className="fd-card" key={item.name}>
                <button className="fd-card-chef-header" onClick={() => open({ type: "chef", index: i })} aria-label={`Meet ${item.name}`}>
                  <div className="fd-card-chef-left">
                    <span className="fd-card-chef-avatar-frame"><Image src={item.chefImage} alt="" width={40} height={40} className="fd-card-chef-avatar" style={item.name === "Anne" ? { objectPosition: "right center", transform: "scale(1.2)", transformOrigin: "62% 48%" } : undefined} /></span>
                    <div className="fd-card-chef-info">
                      <span className="fd-card-chef-kicker">From the kitchen of</span>
                      <strong className="fd-card-chef-name">{item.name}</strong>
                    </div>
                  </div>
                  <span className="fd-card-chef-link">Meet the cook</span>
                </button>
                <div className="fd-photo"><Image src={item.image} alt={item.dish.replace(/\n/g, " ")} fill priority={i === 0} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  <div className="fd-schedule" aria-label="Pre-order deadline and drop date">
                    <div className="fd-schedule-row"><span>Pre-orders close</span><strong>{item.closeDay ? `${item.closeDay}, ${item.preorderDate}` : item.preorderDate}</strong></div>
                    <div className="fd-schedule-row"><span>Drops on</span><strong>{item.pickupDay}, {item.pickupDate.split("·")[0].trim()} · {getPickupTime(item)}</strong></div>
                  </div>
                </div>
                <div className="fd-card-body">
                  <h2>{item.dish}</h2>
                  <p className="fd-card-desc">{item.ingredients}</p>
                  <div className="fd-card-tags">
                    <span>{formatDietaryTag(item.dietary)}</span>
                    <span>{profile.spice || "Spice level soon"}</span>
                  </div>
                  {item.allergens && (
                    <p className="fd-card-allergens">Allergens: {item.allergens.toLowerCase()}</p>
                  )}
                  <div className="fd-card-footer">
                    <div className="fd-card-price-block">
                      <p className="fd-price"><Rupee />{item.price}</p>
                      <p className="fd-price-sub">{item.portions}</p>
                    </div>
                    <button className="fd-order-button" onClick={() => open({ type: "order", index: i })}>Order dish</button>
                  </div>
                </div>
              </article>;
            })}
            <article className="fd-card fd-invite-card">
              <div className="fd-invite-inner">
                <p className="fd-invite-kicker">This could be you</p>
                <h2 className="fd-invite-title">Are you a home cook that loves preparing good food?</h2>
                <div className="fd-invite-body">
                  <p>Home-cooked meals hit differently. They’re healthier, made with real care, and you can feel the love in every portion.</p>
                  <p>We connect cooks who love to cook with neighbors who crave authentic, soulful food.</p>
                </div>
                <div className="fd-invite-footer">
                  <a
                    href={whatsapp(siteConfig.homeCookWhatsappMessage || siteConfig.chefWhatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="fd-invite-btn"
                  >
                    <span>What’s your dish?</span>
                  </a>
                </div>
              </div>
            </article>
          </>
        ) : (
          <>
            {filtered.map(({ chef: item, index: i }) => {
              return <article className="fd-card" key={item.name}>
                <div className="fd-photo fd-chef-card-photo" style={{ height: "340px" }}>
                  <Image
                    src={item.chefImage}
                    alt={item.name}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    style={item.name === "Anne" ? { objectPosition: "right center", transform: "scale(1.2)", transformOrigin: "62% 48%" } : { objectPosition: "top center" }}
                  />
                </div>
                <div className="fd-card-body" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <p className="fd-kicker">Meet the cook</p>
                  <h2 style={{ fontSize: "32px", marginBottom: "8px" }}>{item.name}</h2>
                  <p style={{ fontSize: "14px", color: "var(--fd-muted)", lineHeight: 1.5, margin: "0 0 18px" }}>
                    {item.whatKeepsMeCurious || "Local markets, long walks, and the everyday stories behind familiar ingredients."}
                  </p>
                  
                  <div className="fd-card-chef-notes" style={{ background: "var(--fd-cream)", padding: "16px", borderRadius: "14px", marginBottom: "20px" }}>
                    <div className="fd-card-chef-notes-image">
                      <Image src={item.image} alt={item.dish.replace(/\n/g, " ")} fill style={{ objectFit: "cover" }} sizes="112px" />
                    </div>
                    <p className="fd-kicker" style={{ marginBottom: "2px" }}>Cook’s notes</p>
                    <h3 className="fd-card-chef-notes-title">{item.dish.replace(/\n/g, " ")}</h3>
                    <p className="fd-card-chef-notes-price"><Rupee />{item.price} per portion</p>
                    <div className="fd-card-tags fd-card-chef-notes-tags">
                      <span>{formatDietaryTag(item.dietary)}</span>
                      <span>{item.spice}</span>
                    </div>
                    <p className="fd-card-chef-notes-description" style={{ fontSize: "14px", lineHeight: 1.5, margin: 0, color: "#403e37" }}>“{item.tonightDishQuote || item.line}”</p>
                  </div>
                  <div className="fd-card-actions" style={{ marginTop: "auto" }}>
                    <button className="fd-order-button" style={{ width: "100%", textAlign: "center" }} onClick={() => open({ type: "order", index: i })}>Order dish</button>
                  </div>
                </div>
              </article>;
            })}
            <article className="fd-card fd-invite-card">
              <div className="fd-invite-inner">
                <p className="fd-invite-kicker">This could be you</p>
                <h2 className="fd-invite-title">Are you a home cook that loves preparing good food?</h2>
                <div className="fd-invite-body">
                  <p>Home-cooked meals hit differently. They’re healthier, made with real care, and you can feel the love in every portion.</p>
                  <p>We connect cooks who love to cook with neighbors who crave authentic, soulful food.</p>
                </div>
                <div className="fd-invite-footer">
                  <a
                    href={whatsapp(siteConfig.homeCookWhatsappMessage || siteConfig.chefWhatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="fd-invite-btn"
                  >
                    <span>What’s your dish?</span>
                  </a>
                </div>
              </div>
            </article>
          </>
        )}
      </section>
      <footer className="fd-footer"><div className="fd-footer-actions"><button onClick={() => open({ type: "about" })}>Learn about the Local Food Drop</button></div><span>Small-batch food, stories and people<br />from around the town square.</span><div className="fd-footer-project"><span>An experiment by</span><a href="https://thetownsquare.xyz" target="_blank" rel="noopener noreferrer">thetownsquare.xyz</a></div></footer>
    </main>
    <dialog ref={modal} className={`fd-sheet ${closing ? "fd-closing" : ""} ${sheet?.type === "about" ? "fd-about-sheet" : ""}`} aria-labelledby="fd-sheet-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="fd-sheet-shell">
        <div className="fd-sheet-bar"><span className="fd-handle" aria-hidden="true" /><button autoFocus aria-label="Close and return to menu" onClick={close}>↓</button></div>
        <div className="fd-sheet-scroll">
        {sheet?.type === "order" && <div className="fd-order-content">
          <div className="fd-order-header-row">
            <div className="fd-order-dish-thumb">
              <Image src={chef.image} alt={chef.dish.replace(/\n/g, " ")} fill sizes="140px" priority />
            </div>
            <div className="fd-order-header-info">
              <p className="fd-kicker">Order from {chef.name}</p>
              <h2 id="fd-sheet-title">{chef.dish}</h2>
              <p className="fd-price"><Rupee />{chef.price} <span>/ portion</span></p>
              <div className="fd-card-tags">
                <span>{formatDietaryTag(chef.dietary)}</span>
                <span>{chef.spice || "Spice level soon"}</span>
              </div>
            </div>
          </div>
          <section className="fd-order-section"><h3 className="fd-kicker">01 · Quantity</h3><div className="fd-quantity-row"><div><p className="fd-section-title">How many portions?</p><p className="fd-muted">{chef.portions}<br />Each portion serves one adult</p></div><div className="fd-stepper"><button aria-label="Decrease quantity" disabled={order.quantity <= 1} onClick={() => patch({ quantity: order.quantity - 1 })}>−</button><output aria-live="polite">{order.quantity}</output><button aria-label="Increase quantity" disabled={order.quantity >= max} onClick={() => patch({ quantity: order.quantity + 1 })}>+</button></div></div></section>
          <section className="fd-order-section">
            <h3 className="fd-kicker">02 · Get your order</h3>
            <div className="fd-schedule fd-order-schedule" aria-label="Pre-order deadline and drop date">
              <div className="fd-schedule-row"><span>Pre-orders close</span><strong>{chef.closeDay ? `${chef.closeDay}, ${chef.preorderDate}` : chef.preorderDate}</strong></div>
              <div className="fd-schedule-row"><span>Drops on</span><strong>{chef.pickupDay}, {chef.pickupDate.split("·")[0].trim()} · {getPickupTime(chef)}</strong></div>
            </div>
            <div className="fd-methods">
              <button aria-pressed={order.method === "pickup"} onClick={() => patch({ method: "pickup", error: "" })}>
                <strong>Pick it up yourself</strong>
              </button>
              <button disabled={!chef.homeDeliveryEnabled} aria-pressed={order.method === "delivery"} onClick={() => patch({ method: "delivery", editingPin: !order.savedPin, error: "" })}>
                <strong>Home delivery</strong>
                <span>{chef.homeDeliveryEnabled ? <>+ <Rupee />60 per order</> : "Not available"}</span>
              </button>
            </div>
            {order.method && <div className="fd-fulfilment">
              {order.method === "pickup" ? (
                <div className="fd-address-card">
                  <strong>{chef.pickupLocation}</strong>
                  <p>{chef.pickupAddress}</p>
                  <div className="fd-address-map-row">
                    <a href={chef.pickupMapsUrl} target="_blank" rel="noreferrer">
                      <span className="fd-maps-icon" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 92.3 132.3" fill="none">
                          <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/>
                          <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-32.4L10.8 16.5z"/>
                          <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.1 27.1-31.4C79.2 16.4 68.7 8.5 56.3 3.8L32.6 34.8c3.3-3.8 8.2-6.3 13.6-6.3"/>
                          <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 32.4c4.8 11 12.5 19.9 22.1 31.1l35.4-41.1c-3.4 3.9-8.3 6.6-15.9 6.6"/>
                          <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L24.6 98.3c3.7 4.5 7.1 8.8 10.1 13.1 7.6 10.9 11.4 20.8 11.4 20.8s3.8-9.8 13-23"/>
                        </svg>
                      </span>
                      <span>{chef.pickupMapsLabel || "Open in Google Maps"}</span>
                    </a>
                    {chef.pickupMapsNote && <span className="fd-address-map-note">{chef.pickupMapsNote}</span>}
                  </div>
                </div>
              ) : (
                <div className="fd-delivery">
                  <form onSubmit={event => { event.preventDefault(); if (order.savedPin && !order.editingPin) return; if (!/^\d{6}$/.test(order.pin)) { patch({ error: "Please enter a valid 6-digit delivery pincode." }); return; } patch({ savedPin: order.pin, editingPin: false, editingAddress: !order.savedAddress, error: "" }); }}><label htmlFor="fd-pin">Delivery pincode</label><p className="fd-muted">Currently servicing only select pin codes. Availability confirmed on WhatsApp.</p><div className="fd-field-row"><input id="fd-pin" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6-digit pincode" value={order.savedPin && !order.editingPin ? order.savedPin : order.pin} readOnly={Boolean(order.savedPin && !order.editingPin)} className={`fd-pin-input ${order.savedPin && !order.editingPin ? "fd-pin-saved" : ""}`} onChange={e => patch({ pin: e.target.value.replace(/\D/g, ""), error: "" })} />{order.savedPin && !order.editingPin ? <button type="button" className="fd-pin-btn fd-pin-btn-saved" onClick={() => { patch({ editingPin: true, error: "" }); setTimeout(() => document.getElementById("fd-pin")?.focus(), 50); }}>Edit pincode</button> : <button type="submit" className="fd-pin-btn fd-pin-btn-save">Save</button>}</div></form>
              {order.savedPin && (order.editingAddress || !order.savedAddress ? <form onSubmit={event => { event.preventDefault(); if (!order.address.trim()) { patch({ error: "Please enter your full delivery address." }); return; } patch({ savedAddress: order.address.trim(), editingAddress: false, error: "" }); }}><label htmlFor="fd-address">Full delivery address</label><textarea id="fd-address" autoComplete="street-address" rows={3} placeholder="House / flat, street & landmark" value={order.address} onChange={e => patch({ address: e.target.value, error: "" })} /><button type="submit" className="fd-save-address">Save full address</button></form> : <div className="fd-address-card"><div className="fd-saved"><strong>✓ Address saved</strong><button onClick={() => patch({ editingAddress: true })}>Edit</button></div><p>{order.savedAddress}</p></div>)}
              {order.error && <p className="fd-error" role="alert">{order.error}</p>}
            </div>
          )}
        </div>}
          </section>
          {order.method && <div className="fd-confirm"><div className="fd-total"><span>{order.quantity} × <Rupee />{chef.price}{fee > 0 ? <> + <Rupee />60 delivery</> : " · Pick it up yourself"}</span><strong><Rupee />{total}</strong></div>{order.method === "pickup" || validDelivery ? <a className="fd-whatsapp" href={whatsapp(orderMessage)} target="_blank" rel="noreferrer">Pay on WhatsApp</a> : <><button className="fd-whatsapp" disabled>Complete delivery details</button><p className="fd-muted">Save your pincode and full address to continue.</p></>}<p className="fd-policy">Pre-orders once placed cannot be cancelled</p><p className="fd-muted">Payment details and order confirmation follow on WhatsApp.</p></div>}
        </div>}
        {sheet?.type === "chef" && <div className="fd-profile">
          <div className="fd-profile-avatar">
            <Image src={chef.chefImage} alt={chef.name} width={180} height={180} style={chef.name === "Anne" ? { objectPosition: "right center", transform: "scale(1.2)", transformOrigin: "62% 48%" } : undefined} />
          </div>
          <p className="fd-kicker fd-profile-kicker">Meet the cook</p>
          <h2 id="fd-sheet-title" className="fd-profile-name">{chef.name}</h2>
          <div className="fd-profile-cards">
            <div className="fd-profile-card">
              <h3>A bit more about me</h3>
              <p>{chef.whatKeepsMeCurious || "Local markets, long walks, and the everyday stories behind familiar ingredients."}</p>
            </div>
            <div className="fd-profile-card">
              <h3>What I love to cook</h3>
              <p>{chef.whatILoveToCook || "Slow-cooked, seasonal food made for sharing around a busy neighborhood table."}</p>
            </div>
            <div className="fd-profile-card fd-profile-card-dish">
              <div className="fd-profile-dish-thumb">
                <Image src={chef.image} alt={chef.dish.replace(/\n/g, " ")} fill sizes="120px" />
              </div>
              <div className="fd-profile-dish-info">
                <p className="fd-kicker">Cook’s notes</p>
                <h3>{chef.dish}</h3>
                <p>“{chef.tonightDishQuote || chef.line}”</p>
              </div>
            </div>
          </div>
          <button type="button" className="fd-profile-order-btn" onClick={() => open({ type: "order", index })}>Order this dish</button>
        </div>}
        {sheet?.type === "about" && <div className="fd-about">{children}</div>}
        </div>
      </div>
    </dialog>
  </div>;
}
