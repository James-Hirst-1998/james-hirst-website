import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { scroll, pointer, look } from "../experience/scrollState";
import { sections, age, EMAIL, depthAtProgress, zoneAtDepth } from "../data/cv";

const OceanCanvas = lazy(() => import("../experience/OceanCanvas"));
import portrait from "../assets/james_headshot.png";

const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

// Adds .is-visible when the element scrolls into view (drives CSS reveals).
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const useContactButton = () => {
  const [copied, setCopied] = useState(false);
  const contact = () => {
    window.location.href = `mailto:${EMAIL}?subject=Website Contact`;
    setTimeout(() => {
      navigator.clipboard
        ?.writeText(EMAIL)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }, 100);
  };
  return [copied, contact];
};

const DepthMeter = () => {
  const valueRef = useRef(null);
  const zoneRef = useRef(null);
  const fillRef = useRef(null);
  useEffect(() => {
    let raf;
    const tick = () => {
      const depth = Math.round(depthAtProgress(scroll.progress));
      if (valueRef.current)
        valueRef.current.textContent = `-${depth.toLocaleString("en-GB")} m`;
      if (zoneRef.current) zoneRef.current.textContent = zoneAtDepth(depth);
      if (fillRef.current)
        fillRef.current.style.height = `${scroll.progress * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="depth-meter" aria-hidden="true">
      <span className="depth-meter__value" ref={valueRef}>
        -0 m
      </span>
      <div className="depth-meter__track">
        <div className="depth-meter__fill" ref={fillRef} />
      </div>
      <span className="depth-meter__zone" ref={zoneRef}>
        the surface
      </span>
    </div>
  );
};

const NavDots = () => {
  const [active, setActive] = useState("surface");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <nav className="nav-dots" aria-label="Sections">
      {sections.map((s) => (
        <button
          key={s.id}
          className={`nav-dots__dot ${active === s.id ? "is-active" : ""}`}
          aria-label={s.nav}
          onClick={() =>
            document
              .getElementById(s.id)
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="nav-dots__label">{s.nav}</span>
        </button>
      ))}
    </nav>
  );
};

// One-off nudge on phones that the view can be steered. Fades itself out
// after a few seconds, or the moment the first touch lands.
const LookHint = () => {
  const [show, setShow] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );
  useEffect(() => {
    if (!show) return undefined;
    const hide = () => setShow(false);
    const timer = setTimeout(hide, 6000);
    window.addEventListener("touchstart", hide, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("touchstart", hide);
    };
  }, [show]);
  if (!show) return null;
  return (
    <div className="look-hint" aria-hidden="true">
      Move your phone around to look
    </div>
  );
};

const Hero = () => {
  const [copied, contact] = useContactButton();
  return (
    <section className="dive-section hero" id="surface">
      <div className="hero__inner">
        <img className="hero__portrait" src={portrait} alt="James Hirst" />
        <p className="hero__hi">Hi, I'm</p>
        <h1 className="hero__name">James Hirst</h1>
        <p className="hero__tagline">
          A {age()}-year-old software engineer at Mozaic Earth, with a Masters
          in Mathematics from Cambridge and a soft spot for everything that
          lives underwater.
        </p>
        <div className="hero__buttons">
          <a
            className="btn btn--solid"
            href="/CV.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View my CV
          </a>
          <button className="btn" onClick={contact}>
            {copied ? "Email copied!" : "Contact me"}
          </button>
        </div>
      </div>
      <button
        className="hero__cue"
        onClick={() =>
          document
            .getElementById("mozaic")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span>Dive in</span>
        <span className="hero__cue-arrow">⌄</span>
      </button>
    </section>
  );
};

const SectionPanel = ({ section }) => {
  const ref = useReveal();
  return (
    <section className="dive-section" id={section.id}>
      <article className="panel" ref={ref}>
        <header className="panel__header">
          <div>
            <p className="panel__kicker">{section.kicker}</p>
            <h2 className="panel__title">{section.title}</h2>
          </div>
          {section.logo && (
            <img className="panel__logo" src={section.logo} alt="" />
          )}
        </header>
        {section.body?.map((text, i) => (
          <p className="panel__body" key={i}>
            {text}
          </p>
        ))}
        {section.bullets && (
          <ul className="panel__bullets">
            {section.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
        {section.education && (
          <div className="panel__edu">
            {section.education.map((item) => (
              <div className="panel__edu-item" key={item.title}>
                <div className="panel__edu-head">
                  <h3>{item.title}</h3>
                  <span>{item.period}</span>
                </div>
                <p>{item.detail}</p>
                <div className="panel__edu-stats">
                  {item.stats.map((stat) => (
                    <div className="panel__edu-stat" key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {section.skills && (
          <div className="panel__skills">
            {section.skills.map((group) => (
              <div className="panel__skill-group" key={group.group}>
                <h3>{group.group}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {section.cards && (
          <div className="panel__cards">
            {section.cards.map((card) => (
              <div className="panel__card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                {card.href && (
                  <a href={card.href} target="_blank" rel="noreferrer">
                    {card.linkLabel} →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        {section.highlight && (
          <div className="panel__highlight">
            <h3>{section.highlight.title}</h3>
            <p>{section.highlight.text}</p>
            <a href={section.highlight.href} target="_blank" rel="noreferrer">
              Read the paper →
            </a>
          </div>
        )}
        {(section.link || section.internalLink) && (
          <div className="panel__links">
            {section.link && (
              <a
                className="panel__link"
                href={section.link.href}
                target="_blank"
                rel="noreferrer"
              >
                {section.link.label} →
              </a>
            )}
            {section.internalLink && (
              <Link className="panel__link" to={section.internalLink.to}>
                {section.internalLink.label} →
              </Link>
            )}
          </div>
        )}
        <span className="panel__depth">{`-${section.depth.toLocaleString("en-GB")} m · ${section.zone}`}</span>
      </article>
    </section>
  );
};

const SeabedFooter = () => {
  const [copied, contact] = useContactButton();
  const ref = useReveal();
  return (
    <section className="dive-section seabed" id="seabed">
      <div className="panel seabed__panel" ref={ref}>
        <p className="panel__kicker">-10,935 m · Challenger Deep</p>
        <h2 className="panel__title">You've hit the bottom</h2>
        <p className="panel__body">
          This is Challenger Deep — the deepest point in any ocean — and you
          dived the whole way. If anything up there caught your eye — an
          opportunity, a conservation project, or just to say hi — I'd love to
          hear from you.
        </p>
        <div className="hero__buttons">
          <button className="btn btn--solid" onClick={contact}>
            {copied ? "Email copied!" : "Get in touch"}
          </button>
          <a className="btn" href="/CV.pdf" target="_blank" rel="noreferrer">
            Download CV
          </a>
        </div>
        <p className="seabed__egg">
          See anything you liked on the way down? <br /> Meet the{" "}
          <Link to="/creatures">sea creatures</Link> up close — and wait, is
          that a <Link to="/BowlOfFish">bowl of fish</Link> glowing in the sand?
        </p>
        <p className="seabed__credits">
          © {new Date().getFullYear()} James Hirst
        </p>
      </div>
    </section>
  );
};

const DivePage = () => {
  const show3D = useMemo(
    () =>
      supportsWebGL() &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.progress =
        max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };
    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Recentre when the cursor leaves so the submersible stops turning.
    const onPointerReset = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerReset);
    window.addEventListener("blur", onPointerReset);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerReset,
      );
      window.removeEventListener("blur", onPointerReset);
    };
  }, []);

  // Phone look-around: gyroscope only — pan or tilt the phone to look.
  // Swipes used to steer too, but they fought page scrolling (a vertical
  // scroll leaked wobble into yaw), so touches are left entirely to the
  // browser and the sensor owns the view.
  useEffect(() => {
    if (!show3D || !window.matchMedia("(pointer: coarse)").matches)
      return undefined;
    const clamp = (v) => Math.min(Math.max(v, -0.75), 0.75);

    // Both axes are incremental (deltas since the last reading), relative to
    // wherever the phone was pointing on the first report — so the dive
    // always starts facing forward, not at some compass heading.
    let lastAlpha = null;
    let lastBeta = null;
    const onOrientation = (e) => {
      if (e.alpha == null || e.beta == null) return;
      if (lastAlpha === null) {
        lastAlpha = e.alpha;
        lastBeta = e.beta;
        // Hand the camera to the gyro only once the sensor actually reports,
        // so denied permission / no sensor keeps the desktop pointer path.
        look.active = true;
      }
      // Unwrap alpha so turning right around keeps rotating instead of snapping.
      let step = e.alpha - lastAlpha;
      if (step > 180) step -= 360;
      if (step < -180) step += 360;
      const pitchStep = e.beta - lastBeta;
      lastAlpha = e.alpha;
      lastBeta = e.beta;
      look.yaw += (step * Math.PI) / 180;
      look.pitch = clamp(look.pitch + (pitchStep * Math.PI) / 180);
    };

    const listen = () =>
      window.addEventListener("deviceorientation", onOrientation);
    let cleanupGesture = () => {};
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS: sensor access needs a permission prompt from a user gesture,
      // so ask on the first tap.
      const request = () => {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === "granted") listen();
          })
          .catch(() => {});
        window.removeEventListener("touchend", request);
      };
      window.addEventListener("touchend", request);
      cleanupGesture = () => window.removeEventListener("touchend", request);
    } else {
      listen();
    }

    return () => {
      cleanupGesture();
      window.removeEventListener("deviceorientation", onOrientation);
      look.active = false;
    };
  }, [show3D]);

  const contentSections = sections.filter((s) => s.title);

  return (
    <div className="dive-page">
      {show3D ? (
        <Suspense
          fallback={<div className="ocean-fallback" aria-hidden="true" />}
        >
          <OceanCanvas />
        </Suspense>
      ) : (
        <div className="ocean-fallback" aria-hidden="true" />
      )}
      <DepthMeter />
      <NavDots />
      <LookHint />
      <main>
        <Hero />
        {contentSections.map((s) => (
          <SectionPanel key={s.id} section={s} />
        ))}
        <SeabedFooter />
      </main>
    </div>
  );
};

export default DivePage;
