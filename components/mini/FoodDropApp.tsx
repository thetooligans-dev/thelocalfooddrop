"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { chefs, siteConfig } from "@/data/site";

type Chef = (typeof chefs)[number] & { specialty?: string; background?: string; interests?: string };
type Sheet = { type: "order" | "chef"; index: number } | { type: "about" } | null;
type Order = { quantity: number; method: "pickup" | "delivery" | null; slot: string; pin: string; savedPin: string; address: string; savedAddress: string; editingPin: boolean; editingAddress: boolean; error: string };
const newOrder = (): Order => ({ quantity: 1, method: null, slot: "4pm to 6pm", pin: "", savedPin: "", address: "", savedAddress: "", editingPin: false, editingAddress: false, error: "" });
const slots = ["10am to 12pm", "4pm to 6pm"];
function whatsapp(message: string) { return `https://wa.me/${siteConfig.whatsappNumber || ""}?text=${encodeURIComponent(message)}`; }

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
  const fee = order.method === "delivery" ? 50 : 0;
  const total = order.quantity * chef.price + fee;
  const max = Number(chef.portions.match(/\d+/)?.[0] || 20);
  const validDelivery = Boolean(order.savedPin && order.savedAddress && !order.editingPin && !order.editingAddress);
  const orderMessage = [
    `Hey! 👋 I'd like to order *${chef.dish}* by ${chef.name}:`,
    `• Portions: *${order.quantity}* (₹${order.quantity * chef.price})`,
    `• Method: *${order.method === "delivery" ? "Doorstep Delivery (Rs 50 extra per order)" : "Self Pickup"}*`,
    order.method === "pickup" ? `• Pickup Location: ${chef.pickupLocation} - ${chef.pickupAddress} (${chef.pickupMapsUrl})` : `• Delivery Pincode: ${order.savedPin}\n• Delivery Address: ${order.savedAddress}`,
    `• ${order.method === "pickup" ? "Pickup" : "Delivery"} Date & Slot: ${chef.pickupDay}, ${chef.pickupDate} • ${order.slot}`,
    `• *Total to Pay: ₹${total}*`, "• Note: Pre-orders once placed cannot be cancelled", "", "Please share the payment details to confirm my order!",
  ].join("\n");

  // ── Browse-by filters ──
  type ViewMode = "dishes" | "chefs";
  const [viewMode, setViewMode] = useState<ViewMode>("dishes");
  
  type Diet = "all" | "Veg" | "Non-Veg" | "Eggetarian" | "Vegan" | "Dairy-Free / Lactose-Free" | "Gluten Free";
  type Spice = "all" | "Not spicy" | "Mildly spicy" | "Very spicy";
  const [diet, setDiet] = useState<Diet>("all");
  const [spice, setSpice] = useState<Spice>("all");
  
  const [sortMode, setSortMode] = useState<{ type: "price" | "delivery" | "preorder", dir: "asc" | "desc" } | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<"diet" | "spice" | "price" | "date" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Rotating intro phrases
  const INTRO_PHRASES = [
    "available in limited portions",
    "not available on zomato/swiggy",
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

  const anyActive = diet !== "all" || spice !== "all" || sortMode !== null;
  const clearAll = () => { setDiet("all"); setSpice("all"); setSortMode(null); setViewMode("dishes"); setActiveDropdown(null); };

  const filtered = chefs
    .map((c, i) => ({ chef: c, index: i }))
    .filter(({ chef: c }) => {
      if (diet !== "all") {
        if (diet === "Veg" && c.dietary !== "Vegetarian Dish") return false;
        if (diet === "Vegan" && c.dietary !== "Vegan Dish") return false;
        if (diet === "Non-Veg" && c.dietary !== "Non-Vegetarian Dish") return false;
        if (["Eggetarian", "Dairy-Free / Lactose-Free", "Gluten Free"].includes(diet)) return false;
      }
      if (spice !== "all" && c.spice !== spice) return false;
      return true;
    })
    .sort((a, b) => {
      if (!sortMode) return 0;
      if (sortMode.type === "price") {
        return sortMode.dir === "asc" ? a.chef.price - b.chef.price : b.chef.price - a.chef.price;
      }
      if (sortMode.type === "delivery" || sortMode.type === "preorder") {
        const parseD = (s: string) => {
          if (!s) return 0;
          const [d, m] = s.split(" ");
          const ms = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
          return new Date(2024, ms[m as keyof typeof ms] || 0, parseInt(d, 10)).getTime();
        };
        const prop = sortMode.type === "delivery" ? "pickupDate" : "preorderDate";
        const da = parseD(a.chef[prop] || "");
        const db = parseD(b.chef[prop] || "");
        return sortMode.dir === "asc" ? da - db : db - da;
      }
      return 0;
    });

  return <div className="fd-app">
    <header className="fd-topbar"><a className="fd-brand" href="#drop" aria-label="The Local Food Drop"><span aria-hidden="true">✳</span></a><button className="fd-story-link" onClick={() => open({ type: "about" })}>Our story ↗</button></header>
    <main id="drop" className="fd-main">
      <section className="fd-intro">
        <div className="fd-intro-logo">
          <Image src="/branding/logo.png" alt="The Local Food Drop logo" width={110} height={110} priority />
        </div>
        <h1 className="fd-intro-heading">A chef's prized dish</h1>
        <div className="fd-rotating-wrap">
          <p className={`fd-rotating-phrase ${isFading ? "fd-phrase-hidden" : ""}`}>
            {INTRO_PHRASES[phraseIndex]}
          </p>
        </div>
      </section>

      {/* ── Browse-by filter bar ── */}
      <nav className="fd-filters" aria-label="Browse dishes by" ref={dropdownRef}>
        <div className="fd-filter-group">
          <button className={`fd-filter-chip ${viewMode === "dishes" && !anyActive ? "fd-filter-active" : ""}`} onClick={clearAll}>All</button>
          <button className={`fd-filter-chip ${viewMode === "chefs" ? "fd-filter-active" : ""}`} onClick={() => { setViewMode("chefs"); setActiveDropdown(null); }}>By Chef</button>
        </div>
        <span className="fd-filter-sep" aria-hidden="true">·</span>
        <div className="fd-filter-more-wrap">
          <button className={`fd-filter-chip fd-filter-more ${diet !== "all" ? "fd-filter-active" : ""}`} onClick={() => setActiveDropdown(activeDropdown === "diet" ? null : "diet")}>{diet === "all" ? "Diet" : diet} {activeDropdown === "diet" ? "↑" : "↓"}</button>
          {activeDropdown === "diet" && <div className="fd-filter-dropdown fd-right-align">
            <div className="fd-filter-section">
              <div className="fd-filter-options">
                {(["all", "Veg", "Non veg", "Eggetarian", "Vegan", "Dairy-free", "Gluten free"] as Diet[]).map(d => 
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
        <div className="fd-filter-more-wrap">
          <button className={`fd-filter-chip fd-filter-more ${sortMode?.type === "price" ? "fd-filter-active" : ""}`} onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}>Price {activeDropdown === "price" ? "↑" : "↓"}</button>
          {activeDropdown === "price" && <div className="fd-filter-dropdown">
            <div className="fd-filter-section">
              <div className="fd-filter-options">
                <button className={`fd-filter-option ${sortMode?.type === "price" && sortMode.dir === "asc" ? "fd-filter-active" : ""}`} onClick={() => { setSortMode({ type: "price", dir: "asc" }); setActiveDropdown(null); }}>Low to High</button>
                <button className={`fd-filter-option ${sortMode?.type === "price" && sortMode.dir === "desc" ? "fd-filter-active" : ""}`} onClick={() => { setSortMode({ type: "price", dir: "desc" }); setActiveDropdown(null); }}>High to Low</button>
              </div>
            </div>
          </div>}
        </div>
        <div className="fd-filter-more-wrap">
          <button className={`fd-filter-chip fd-filter-more ${["delivery", "preorder"].includes(sortMode?.type || "") ? "fd-filter-active" : ""}`} onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}>Date {activeDropdown === "date" ? "↑" : "↓"}</button>
          {activeDropdown === "date" && <div className="fd-filter-dropdown fd-right-align">
            <div className="fd-filter-section">
              <div className="fd-filter-options" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <button className={`fd-filter-option ${sortMode?.type === "delivery" ? "fd-filter-active" : ""}`} onClick={() => { const isAsc = sortMode?.type === "delivery" && sortMode.dir === "asc"; setSortMode({ type: "delivery", dir: isAsc ? "desc" : "asc" }); setActiveDropdown(null); }}>Delivery Date {sortMode?.type === "delivery" ? (sortMode.dir === "asc" ? "↓" : "↑") : ""}</button>
                <button className={`fd-filter-option ${sortMode?.type === "preorder" ? "fd-filter-active" : ""}`} onClick={() => { const isAsc = sortMode?.type === "preorder" && sortMode.dir === "asc"; setSortMode({ type: "preorder", dir: isAsc ? "desc" : "asc" }); setActiveDropdown(null); }}>Pre-order Deadline {sortMode?.type === "preorder" ? (sortMode.dir === "asc" ? "↓" : "↑") : ""}</button>
              </div>
            </div>
          </div>}
        </div>
        {anyActive && <button className="fd-filter-chip fd-filter-reset" onClick={clearAll} aria-label="Clear all filters">✕</button>}
      </nav>

      <section className="fd-lineup" aria-label={viewMode === "dishes" ? "Chef dish lineup" : "Chef profiles"}>
        {filtered.length === 0 && <p className="fd-empty">No matches found for your filters. <button onClick={clearAll}>Show all</button></p>}
        {viewMode === "dishes" ? filtered.map(({ chef: item, index: i }) => {
          const profile: Chef = item;
          return <article className="fd-card" key={item.name}>
            <div className="fd-photo"><Image src={item.image} alt={item.dish} fill priority={i === 0} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              <span className="fd-status">{siteConfig.dropStatus === "live" ? "This week's drop" : "Coming soon"}</span>
              <div className="fd-schedule" aria-label="Pre-order deadline and delivery date"><div><span>Pre-orders close</span><strong>{item.preorderDate} · {item.closeTime}</strong></div><div><span>Delivery</span><strong>{item.pickupDate}</strong></div></div>
            </div>
            <div className="fd-card-body"><h2>{item.dish}</h2><p className="fd-price">₹{item.price} <span>/ portion</span></p>
              <div className="fd-tags"><span>{item.dietary}</span><span>{profile.spice || "Spice level soon"}</span></div>
              <p className="fd-portions">{item.portions} · Serves 1 per portion</p>
              <dl className="fd-ingredients"><div><dt>Ingredients</dt><dd>{item.ingredients}</dd></div><div><dt>Allergens</dt><dd>{item.allergens}</dd></div></dl>
              <div className="fd-card-actions"><button className="fd-chef-button" onClick={() => open({ type: "chef", index: i })}><Image src={item.chefImage} alt="" width={48} height={48} /><span><strong>{item.name}</strong><u>Meet the chef</u></span></button><button className="fd-order-button" onClick={() => open({ type: "order", index: i })}>Order dish <span aria-hidden="true">↗</span></button></div>
            </div>
          </article>;
        }) : filtered.map(({ chef: item, index: i }) => {
          return <article className="fd-card" key={item.name}>
            <div className="fd-photo" style={{ height: "340px" }}><Image src={item.chefImage} alt={item.name} fill priority={i === 0} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              <span className="fd-status">The chef</span>
            </div>
            <div className="fd-card-body" style={{ display: "flex", flexDirection: "column", height: "calc(100% - 340px)" }}>
              <p className="fd-kicker">Meet the chef</p>
              <h2 style={{ fontSize: "32px", marginBottom: "8px" }}>{item.name}</h2>
              <p style={{ fontSize: "14px", color: "var(--fd-muted)", lineHeight: 1.4, marginBottom: "20px" }}>Specialty · {item.specialty || "Seasonal cooking"}</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--fd-line)" }}>
                <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, border: "1px solid var(--fd-ink)" }}>
                  <Image src={item.image} alt={item.dish} fill style={{ objectFit: "cover" }} sizes="60px" />
                </div>
                <div>
                  <p className="fd-kicker" style={{ margin: "0 0 4px", fontSize: "10px", color: "var(--fd-muted)" }}>This week's dish</p>
                  <p style={{ fontSize: "16px", fontWeight: 600, margin: 0, lineHeight: 1.2, fontFamily: "var(--font-editorial)" }}>{item.dish}</p>
                </div>
              </div>

              <div style={{ background: "var(--fd-yellow)", padding: "16px", borderRadius: "14px", border: "1px solid var(--fd-ink)", marginBottom: "20px" }}>
                <p className="fd-kicker" style={{ marginBottom: "6px" }}>Chef notes</p>
                <p style={{ fontStyle: "italic", fontSize: "16px", lineHeight: 1.3, margin: 0, fontFamily: "var(--font-editorial)" }}>“{item.tonightDishQuote || item.line}”</p>
              </div>
              <div className="fd-card-actions" style={{ marginTop: "auto" }}>
                <button className="fd-order-button" style={{ width: "100%", textAlign: "center" }} onClick={() => open({ type: "chef", index: i })}>View full profile & order <span aria-hidden="true">↗</span></button>
              </div>
            </div>
          </article>;
        })}
      </section>
      <footer className="fd-footer"><span>Small-batch food, stories and people<br />from around the town square.</span><button onClick={() => open({ type: "about" })}>There is room at the table ↗</button><a href="https://thetownsquare.xyz" target="_blank" rel="noreferrer">An experiment by The Town Square Project</a></footer>
    </main>
    <dialog ref={modal} className={`fd-sheet ${closing ? "fd-closing" : ""} ${sheet?.type === "about" ? "fd-about-sheet" : ""}`} aria-labelledby="fd-sheet-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="fd-sheet-shell">
        <div className="fd-sheet-bar"><span className="fd-handle" aria-hidden="true" /><button autoFocus aria-label="Close and return to menu" onClick={close}>↓</button></div>
        <div className="fd-sheet-scroll">
        {sheet?.type === "order" && <div className="fd-order-content">
          <p className="fd-kicker">Order from {chef.name}</p><h2 id="fd-sheet-title">{chef.dish}</h2><p className="fd-price">₹{chef.price} <span>/ portion</span></p>
          <div className="fd-tags"><span>{chef.dietary}</span><span>{chef.spice || "Spice level soon"}</span></div>
          <div className="fd-chef-note"><span className="fd-kicker">From the chef</span><p>“{chef.line}”</p></div>
          <section className="fd-order-section"><h3 className="fd-kicker">01 · Quantity</h3><div className="fd-quantity-row"><div><p className="fd-section-title">How many portions?</p><p className="fd-muted">{chef.portions}<br />Each portion serves one adult</p></div><div className="fd-stepper"><button aria-label="Decrease quantity" disabled={order.quantity <= 1} onClick={() => patch({ quantity: order.quantity - 1 })}>−</button><output aria-live="polite">{order.quantity}</output><button aria-label="Increase quantity" disabled={order.quantity >= max} onClick={() => patch({ quantity: order.quantity + 1 })}>+</button></div></div></section>
          <section className="fd-order-section"><h3 className="fd-kicker">02 · Get your order</h3><div className="fd-methods"><button aria-pressed={order.method === "pickup"} onClick={() => patch({ method: "pickup", error: "" })}><strong>Self pickup</strong><span>Choose a time</span></button><button disabled={!chef.homeDeliveryEnabled} aria-pressed={order.method === "delivery"} onClick={() => patch({ method: "delivery", editingPin: !order.savedPin, error: "" })}><strong>Home delivery</strong><span>{chef.homeDeliveryEnabled ? "+ ₹50 per order" : "Not available"}</span></button></div>
          {order.method && <div className="fd-fulfilment">
            <p className="fd-kicker">{order.method === "pickup" ? "Pickup" : "Delivery"} · {chef.pickupDay}, {chef.pickupDate}</p>
            <fieldset className="fd-slot-field"><legend>Choose a {order.method === "pickup" ? "pickup" : "delivery"} time</legend><div className="fd-slots">{slots.map(slot => <button key={slot} aria-pressed={order.slot === slot} onClick={() => patch({ slot })}>{slot.replace(" to ", " – ")}</button>)}</div></fieldset>
            {order.method === "pickup" ? <div className="fd-address-card"><strong>{chef.pickupLocation}</strong><p>{chef.pickupAddress}</p><a href={chef.pickupMapsUrl} target="_blank" rel="noreferrer">Open in Google Maps ↗</a></div> : <div className="fd-delivery">
              {order.editingPin || !order.savedPin ? <form onSubmit={event => { event.preventDefault(); if (!/^\d{6}$/.test(order.pin)) { patch({ error: "Please enter a valid 6-digit delivery pincode." }); return; } patch({ savedPin: order.pin, editingPin: false, editingAddress: !order.savedAddress, error: "" }); }}><label htmlFor="fd-pin">Delivery pincode</label><p className="fd-muted">Currently servicing only select pin codes. Availability confirmed on WhatsApp.</p><div className="fd-field-row"><input id="fd-pin" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="6-digit pincode" value={order.pin} onChange={e => patch({ pin: e.target.value.replace(/\D/g, ""), error: "" })} /><button type="submit">Save</button></div></form> : <div className="fd-saved"><span>✓ Pincode: {order.savedPin}</span><button onClick={() => patch({ editingPin: true })}>Edit</button></div>}
              {order.savedPin && (order.editingAddress || !order.savedAddress ? <form onSubmit={event => { event.preventDefault(); if (!order.address.trim()) { patch({ error: "Please enter your full delivery address." }); return; } patch({ savedAddress: order.address.trim(), editingAddress: false, error: "" }); }}><label htmlFor="fd-address">Full delivery address</label><textarea id="fd-address" autoComplete="street-address" rows={3} placeholder="House / flat, street & landmark" value={order.address} onChange={e => patch({ address: e.target.value, error: "" })} /><button type="submit" className="fd-save-address">Save full address</button></form> : <div className="fd-address-card"><div className="fd-saved"><strong>✓ Address saved</strong><button onClick={() => patch({ editingAddress: true })}>Edit</button></div><p>{order.savedAddress}</p></div>)}
              {order.error && <p className="fd-error" role="alert">{order.error}</p>}
            </div>}
          </div>}
          </section>
          {order.method && <div className="fd-confirm"><div className="fd-total"><span>{order.quantity} × ₹{chef.price}{fee > 0 ? " + ₹50 delivery" : " · Self pickup"}</span><strong>₹{total}</strong></div>{order.method === "pickup" || validDelivery ? <a className="fd-whatsapp" href={whatsapp(orderMessage)} target="_blank" rel="noreferrer">Pay on WhatsApp <span>↗</span></a> : <><button className="fd-whatsapp" disabled>Complete delivery details</button><p className="fd-muted">Save your pincode and full address to continue.</p></>}<p className="fd-policy">Pre-orders once placed cannot be cancelled</p><p className="fd-muted">Payment details and order confirmation follow on WhatsApp.</p></div>}
        </div>}
        {sheet?.type === "chef" && <div className="fd-profile">
          <div className="fd-profile-avatar">
            <Image src={chef.chefImage} alt={chef.name} width={180} height={180} />
          </div>
          <p className="fd-kicker fd-profile-kicker">Meet the chef</p>
          <h2 id="fd-sheet-title" className="fd-profile-name">{chef.name}</h2>
          <p className="fd-profile-sub">Specialty · {chef.specialty || "Seasonal cooking and comforting neighborhood favorites"}</p>
          <div className="fd-profile-cards">
            <div className="fd-profile-card">
              <p className="fd-kicker">In the kitchen</p>
              <h3>What I love to cook</h3>
              <p>{chef.whatILoveToCook || "Slow-cooked, seasonal food made for sharing around a busy neighborhood table."}</p>
            </div>
            <div className="fd-profile-card">
              <p className="fd-kicker">Away from the stove</p>
              <h3>What keeps me curious</h3>
              <p>{chef.whatKeepsMeCurious || "Local markets, long walks, and the everyday stories behind familiar ingredients."}</p>
            </div>
            <div className="fd-profile-card fd-profile-card-dish">
              <p className="fd-kicker">Chef notes</p>
              <h3>{chef.dish}</h3>
              <p>“{chef.tonightDishQuote || chef.line}”</p>
            </div>
          </div>
          <button type="button" className="fd-profile-order-btn" onClick={() => open({ type: "order", index })}>Order this dish</button>
        </div>}
        {sheet?.type === "about" && <div className="fd-about"><h2 id="fd-sheet-title">There is room at the table.</h2>{children}</div>}
        </div>
      </div>
    </dialog>
  </div>;
}
