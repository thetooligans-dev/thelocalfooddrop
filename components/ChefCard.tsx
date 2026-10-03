"use client";

import { useState } from "react";
import type { Coordinates } from "@/lib/delivery";

import { FoodArt } from "@/components/FoodArt";
import { siteConfig } from "@/data/site";

export interface Chef {
  name: string;
  dish: string;
  price?: number;
  image?: string;
  chefImage?: string;
  tone: "watermelon" | "kiwi" | "lemon" | "olive";
  line: string;
  ingredients: string;
  dietary: string;
  allergens: string;
  portions: string;
  maxPortions?: number;
  pickupCoordinates?: Coordinates | null;
  homeDeliveryEnabled?: boolean;
  pickupLocation?: string;
  pickupAddress?: string;
  pickupMapsUrl?: string;
  pickupDay?: string;
  pickupDate?: string;
  closeDay?: string;
  closeTime?: string;
}

interface ChefCardProps {
  chef: Chef;
  index: number;
}

export interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
  mapsUrl?: string;
  capturedAt: string;
}

export function ChefCard({ chef, index }: ChefCardProps) {
  const [portionCount, setPortionCount] = useState<number>(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery" | null>(null);
  const [pickupSlot, setPickupSlot] = useState<string>("4pm to 6pm");
  const [pincode, setPincode] = useState("");
  const [savedPincode, setSavedPincode] = useState("");
  const [pincodeOpen, setPincodeOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [addressOpen, setAddressOpen] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  const eligibility = chef.homeDeliveryEnabled === false ? "disabled" : "available";
  const defaultPincodeHint = chef.pickupAddress?.match(/\b(403\d{3})\b/)?.[1] || "403716";
  const maxPortions = chef.maxPortions ?? parseInt(chef.portions.match(/\d+/)?.[0] || "20", 10);

  const increment = () => {
    setPortionCount((prev) => Math.min(maxPortions, prev + 1));
  };

  const decrement = () => {
    setPortionCount((prev) => {
      const next = Math.max(0, prev - 1);
      if (next === 0) {
        setDeliveryMethod(null);
        setPickupSlot("4pm to 6pm");
        setPincode("");
        setSavedPincode("");
        setPincodeOpen(false);
        setAddressOpen(false);
        setAddress("");
        setSavedAddress("");
        setDeliveryError(null);
      }
      return next;
    });
  };

  const handleSelectPickup = () => {
    setDeliveryMethod("pickup");
    setDeliveryError(null);
  };

  const handleSelectDelivery = () => {
    setDeliveryMethod("delivery");
    if (!savedPincode) {
      setPincodeOpen(true);
    }
    setDeliveryError(null);
  };

  const isDeliveryMissingLocation =
    deliveryMethod === "delivery" &&
    (!savedPincode || !savedAddress || savedAddress !== address.trim());

  const handleBlockedOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!savedPincode) {
      setDeliveryError("Please share your delivery pincode before ordering.");
      setPincodeOpen(true);
    } else if (!savedAddress) {
      setDeliveryError("Please enter and save your full delivery address before ordering.");
      setAddressOpen(true);
    } else {
      setDeliveryError("Please save your delivery pincode and address before ordering.");
    }
  };

  const handleSetPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPincode = pincode.trim();
    if (!cleanPincode || cleanPincode.length !== 6) {
      setDeliveryError("Please enter a valid 6-digit delivery pincode.");
      return;
    }
    setSavedPincode(cleanPincode);
    setPincode(cleanPincode);
    setPincodeOpen(false);
    if (!savedAddress) {
      setAddressOpen(true);
    }
    setDeliveryError(null);
  };

  const handleSetAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedPincode) {
      setDeliveryError("Please share and save your delivery pincode first.");
      setPincodeOpen(true);
      return;
    }
    if (!address.trim()) {
      setDeliveryError("Enter your delivery address, then tap Save full address.");
      return;
    }
    setSavedAddress(address.trim());
    setAddressOpen(false);
    setDeliveryError(null);
  };

  // Price calculations
  const dishPrice = chef.price || 450;
  const subtotal = portionCount * dishPrice;
  const deliveryFee = deliveryMethod === "delivery" ? 60 : 0;
  const totalAmount = subtotal + deliveryFee;

  // WhatsApp order link
  const orderLines = [
    `Hey! 👋 I’d like to order *${chef.dish.replace(/\n/g, " ")}* by ${chef.name}:`,
    `• Portions: *${portionCount}* (₹${subtotal})`,
    `• Method: *${deliveryMethod === "delivery" ? "Doorstep Delivery (Rs 60 extra per order)" : "Self Pickup"}*`,
    deliveryMethod === "pickup" && (chef.pickupAddress || chef.pickupLocation)
      ? `• Pickup Location: ${chef.pickupLocation ? `${chef.pickupLocation} - ` : ""}${chef.pickupAddress || ""}${chef.pickupMapsUrl ? ` (${chef.pickupMapsUrl})` : ""}\n• Pickup Date & Slot: ${chef.pickupDay ? `${chef.pickupDay}, ${chef.pickupDate}` : "Saturday, 26 Sep"} • Between ${pickupSlot} only`
      : null,
    deliveryMethod === "delivery" && savedPincode
      ? `• Delivery Pincode: ${savedPincode}\n• Delivery Address: ${savedAddress}\n• Delivery Date & Slot: ${chef.pickupDay || "Saturday"}, ${chef.pickupDate || "26 Sep"} • ${pickupSlot}`
      : null,
    `• *Total to Pay: ₹${totalAmount}*`,
    `• Note: Pre-orders once placed cannot be cancelled`,
    ``,
    `Please share the payment details to confirm my order!`,
  ].filter(Boolean);

  const whatsappText = encodeURIComponent(orderLines.join("\n"));
  const whatsappNumber = siteConfig.whatsappNumber;
  const payHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
    : `https://wa.me/?text=${whatsappText}`;

  const isOrdering = portionCount > 0;

  return (
    <article className={`chef-story story-${index + 1}`}>
      <div className="chef-visual">
        <FoodArt
          tone={chef.tone}
          day={chef.pickupDay}
          date={chef.pickupDate}
          closeDay={chef.closeDay}
          closeTime={chef.closeTime}
          label={`0${index + 1}`}
          image={chef.image}
          dish={chef.dish}
        />
      </div>

      <div className="chef-content">
        <div className="chef-heading">
          <div className="chef-identity-row">
            <div className="chef-avatar-frame" aria-hidden="true">
              <img
                src={chef.chefImage || "/chefs/placeholder-chef.svg"}
                alt={chef.name}
                className="chef-avatar-img"
                loading="lazy"
              />
            </div>
            <p className="hand-note">{chef.name}</p>
          </div>
          <h3>{chef.dish}</h3>
        </div>

        {/* Choose quantity before fulfillment. */}
        <div className="story-order-wrap">
          <div className="order-row-top">
            <div className="portion-info">
              <span className="portion-note desktop-availability">{chef.portions}</span>
              <span className="mobile-quantity-label">{chef.portions}</span>
              <span className="portion-serving"><span className="desktop-serving">each portion serves one adult</span><span className="mobile-serving">Serves 1 per portion</span></span>
            </div>

            <div className="portion-stepper" aria-label={`Select portions for ${chef.dish.replace(/\n/g, " ")}`}>
              <button
                type="button"
                className="portion-step-btn"
                onClick={decrement}
                disabled={portionCount === 0}
                aria-label={`Decrease portions for ${chef.dish.replace(/\n/g, " ")}`}
              >
                −
              </button>
              <span className="portion-count" aria-live="polite">
                {portionCount}
              </span>
              <button
                type="button"
                className="portion-step-btn"
                onClick={increment}
                disabled={portionCount >= maxPortions}
                aria-label={`Increase portions for ${chef.dish.replace(/\n/g, " ")}`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* When portionCount === 0: show price, ingredients, dietary, allergens, chef notes */}
        {!isOrdering ? (
          <div className="dish-details-full">
            <dl className="dish-meta">
              <div>
                <dt>Price</dt>
                <dd>₹{dishPrice} per portion</dd>
              </div>
              <div>
                <dt>Ingredients</dt>
                <dd>{chef.ingredients}</dd>
              </div>
              <div>
                <dt>Dietary</dt>
                <dd>{chef.dietary}</dd>
              </div>
              <div>
                <dt>Allergens</dt>
                <dd>{chef.allergens}</dd>
              </div>
              {chef.line && (
                <div>
                  <dt>Cook’s notes</dt>
                  <dd>{chef.line}</dd>
                </div>
              )}
            </dl>
          </div>
        ) : (
          /* When portionCount > 0: ALL above info disappears, replaced by fulfillment & pay flow */
          <div className="order-fulfillment-in-place">
            {/* Fulfillment selection */}
            <div className="fulfillment-block">
              <span className="order-row-label">Pickup or delivery</span>
              <div className="fulfillment-pills">
                <button
                  type="button"
                  className={`fulfillment-pill ${deliveryMethod === "pickup" ? "active" : ""} ${
                    deliveryMethod === "delivery" ? "blanked" : ""
                  }`}
                  aria-pressed={deliveryMethod === "pickup"}
                  onClick={handleSelectPickup}
                >
                  <span className="fulfillment-btn-title">Self Pickup</span>
                </button>
                <button
                  type="button"
                  className={`fulfillment-pill ${deliveryMethod === "delivery" ? "active" : ""} ${
                    deliveryMethod === "pickup" ? "blanked" : ""
                  }`}
                  aria-pressed={deliveryMethod === "delivery"}
                  disabled={eligibility === "disabled"}
                  onClick={handleSelectDelivery}
                >
                  <span className="fulfillment-btn-title"><span className="delivery-label-desktop">Doorstep Delivery</span><span className="delivery-label-mobile">Delivery</span></span>
                  <span className="fulfillment-btn-note">
                    {eligibility === "disabled"
                      ? "(not available)"
                      : "(Rs 60 extra per order)"}
                  </span>
                </button>
              </div>
              {eligibility !== "disabled" && (
                <p className="mobile-delivery-fee">Delivery + ₹60 per order</p>
              )}
            </div>

            {/* Dynamic Fulfillment Content: Pickup OR Home Delivery */}
            {deliveryMethod && (
              <div className="fulfillment-dynamic-wrap">
                {deliveryMethod === "pickup" && (
                  <div className="in-place-pickup-block">
                    <div className="pickup-header-row">
                      <div className="pickup-slots-wrap" role="group" aria-label="Select pickup slot">
                        <button
                          type="button"
                          className={`pickup-slot-btn ${pickupSlot === "10am to 12pm" ? "active" : ""} ${
                            pickupSlot === "4pm to 6pm" ? "blanked" : ""
                          }`}
                          aria-pressed={pickupSlot === "10am to 12pm"}
                          onClick={() => setPickupSlot("10am to 12pm")}
                        >
                          10am – 12pm
                        </button>
                        <button
                          type="button"
                          className={`pickup-slot-btn ${pickupSlot === "4pm to 6pm" ? "active" : ""} ${
                            pickupSlot === "10am to 12pm" ? "blanked" : ""
                          }`}
                          aria-pressed={pickupSlot === "4pm to 6pm"}
                          onClick={() => setPickupSlot("4pm to 6pm")}
                        >
                          4pm – 6pm
                        </button>
                      </div>
                    </div>

                    <a
                      href={
                        chef.pickupMapsUrl ||
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${chef.pickupLocation || chef.name} ${chef.pickupAddress || "Margao Goa"}`
                        )}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clean-pickup-card clean-pickup-card-link"
                    >
                      <span className="clean-pickup-pin" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 92.3 132.3">
                          <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/>
                          <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-32.4L10.8 16.5z"/>
                          <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.1 27.1-31.4C79.2 16.4 68.7 8.5 56.3 3.8L32.6 34.8c3.3-3.8 8.2-6.3 13.6-6.3"/>
                          <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 32.4c4.8 11 12.5 19.9 22.1 31.1l35.4-41.1c-3.4 3.9-8.3 6.6-15.9 6.6"/>
                          <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L24.6 98.3c3.7 4.5 7.1 8.8 10.1 13.1 7.6 10.9 11.4 20.8 11.4 20.8s3.8-9.8 13-23"/>
                        </svg>
                      </span>
                      <div className="clean-pickup-text">
                        <strong className="clean-pickup-name">
                          {chef.pickupLocation || `${chef.name}'s Kitchen`}
                        </strong>
                        {chef.pickupAddress && (
                          <p className="clean-pickup-address">{chef.pickupAddress}</p>
                        )}
                        <div className="clean-pickup-timing">
                          <span className="clean-pickup-timing-bullet" aria-hidden="true">✦</span>
                          <span>
                            Self pickup on <strong>{chef.pickupDay ? `${chef.pickupDay}, ${chef.pickupDate}` : "Saturday, 26 Sep"}</strong> • Between <strong>{pickupSlot}</strong> only
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                )}

                {deliveryMethod === "delivery" && eligibility === "available" && (
                  <div className="in-place-location-block">
                    <div className="pickup-header-row">
                      <div className="pickup-slots-wrap" role="group" aria-label="Select delivery slot">
                        <button
                          type="button"
                          className={`pickup-slot-btn ${pickupSlot === "10am to 12pm" ? "active" : ""} ${
                            pickupSlot === "4pm to 6pm" ? "blanked" : ""
                          }`}
                          aria-pressed={pickupSlot === "10am to 12pm"}
                          onClick={() => setPickupSlot("10am to 12pm")}
                        >
                          10am – 12pm
                        </button>
                        <button
                          type="button"
                          className={`pickup-slot-btn ${pickupSlot === "4pm to 6pm" ? "active" : ""} ${
                            pickupSlot === "10am to 12pm" ? "blanked" : ""
                          }`}
                          aria-pressed={pickupSlot === "4pm to 6pm"}
                          onClick={() => setPickupSlot("4pm to 6pm")}
                        >
                          4pm – 6pm
                        </button>
                      </div>
                    </div>

                    <div className="clean-pickup-card clean-delivery-card">
                      <div className="clean-pickup-text">
                        <div className="delivery-guide">
                          {pincodeOpen ? (
                            <form className="delivery-pincode-form" onSubmit={handleSetPincode}>
                              <div className="pincode-input-row">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={6}
                                  aria-label="Delivery pincode"
                                  className="delivery-pincode-input"
                                  autoFocus
                                  placeholder="6-digit pincode"
                                  value={pincode}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                    setPincode(val);
                                    setDeliveryError(null);
                                  }}
                                />
                                <button type="submit" className="pincode-save-btn">
                                  Save
                                </button>
                                {savedPincode && (
                                  <button
                                    type="button"
                                    className="pincode-cancel-btn"
                                    onClick={() => {
                                      setPincode(savedPincode);
                                      setPincodeOpen(false);
                                      setDeliveryError(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </form>
                          ) : (
                            <button
                              type="button"
                              className={`clean-pincode-btn delivery-action ${savedPincode ? "is-set" : ""}`}
                              onClick={() => {
                                setPincode(savedPincode || "");
                                setPincodeOpen(true);
                                setDeliveryError(null);
                              }}
                            >
                              {savedPincode ? (
                                <>
                                  <span>✓ Pincode: {savedPincode}</span>
                                  <small>Update</small>
                                </>
                              ) : (
                                <span>
                                  Share delivery pincode{" "}
                                  <span className="pincode-select-note">
                                    (currently servicing only select pin codes)
                                  </span>
                                </span>
                              )}
                            </button>
                          )}

                          {Boolean(savedPincode) && (
                            <form className="delivery-address-form" onSubmit={handleSetAddress}>
                              {addressOpen && (
                                <textarea
                                  aria-label="Full delivery address"
                                  className="delivery-address-input"
                                  rows={2}
                                  autoFocus
                                  autoComplete="street-address"
                                  placeholder="House / flat, street & landmark"
                                  value={address}
                                  onChange={(e) => {
                                    setAddress(e.target.value);
                                    setDeliveryError(null);
                                  }}
                                />
                              )}
                              {addressOpen ? (
                                <button type="submit" className="clean-loc-set-btn delivery-action">
                                  Save full address
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className={`clean-loc-set-btn delivery-action ${savedAddress ? "is-set" : ""}`}
                                  onClick={() => setAddressOpen(true)}
                                >
                                  {savedAddress ? (
                                    <>
                                      <span>✓ Address saved</span>
                                      <small>Edit</small>
                                    </>
                                  ) : (
                                    "Add full address"
                                  )}
                                </button>
                              )}
                            </form>
                          )}

                          {deliveryError && (
                            <p className="clean-loc-error" role="alert">
                              {deliveryError}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pay breakdown & CTA once Pickup or Delivery is chosen */}
            {(deliveryMethod === "pickup" || (deliveryMethod === "delivery" && eligibility === "available")) && (
              <div className="in-place-pay-block">
                <div className="clean-pay-meta">
                  <span className="clean-pay-breakdown">
                    {portionCount} × ₹{dishPrice}
                    {deliveryMethod === "delivery" ? " + ₹60 delivery" : " (self pickup)"}
                  </span>
                  <span className="clean-pay-total">
                    Total: <strong>₹{totalAmount}</strong>
                  </span>
                </div>

                {isDeliveryMissingLocation ? (
                  <button
                    type="button"
                    className="clean-whatsapp-pay-btn"
                    onClick={handleBlockedOrderClick}
                  >
                    <span>Pay on WhatsApp · ₹{totalAmount}</span>
                  </button>
                ) : (
                  <a
                    href={payHref}
                    target="_blank"
                    rel="noreferrer"
                    className="clean-whatsapp-pay-btn"
                  >
                    <span>Pay on WhatsApp · ₹{totalAmount}</span>
                  </a>
                )}

                <p className="order-cancel-policy-note">
                  Pre-orders once placed cannot be cancelled
                </p>


              </div>
            )}
          </div>
        )}


      </div>
    </article>
  );
}
