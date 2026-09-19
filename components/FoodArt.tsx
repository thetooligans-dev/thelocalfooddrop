import type { ReactNode } from "react";

type Tone = "kiwi" | "watermelon" | "lemon" | "olive";
const palette = {
  kiwi: { bg: "#d8d6a6", ink: "#27422e" },
  watermelon: { bg: "#eac0af", ink: "#a63e35" },
  lemon: { bg: "#ebd487", ink: "#624b2f" },
  olive: { bg: "#ced2b9", ink: "#27422e" },
};

function Ink({ children }: { children: ReactNode }) {
  return <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{children}</g>;
}

/** Original, scalable pen drawings. Deliberately irregular contours keep the marks human. */
export function ServingDoodle() {
  return (
    <svg className="serving-doodle" viewBox="0 0 560 480" aria-hidden="true">
      <g fill="#f8f3e5" stroke="#f8f3e5" strokeWidth="19" strokeLinejoin="round">
        <path d="M194 418l9-148-40-33-85 13-23-32 24-63 88 9 52 43 29-14-5-26c-30-19-37-54-21-78 15-29 62-32 81-4 19 22 9 61-11 77l-1 29 38 18 45-51 86 3 23 66-21 32-91-12-24 35 19 141Z" />
      </g>
      <Ink>
        <path d="M224 114c-8-42 55-57 74-20 10 18 5 44-8 56-6 7-17 13-28 11-23-2-38-22-38-47Z" />
        <path d="M224 105c-6-25 8-43 27-42 9-15 43-12 50 6 17 1 24 17 18 33-14-9-25-13-35-12-17 2-28 12-38 24-7-3-14-6-22-9Z" />
        <path d="M245 120l1 3m32-3v3m-24 18c7 5 14 5 20-1m-11-20-3 11 7 1M246 161l-2 29 21 15 25-15-1-29" />
        <path d="M244 187c-29 2-51 16-70 29l-30-18m145-10c32 3 52 20 65 32l31-24M207 234l-11 182 137 2-13-186M231 199l-9 69 80 1-10-71M228 270l-10 143m84-142 17 144M238 308l46 1-1 43-43-1Z" />
        <path d="M174 217l-10 33-53-16m244-15 15 33 54-15" />
        <path fill="#f8f3e5" d="M47 194c27-9 89-11 128-1l-13 70c-35 11-73 11-102-2Z" />
        <path d="M47 194c38 13 92 14 128-1M58 183c2-32 99-34 108 0M102 156v-8h19v9M78 226c20 4 42 5 65 0" />
        <path fill="#f8f3e5" d="M391 190c20-10 70-10 94 0l-14 69c-21 7-47 6-66-2Z" />
        <path d="M391 190c26 10 65 11 94 0M404 177c11-18 49-17 65 1M426 170c-11-15 8-18-1-32m22 33c-12-14 10-21 1-36" />
        <path d="M67 247c-16-2-24-11-19-18 4-7 15-5 26 0m-8 17c-16 0-23 8-16 16 8 7 19 9 28 5M474 234c13-8 25-7 27 2 1 10-11 15-21 16m0 0c14-5 21 3 15 11-5 8-16 9-27 8" />
        <path d="M182 429c55 4 110 5 165 0M74 113l-10-9m21-5-3-14m358 19 10-12m-4 30 15-3" />
      </Ink>
    </svg>
  );
}

function Neighbourhood() {
  return <Ink>
    <path d="M55 345c127-5 295-4 448 1M124 337l3-171 260 2 3 171M114 168l28-57 227 3 28 55Z" />
    <path d="M119 168c5 25 25 26 36 1 8 25 27 25 38 1 7 26 28 25 39 0 8 27 27 27 38 1 8 24 28 23 38 0 8 23 29 23 39 0 9 24 31 24 43-1M150 119l-16 43m61-42-8 42m48-43-3 44m43-42 6 42m31-42 13 42m26-40 18 39" />
    <path d="M151 218l80-1 1 118-80 1ZM260 216l101 1-1 72-100-1ZM263 252l95 1M309 220v64M245 308h127M177 249h28m-28 11h25M97 336l-6-41-26-1 4 44m10-44c-20-19-13-36-3-32 9 5 5 24 5 24 5-27 22-31 24-20 2 10-11 21-17 25" />
    <path d="M435 335c0-80 11-145 18-208M451 136c-37-31-54-23-62-8 21-6 39 1 59 15m5-7c17-39 40-42 55-25-29 0-41 14-51 28m-3-9c-8-30-22-46-38-37 20 12 26 28 35 43m5 3c24-9 43 5 45 22-17-12-33-14-47-16" />
    <path d="M166 96l191 2" />
  </Ink>;
}

