"client";

"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

const CONTACT_ENDPOINT =
  "https://formsubmit.co/ajax/info.techforgeevent@gmail.com";

export default function ContactClient() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<"success" | "error" | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.reportValidity() || isSubmitting) return;

    const formData = new FormData(form);
    const subject = String(formData.get("subject") ?? "").trim();
    const payload = Object.fromEntries(formData.entries());

    setStatusMessage(null);
    setStatusState(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          _subject: `[Tech Forge Contact] ${subject}`,
          _template: "table",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to send contact message");
      }

      setStatusMessage("Success");
      setStatusState("success");
      form.reset();
    } catch {
      setStatusMessage("Error");
      setStatusState("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShortcut = (shortcutType: string) => {
    const selectElement = document.getElementById(
      "contact-enquiry",
    ) as HTMLSelectElement;
    const formPanel = document.getElementById("contact-form-panel");

    if (selectElement) {
      selectElement.value = shortcutType;
    }
    if (formPanel) {
      formPanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main id="top">
      {/* Contact introduction */}
      <section className="page-intro" aria-labelledby="contact-heading">
        <div className="container page-intro__grid">
          <div className="page-intro__copy">
            <p className="eyebrow">
              <svg
                className="eyebrow__mark"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m4.5 7.5 7.5 5.2L19.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Contact Us
            </p>
            <h1 className="heading-lg page-intro__title" id="contact-heading">
              Let’s build <span className="text-blue">something together.</span>
            </h1>
            <p className="page-intro__lede">
              Whether you have a question, want to partner with us, speak at
              Tech Forge, support the event or just say hello, we’d love to hear
              from you.
            </p>
          </div>

          <div className="page-intro__visual" aria-hidden="true">
            <span className="page-intro__star"></span>
            <span className="page-intro__sun"></span>
            <span className="page-intro__wedge"></span>
            <Image
              className="page-intro__skyline"
              src="/assets/lagos-skyline.png"
              alt=""
              width={2172}
              height={724}
            />
            <p className="page-intro__script script">
              Ideas
              <br />
              People
              <br />
              <span className="script--highlight">Progress</span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact form + sidebar */}
      <section
        className="contact-area section--compact"
        aria-labelledby="contact-form-heading"
      >
        <div className="container contact-area__grid">
          <div className="contact-form-panel" id="contact-form-panel">
            <div className="contact-form-panel__header">
              <h2 className="heading-md" id="contact-form-heading">
                Send us a message
              </h2>
              <p className="contact-form-panel__lede">
                Fill out the form and we’ll get back to you as soon as possible.
              </p>
            </div>

            <div
              className={`contact-status ${statusState ? `contact-status--${statusState}` : ""}`}
              id="contact-status"
              role="status"
              aria-live="polite"
              tabIndex={-1}
              hidden={!statusMessage}
            >
              <p
                className="contact-status__title"
                style={{ fontWeight: 700, marginBottom: "4px" }}
              >
                {statusState === "error"
                  ? "Something went wrong."
                  : "Thanks for reaching out."}
              </p>
              <p
                className="contact-status__text"
                style={{ fontWeight: 100, marginBottom: "4px" }}
              >
                {statusState === "error"
                  ? "We couldn’t send your message just now. Please try again in a moment."
                  : "We’ve received your message and someone from the Tech Forge team will get back to you soon."}
              </p>
            </div>

            <form
              className="contact-form"
              id="contact-form"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="contact-form__row contact-form__row--split">
                <div className="field">
                  <label className="field__label" htmlFor="contact-name">
                    Full name{" "}
                    <span className="field__req" aria-hidden="true">
                      *
                    </span>
                    <span className="visually-hidden"> (required)</span>
                  </label>
                  <input
                    className="field__control"
                    type="text"
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                  />
                  <p
                    className="field__error"
                    id="contact-name-error"
                    hidden
                  ></p>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="contact-email">
                    Email address{" "}
                    <span className="field__req" aria-hidden="true">
                      *
                    </span>
                    <span className="visually-hidden"> (required)</span>
                  </label>
                  <input
                    className="field__control"
                    type="email"
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                  />
                  <p
                    className="field__error"
                    id="contact-email-error"
                    hidden
                  ></p>
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-enquiry">
                  What is this about?{" "}
                  <span className="field__req" aria-hidden="true">
                    *
                  </span>
                  <span className="visually-hidden"> (required)</span>
                </label>
                <select
                  className="field__control field__control--select"
                  id="contact-enquiry"
                  name="enquiry"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="general">General Enquiry</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="speaking">Speaking Opportunity</option>
                  <option value="media">Media &amp; Press</option>
                  <option value="volunteering">Volunteering</option>
                  <option value="community">Community</option>
                  <option value="event-support">Event Support</option>
                  <option value="other">Other</option>
                </select>
                <p
                  className="field__error"
                  id="contact-enquiry-error"
                  hidden
                ></p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-subject">
                  Subject{" "}
                  <span className="field__req" aria-hidden="true">
                    *
                  </span>
                  <span className="visually-hidden"> (required)</span>
                </label>
                <input
                  className="field__control"
                  type="text"
                  id="contact-subject"
                  name="subject"
                  required
                  placeholder="Brief subject"
                />
                <p
                  className="field__error"
                  id="contact-subject-error"
                  hidden
                ></p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-message">
                  Message{" "}
                  <span className="field__req" aria-hidden="true">
                    *
                  </span>
                  <span className="visually-hidden"> (required)</span>
                </label>
                <textarea
                  className="field__control field__control--textarea"
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell us more..."
                ></textarea>
                <p
                  className="field__error"
                  id="contact-message-error"
                  hidden
                ></p>
              </div>

              <button
                className="btn btn--primary contact-form__submit"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                Send Message →
              </button>
            </form>
          </div>

          <aside className="contact-sidebar" aria-label="Contact shortcuts">
            <div className="contact-channels">
              <h2 className="contact-channels__title">
                Other ways to reach us
              </h2>
              <p className="contact-channels__lede">
                Prefer a different channel? You can also reach us here.
              </p>

              <ul className="contact-channels__list">
                <li>
                  <a
                    className="contact-channel"
                    href="mailto:hello@techforge.ng"
                  >
                    <span
                      className="contact-channel__icon contact-channel__icon--email"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="m4.5 7.5 7.5 5.2L19.5 7.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="contact-channel__body">
                      <span className="contact-channel__label">Email</span>
                      <span className="contact-channel__value">
                        info@techforgesummit.com
                      </span>
                      <span className="contact-channel__note">
                        We typically respond within 24–48 hours.
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    className="contact-channel"
                    href="https://www.tiktok.com/the.infinite.comm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="contact-channel__icon contact-channel__icon--tiktok"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          fill="currentColor"
                        >
                          <path d="M0 0h640v640H0z" fill="none" />
                          <path
                            fill="currentColor"
                            d="M544.5 273.9c-44 .1-87-13.6-122.8-39.2v178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6s-64.8 13.5-96.9 5.3s-60.9-25.9-82.7-50.8s-35.3-56-39-88.9s2.9-66.1 18.6-95.2s40-52.7 69.6-67.7s62.9-20.5 95.7-16v89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3s-14 28.1-13.9 43.9s5.2 31 14.5 43.7s22.4 22.1 37.4 26.9s31.1 4.8 46-.1s28-14.4 37.2-27.1s14.2-28.1 14.2-43.8V64h88c-.1 7.4.6 14.9 1.9 22.2c3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1V274z"
                          />
                        </svg>
                      </svg>
                    </span>
                    <span className="contact-channel__body">
                      <span className="contact-channel__label">Tiktok</span>
                      <span className="contact-channel__note">
                        Follow us for the latest updates.
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    className="contact-channel"
                    href="https://www.instagram.com/theinfinitecommunity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="contact-channel__icon contact-channel__icon--instagram"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="4.2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="17.2"
                          cy="6.8"
                          r="1.1"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span className="contact-channel__body">
                      <span className="contact-channel__label">Instagram</span>
                      <span className="contact-channel__value">
                        @theinfinitecommunity
                      </span>
                      <span className="contact-channel__note">
                        Follow us for the latest updates.
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="contact-enquiries">
              <p className="eyebrow contact-enquiries__eyebrow">
                Specific enquiries
              </p>
              <ul className="contact-enquiries__list">
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut("partnerships")}
                  >
                    Partnerships &amp; Sponsorships →
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut("speaking")}
                  >
                    Speaking Opportunities →
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut("media")}
                  >
                    Media &amp; Press →
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut("general")}
                  >
                    General Enquiries →
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
