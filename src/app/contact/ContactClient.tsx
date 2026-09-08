'client';

'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

export default function ContactClient() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<'success' | 'error' | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    if (!name) return;

    setStatusMessage('Success');
    setStatusState('success');
    form.reset();
  };

  const handleShortcut = (shortcutType: string) => {
    const selectElement = document.getElementById('contact-enquiry') as HTMLSelectElement;
    const formPanel = document.getElementById('contact-form-panel');
    
    if (selectElement) {
      selectElement.value = shortcutType;
    }
    if (formPanel) {
      formPanel.scrollIntoView({ behavior: 'smooth' });
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
              Let’s build{' '}
              <span className="text-blue">something together.</span>
            </h1>
            <p className="page-intro__lede">
              Whether you have a question, want to partner with us, speak at Tech
              Forge, support the event or just say hello, we’d love to hear from
              you.
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
              Ideas<br />
              People<br />
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
              className={`contact-status ${statusState ? `contact-status--${statusState}` : ''}`}
              id="contact-status"
              role="status"
              aria-live="polite"
              tabIndex={-1}
              hidden={!statusMessage}
            >
              <p className="contact-status__title" style={{ fontWeight: 700, marginBottom: '4px' }}>
                Thanks for reaching out.
              </p>
              <p className="contact-status__text" style={{ fontWeight: 100, marginBottom: '4px' }}>
                We’ve received your message and someone from the Tech Forge team will get back to you soon.
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
                    Full name <span className="field__req" aria-hidden="true">*</span>
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
                  <p className="field__error" id="contact-name-error" hidden></p>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="contact-email">
                    Email address{' '}
                    <span className="field__req" aria-hidden="true">*</span>
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
                  <p className="field__error" id="contact-email-error" hidden></p>
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-enquiry">
                  What is this about?{' '}
                  <span className="field__req" aria-hidden="true">*</span>
                  <span className="visually-hidden"> (required)</span>
                </label>
                <select
                  className="field__control field__control--select"
                  id="contact-enquiry"
                  name="enquiry"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select an option</option>
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
                <p className="field__error" id="contact-enquiry-error" hidden></p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-subject">
                  Subject <span className="field__req" aria-hidden="true">*</span>
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
                <p className="field__error" id="contact-subject-error" hidden></p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contact-message">
                  Message <span className="field__req" aria-hidden="true">*</span>
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
                <p className="field__error" id="contact-message-error" hidden></p>
              </div>

              <button
                className="btn btn--primary contact-form__submit"
                type="submit"
              >
                Send Message →
              </button>
            </form>
          </div>

          <aside className="contact-sidebar" aria-label="Contact shortcuts">
            <div className="contact-channels">
              <h2 className="contact-channels__title">Other ways to reach us</h2>
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
                      <span className="contact-channel__value">hello@techforge.ng</span>
                      <span className="contact-channel__note">
                        We typically respond within 24–48 hours.
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    className="contact-channel"
                    href="https://www.linkedin.com/company/techforge"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="contact-channel__icon contact-channel__icon--linkedin"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M6.4 9.2H3.8V20h2.6V9.2ZM5.1 4c-.9 0-1.6.7-1.6 1.6S4.2 7.2 5.1 7.2s1.6-.7 1.6-1.6S6 4 5.1 4ZM20.2 12.3c0-2.5-1.6-3.6-3.3-3.6-1.2 0-2 .5-2.5 1.3h-.1V9.2h-2.5c0 .6 0 10.8 0 10.8h2.5v-6c0-.3 0-.6.1-.8.3-.6.9-1.2 1.9-1.2 1.3 0 1.9.9 1.9 2.3V20h2.5v-7.7Z"
                        />
                      </svg>
                    </span>
                    <span className="contact-channel__body">
                      <span className="contact-channel__label">LinkedIn</span>
                      <span className="contact-channel__note">
                        Connect with us on LinkedIn for updates, partnerships
                        and community.
                      </span>
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    className="contact-channel"
                    href="https://www.instagram.com/techforge.ng"
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
                        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                      </svg>
                    </span>
                    <span className="contact-channel__body">
                      <span className="contact-channel__label">Instagram</span>
                      <span className="contact-channel__value">@techforge.ng</span>
                      <span className="contact-channel__note">
                        Follow us for the latest updates.
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="contact-enquiries">
              <p className="eyebrow contact-enquiries__eyebrow">Specific enquiries</p>
              <ul className="contact-enquiries__list">
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut('partnerships')}
                  >
                    Partnerships &amp; Sponsorships →
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut('speaking')}
                  >
                    Speaking Opportunities →
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut('media')}
                  >
                    Media &amp; Press →
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="contact-enquiries__link"
                    onClick={() => handleShortcut('general')}
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