function Kitchen({ tone }: { tone: Tone }) {
  return <Ink>
    <path d="M65 342c135-4 275-4 424 0M99 345l-3 46m356-47 5 45" />
    <path d="M214 188c-25-17-33-42-23-66 9-25 40-33 63-20 23 14 25 46 10 67-11 15-30 24-50 19ZM191 131c19-2 36-9 47-23 8 17 17 23 28 27M211 146v3m32-4v3m-25 21c8 3 14 1 18-4M214 188l-3 20m40-22 4 21M210 207c-29 6-45 20-55 51l-22 39m122-90c31 9 45 30 62 59l44 19M197 222l-11 107m77-106 17 106M213 213l-8 49 55-2-9-47m-44 65 46 1-1 34-44-1Z" />
    {tone === "watermelon" ? <>
      <path d="M305 303l8 33 91 1 10-37M297 299c31-10 89-9 125 1-30 12-93 12-125-1ZM339 288l-16-36m40 35c-10-12 9-17 1-30m19 33c-9-13 8-19 1-30M147 300l20 18 19-7" />
    </> : tone === "kiwi" ? <>
      <path d="M301 302c8 43 96 44 111-1ZM297 300c33-10 85-8 120 1M409 298l48-27m-94 15-12-44M112 321l60-1m-46-15 38 1" />
    </> : <>
      <path d="M300 322l121-1-12 14-99 1ZM315 312l1-31 24 1 1 29m13 0 1-29 25 1 2 29m13 0 1-29 22 1 1 29M321 274c-4-7 8-10 9-16m32 15c-5-7 7-10 9-15M132 303l32 11 22-7" />
    </>}
    <path d="M79 108l57 1m-50 5-2 65m18-64v48c0 17 19 17 19 0v-47M347 115l103-1m-88 2-1 59 20 1-2-61m25 0v49c0 16 23 17 23 0v-50M194 370l19-1m18 1h39" />
  </Ink>;
}

export function FoodArt({
  tone,
  label,
  day,
  date,
  closeDay,
  closeTime,
  image,
  dish,
}: {
  tone: Tone;
  label?: ReactNode;
  day?: string;
  date?: string;
  closeDay?: string;
  closeTime?: string;
  image?: string;
  dish?: string;
}) {
  const p = palette[tone];
  return (
    <div className="food-art" style={{ background: p.bg, color: p.ink }} aria-hidden="true">
      {image ? (
        <img
          src={image}
          alt={dish ? dish.replace(/\n/g, " ") : "Dish photograph"}
          className="food-art-image"
          loading="lazy"
        />
      ) : (
        <svg viewBox="0 0 560 420" preserveAspectRatio="xMidYMid meet">
          {tone === "olive" ? <Neighbourhood /> : <Kitchen tone={tone} />}
        </svg>
      )}
      {day && date ? (
        <div
          className="food-art-calendar-badge"
          aria-label={`Pre-orders close ${closeDay || "day prior"} at ${closeTime || "8 PM"}, delivery next day ${day}, ${date}`}
        >
          <div className="cal-badge-tier cal-badge-tier-close">
            <span className="cal-badge-kicker">Pre-orders close</span>
            <span className="cal-badge-close-val">{closeDay || "Day Prior"} · {closeTime || "8 PM"}</span>
          </div>
          <div className="cal-badge-divider" aria-hidden="true" />
          <div className="cal-badge-tier cal-badge-tier-drop">
            <span className="cal-badge-kicker cal-badge-kicker-drop">Delivery next day</span>
            <span className="cal-badge-date">{day}, {date}</span>
          </div>
        </div>
      ) : label ? (
        <span className="food-art-label">{label}</span>
      ) : null}
    </div>
  );
}
