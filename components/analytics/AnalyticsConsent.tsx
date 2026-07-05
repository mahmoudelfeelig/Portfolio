"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import styles from "./analyticsConsent.module.css";

type ConsentState = "accepted" | "declined" | null;

const STORAGE_KEY = "elfeel-analytics-consent";

export default function AnalyticsConsent() {
  const scriptSrc =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_SRC ??
    "https://cloud.umami.is/script.js";
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const [consent, setConsent] = useState<ConsentState>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    } else {
      setSettingsOpen(true);
    }
    setReady(true);
  }, []);

  const saveConsent = (nextConsent: Exclude<ConsentState, null>) => {
    const analyticsWasLoaded = consent === "accepted";
    window.localStorage.setItem(STORAGE_KEY, nextConsent);
    setConsent(nextConsent);
    setSettingsOpen(false);

    if (analyticsWasLoaded && nextConsent === "declined") {
      window.location.reload();
    }
  };

  if (!ready) return null;

  return (
    <>
      {consent === "accepted" && websiteId ? (
        <Script
          src={scriptSrc}
          data-website-id={websiteId}
          data-domains="elfeel.me,www.elfeel.me"
          data-do-not-track="true"
          data-exclude-search="true"
          data-performance="true"
          strategy="afterInteractive"
        />
      ) : null}

      <button
        type="button"
        className={styles.settingsButton}
        onClick={() => setSettingsOpen(true)}
      >
        Privacy settings
      </button>

      {settingsOpen ? (
        <div className={styles.backdrop}>
          <section
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-consent-title"
          >
            <span className={styles.eyebrow}>Privacy choice</span>
            <h2 id="analytics-consent-title">Optional analytics</h2>
            <p>
              This site can use Umami to measure anonymous page visits and
              which projects are opened. The analytics integration does not set
              advertising cookies or create cross-site profiles. It stays
              disabled unless you accept it.
            </p>
            <p className={styles.necessary}>
              Your choice is stored locally so the site can remember it.
            </p>
            <div className={styles.actions}>
              <button type="button" onClick={() => saveConsent("declined")}>
                Decline analytics
              </button>
              <button
                type="button"
                className={styles.accept}
                onClick={() => saveConsent("accepted")}
              >
                Accept analytics
              </button>
            </div>
            {consent ? (
              <button
                type="button"
                className={styles.cancel}
                onClick={() => setSettingsOpen(false)}
              >
                Keep current choice
              </button>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
