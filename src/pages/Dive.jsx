import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { scroll, pointer, look } from "../experience/scrollState";
import { sections, age, EMAIL, depthAtProgress, zoneAtDepth } from "../data/cv";
import {
  DIVE_CREATURE_IDS,
  getSpotVersion,
  getSpottedCount,
  subscribeSpotted,
} from "../experience/diveLog";
import { track } from "../analytics";

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
    track("contact_clicked");
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
    // Only touch the DOM when the displayed value actually changes - writing
    // textContent replaces the text node even for an identical string, which
    // is per-frame layout work (and fed PostHog's recorder a mutation storm).
    const last = { depth: NaN, zone: "", height: NaN };
    const tick = () => {
      const depth = Math.round(depthAtProgress(scroll.progress));
      if (depth !== last.depth && valueRef.current) {
        last.depth = depth;
        valueRef.current.textContent = `-${depth.toLocaleString("en-GB")} m`;
      }
      const zone = zoneAtDepth(depth);
      if (zone !== last.zone && zoneRef.current) {
        last.zone = zone;
        zoneRef.current.textContent = zone;
      }
      const height = Math.round(scroll.progress * 1000) / 10;
      if (height !== last.height && fillRef.current) {
        last.height = height;
        fillRef.current.style.height = `${height}%`;
      }
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

// The dive log badge: a small ring in the top corner that fills as creatures
// are spotted. It doesn't exist until the first sighting - the scale-in and
// pulse of that moment is the whole tutorial. Hover (or a first tap on touch)
// slides out the count; committing goes to the gallery, where sightings
// unlock the locked silhouettes.
const RING_R = 21.5;
const RING_C = 2 * Math.PI * RING_R;

const DiveLogBadge = () => {
  useSyncExternalStore(subscribeSpotted, getSpotVersion);
  const count = getSpottedCount();
  const total = DIVE_CREATURE_IDS.length;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const closeTimer = useRef();
  const prevCount = useRef(count);

  // One soft pulse per new sighting. The first sighting mounts the badge, so
  // its arrival is announced by the appear animation instead.
  useEffect(() => {
    if (count > prevCount.current) {
      setPulsing(true);
      const timer = setTimeout(() => setPulsing(false), 900);
      prevCount.current = count;
      return () => clearTimeout(timer);
    }
    prevCount.current = count;
    return undefined;
  }, [count]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  if (count === 0) return null;

  const onClick = () => {
    // Desktop hover already shows the count, so a click commits straight to
    // the gallery. On touch the first tap only peeks the count and the second
    // commits - a stray thumb never teleports anyone off the dive.
    if (window.matchMedia("(hover: hover)").matches || open) {
      track("dive_log_opened", { count, total });
      navigate("/creatures");
      return;
    }
    setOpen(true);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 3000);
  };

  return (
    <button
      className={`dive-log ${open ? "is-open" : ""} ${pulsing ? "is-pulsing" : ""} ${
        count === total ? "is-complete" : ""
      }`}
      onClick={onClick}
      aria-label={`Creatures spotted: ${count} of ${total}. Open the gallery.`}
    >
      <span className="dive-log__count">{`${count} / ${total} spotted`}</span>
      <span className="dive-log__circle">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle className="dive-log__track" cx="24" cy="24" r={RING_R} />
          <circle
            className="dive-log__fill"
            cx="24"
            cy="24"
            r={RING_R}
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - count / total)}
          />
        </svg>
        <span className="dive-log__fish" aria-hidden="true">
          🐟
        </span>
      </span>
    </button>
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

// One-off nudge on phones that the view can be steered, pinned to the top of
// the screen so it stays clear of the hero buttons. On iOS ("ask") it's a real
// button that opens the motion-permission dialog - Safari only accepts the
// request from a tap; elsewhere ("hint") it's passive and fades on its own.
const LookHint = ({ state, onEnable }) => {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (state !== "hint" && state !== "ask") return undefined;
    const timer = setTimeout(
      () => setExpired(true),
      state === "ask" ? 12000 : 6000,
    );
    let hide;
    if (state === "hint") {
      hide = () => setExpired(true);
      window.addEventListener("touchstart", hide, {
        once: true,
        passive: true,
      });
    }
    return () => {
      clearTimeout(timer);
      if (hide) window.removeEventListener("touchstart", hide);
    };
  }, [state]);
  if (expired) return null;
  if (state === "ask") {
    return (
      <button className="look-hint look-hint--tap" onClick={onEnable}>
        Tap to look around with your phone
      </button>
    );
  }
  if (state === "hint") {
    return (
      <div className="look-hint" aria-hidden="true">
        Move your phone around to look
      </div>
    );
  }
  return null;
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
            onClick={() => track("cv_opened", { location: "hero" })}
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
          This is Challenger Deep - the deepest point in any ocean - and you
          dived the whole way. If anything up there caught your eye - an
          opportunity, a conservation project, or just to say hi - I'd love to
          hear from you.
        </p>
        <div className="hero__buttons">
          <button className="btn btn--solid" onClick={contact}>
            {copied ? "Email copied!" : "Get in touch"}
          </button>
          <a
            className="btn"
            href="/CV.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => track("cv_opened", { location: "seabed" })}
          >
            Download CV
          </a>
        </div>
        <p className="seabed__egg">
          See anything you liked on the way down? <br /> Meet the{" "}
          <Link to="/creatures">sea creatures</Link> up close - and wait, is
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

  // Drives the top-of-screen look hint: "ask" = iOS needs a tap to unlock the
  // sensor, "hint" = sensor should just work, "active"/"denied"/"off" = hidden.
  const [gyroState, setGyroState] = useState(() => {
    if (typeof window === "undefined") return "off";
    if (!window.matchMedia("(pointer: coarse)").matches) return "off";
    return typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
      ? "ask"
      : "hint";
  });
  const requestGyro = useRef(() => {});

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.progress =
        max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };
    const onPointer = (e) => {
      // iOS fires pointer events for touches too. Without this, a scroll
      // swipe that ends near a screen edge parks pointer.x past the yaw
      // deadzone and the desktop steering path spins the camera forever -
      // touch steering is gyro-only.
      if (e.pointerType === "touch") return;
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

  // Phone look-around: gyroscope only - pan or tilt the phone to look.
  // Swipes used to steer too, but they fought page scrolling (a vertical
  // scroll leaked wobble into yaw), so touches are left entirely to the
  // browser and the sensor owns the view.
  useEffect(() => {
    if (!show3D || !window.matchMedia("(pointer: coarse)").matches)
      return undefined;
    const clamp = (v, lim) => Math.min(Math.max(v, -lim), lim);
    const RAD = Math.PI / 180;

    // Where the back of the phone points, from the full device rotation
    // R = Rz(alpha)·Rx(beta)·Ry(gamma) applied to (0, 0, -1). Yaw/pitch are
    // read off this vector rather than raw alpha/beta: held upright in
    // portrait - exactly how people browse - the device sits at the Euler
    // gimbal lock, where alpha and gamma trade sudden 180° flips (raw-alpha
    // deltas read as violent yaw spikes, and tilting up past vertical fought
    // back). The forward vector stays continuous through all of it, and it's
    // screen-orientation-proof for free.
    const forward = (alpha, beta, gamma) => {
      const ca = Math.cos(alpha);
      const sa = Math.sin(alpha);
      const cb = Math.cos(beta);
      const sb = Math.sin(beta);
      const cg = Math.cos(gamma);
      const sg = Math.sin(gamma);
      return {
        x: -ca * sg - sa * sb * cg,
        y: -sa * sg + ca * sb * cg,
        z: -cb * cg,
      };
    };

    // Both axes are incremental (deltas since the last reading), relative to
    // wherever the phone was pointing on the first report - so the dive
    // always starts facing forward, not at some compass heading.
    let last = null;
    const onOrientation = (e) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      const f = forward(e.alpha * RAD, e.beta * RAD, e.gamma * RAD);
      const pitch = Math.asin(clamp(f.z, 1));
      // Yaw is undefined with the phone pointed straight at sky or floor -
      // hold the previous heading through that cone.
      const yaw =
        Math.hypot(f.x, f.y) > 0.05
          ? Math.atan2(-f.x, f.y)
          : (last?.yaw ?? 0);
      const now = performance.now();

      if (last === null) {
        last = { yaw, pitch, at: now };
        // Hand the camera to the gyro only once the sensor actually reports,
        // so denied permission / no sensor keeps the desktop pointer path.
        look.active = true;
        setGyroState("active");
        track("gyro_look_activated");
        return;
      }
      if (now - last.at > 200) {
        // iOS parks sensor events for the length of a scroll. Applying the
        // rotation accumulated across that gap snapped the view the moment a
        // free scroll ended - re-baseline instead, so the view stays put and
        // tracking resumes from wherever the phone is pointing now.
        last = { yaw, pitch, at: now };
        return;
      }
      // Unwrap yaw so turning right around keeps rotating instead of snapping.
      let dYaw = yaw - last.yaw;
      if (dYaw > Math.PI) dYaw -= 2 * Math.PI;
      if (dYaw < -Math.PI) dYaw += 2 * Math.PI;
      const dPitch = pitch - last.pitch;
      last = { yaw, pitch, at: now };
      // Per-event cap: one 60 Hz step can't legitimately be ~20°+; anything
      // bigger is sensor junk that would kick the camera.
      look.yaw += clamp(dYaw, 0.35);
      look.pitch = clamp(look.pitch + clamp(dPitch, 0.35), 0.75);
    };

    const listen = () =>
      window.addEventListener("deviceorientation", onOrientation);
    let cleanupGesture = () => {};
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS: the sensor sits behind a permission dialog that Safari will only
      // open from a real tap - a scroll swipe's touchend rejects the request.
      // Asking once on the first touchend and giving up left motion dead
      // whenever the visit started with a swipe (i.e. almost always), so keep
      // retrying on every genuine tap until the dialog actually answers.
      let inFlight = false;
      const request = () => {
        if (inFlight) return;
        inFlight = true;
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            cleanupGesture();
            if (state === "granted") {
              listen();
              setGyroState("hint");
            } else {
              setGyroState("denied");
              track("gyro_permission_denied");
            }
          })
          .catch(() => {
            // Not a tap Safari accepts - wait for the next one.
            inFlight = false;
          });
      };
      requestGyro.current = request;
      // The hint button asks, but so does any real tap anywhere - while a
      // swipe's touchend must not (it would fail the gesture test and pop
      // the dialog mid-scroll).
      let start = null;
      const onTouchStart = (e) => {
        start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };
      const onTouchEnd = (e) => {
        if (!start) return;
        const t = e.changedTouches[0];
        const moved = Math.hypot(t.clientX - start.x, t.clientY - start.y);
        start = null;
        // Taps on links/buttons carry their own intent (the hint button asks
        // via its onClick) - don't stack the dialog on top of them.
        if (moved < 12 && !e.target.closest?.("a, button")) request();
      };
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      cleanupGesture = () => {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        requestGyro.current = () => {};
      };
    } else {
      listen();
    }

    return () => {
      cleanupGesture();
      window.removeEventListener("deviceorientation", onOrientation);
      look.active = false;
    };
  }, [show3D]);

  // How far people actually dive: fire once as each quartile is crossed, and
  // once on reaching the seabed. Polled off rAF like the depth meter.
  useEffect(() => {
    const milestones = [25, 50, 75];
    const fired = new Set();
    let reachedSeabed = false;
    let raf;
    const tick = () => {
      const pct = scroll.progress * 100;
      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track("dive_depth_reached", {
            percent: m,
            depth: Math.round(depthAtProgress(scroll.progress)),
          });
        }
      }
      if (scroll.progress >= 0.995 && !reachedSeabed) {
        reachedSeabed = true;
        track("dive_reached_seabed");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
      {show3D && <DiveLogBadge />}
      {show3D && (
        <LookHint state={gyroState} onEnable={() => requestGyro.current()} />
      )}
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
