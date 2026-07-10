import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  TurtleModel,
  DolphinModel,
  SharkModel,
  HammerheadModel,
  OrcaModel,
  WhaleModel,
  MantaModel,
  JellyfishModel,
  AnglerfishModel,
  GulperEelModel,
  SunfishModel,
  GiantSquidModel,
  DumboOctopusModel,
  TigerSharkModel,
  WhaleSharkModel,
  BullSharkModel,
  BlueSharkModel,
  MakoSharkModel,
  ThresherSharkModel,
  OceanicWhitetipModel,
  ZebraSharkModel,
  GoblinSharkModel,
  WobbegongModel,
  FrilledSharkModel,
  GreenlandSharkModel,
  CookiecutterSharkModel,
  EpauletteSharkModel,
  AngelSharkModel,
  PortJacksonSharkModel,
} from "../experience/Creatures";
import "../styles/creatures.css";

// Each entry pairs a model with the camera distance that frames it and a
// handful of genuinely fun facts. `offset` recentres models whose mass sits
// off the origin so they spin about their middle.
const CREATURES = [
  {
    id: "turtle",
    emoji: "🐢",
    name: "Green Sea Turtle",
    latin: "Chelonia mydas",
    zone: "Sunlit shallows",
    Model: TurtleModel,
    distance: 4.4,
    tagline: "An ancient mariner that navigates by Earth's magnetic field.",
    facts: [
      "Can hold their breath for hours and even sleep underwater.",
      "Cross entire oceans and return to the exact beach where they hatched.",
      "The temperature of the sand decides whether hatchlings are male or female.",
    ],
  },
  {
    id: "sunfish",
    emoji: "🌞",
    name: "Ocean Sunfish",
    latin: "Mola mola",
    zone: "Sunlit shallows",
    Model: SunfishModel,
    distance: 6.4,
    offset: [0, 0, 0],
    tagline: "The heaviest bony fish alive — basically a giant swimming head.",
    facts: [
      "Can weigh up to 2.3 tonnes, yet drifts along eating jellyfish.",
      "A single female may carry 300 million eggs — more than any other vertebrate.",
      "Basks on its side at the surface to warm up after deep, cold dives.",
    ],
  },
  {
    id: "dolphin",
    emoji: "🐬",
    name: "Bottlenose Dolphin",
    latin: "Tursiops truncatus",
    zone: "Sunlit shallows",
    Model: DolphinModel,
    distance: 5.2,
    tagline: "A playful acrobat that leaps clear of the water just to travel — and, it seems, for fun.",
    facts: [
      "It sleeps with one half of its brain at a time, so it never stops breathing.",
      "Each dolphin invents a signature whistle — a name it answers to for life.",
      "It hunts using echolocation, building a sound-picture of the world around it.",
    ],
  },
  {
    id: "shark",
    emoji: "🦈",
    name: "Great White Shark",
    latin: "Carcharodon carcharias",
    zone: "Sunlit to twilight",
    category: "shark",
    Model: SharkModel,
    distance: 5.8,
    tagline: "A 400-million-year-old design that senses prey by its heartbeat.",
    facts: [
      "Detects a single drop of blood in ten billion drops of water.",
      "Reads the faint electric fields of hidden prey through jelly-filled pores.",
      "Must keep swimming to breathe — stop, and it would sink.",
    ],
  },
  {
    id: "hammerhead",
    emoji: "🔨",
    name: "Hammerhead Shark",
    latin: "Sphyrna mokarran",
    zone: "Twilight zone",
    category: "shark",
    Model: HammerheadModel,
    distance: 7.2,
    tagline: "That strange head is a giant sensor array for hunting.",
    facts: [
      "The wide-set eyes give it almost 360° vision.",
      "Its hammer is packed with electro-receptors to find prey buried in sand.",
      "Unusually for sharks, they gather in schools of hundreds by day.",
    ],
  },
  {
    id: "orca",
    emoji: "🐋",
    name: "Orca",
    latin: "Orcinus orca",
    zone: "Twilight zone",
    Model: OrcaModel,
    distance: 8,
    tagline: "Not a whale at all — the ocean's largest dolphin, and its smartest hunter.",
    facts: [
      "Each pod speaks its own dialect of clicks and calls, passed down for generations.",
      "They hunt in coordinated packs — which earned them the name 'killer whale'.",
      "Found in every ocean on Earth, from the tropics to the poles.",
    ],
  },
  {
    id: "whale",
    emoji: "🐳",
    name: "Humpback Whale",
    latin: "Megaptera novaeangliae",
    zone: "Twilight zone",
    Model: WhaleModel,
    distance: 20,
    tagline: "A singer the size of a bus, felt more than seen in the haze.",
    facts: [
      "Their haunting songs travel for miles — and the whole population updates the tune each year.",
      "They blow spiralling 'bubble nets' to herd fish into a tight ball.",
      "Their flippers are the longest limbs in nature, up to a third of their body length.",
    ],
  },
  {
    id: "manta",
    emoji: "🐟",
    name: "Manta Ray",
    latin: "Mobula birostris",
    zone: "Twilight zone",
    Model: MantaModel,
    distance: 7.6,
    tagline: "A seven-metre wingspan gliding on the gentlest of wingbeats.",
    facts: [
      "Has the largest brain of any fish and may recognise itself in a mirror.",
      "Despite its size, it feeds almost entirely on tiny drifting plankton.",
      "Visits 'cleaning stations' where small fish nibble it clean.",
    ],
  },
  {
    id: "jellyfish",
    emoji: "🎐",
    name: "Jellyfish",
    latin: "Scyphozoa",
    zone: "Twilight zone",
    Model: JellyfishModel,
    distance: 3.2,
    offset: [0, 0.25, 0],
    tagline: "Older than dinosaurs, trees, and even bones.",
    facts: [
      "They've drifted the oceans for over 500 million years.",
      "No brain, no heart, no bones — a jellyfish is about 95% water.",
      "One species can age backwards to its youth, making it effectively immortal.",
    ],
  },
  {
    id: "anglerfish",
    emoji: "🎣",
    name: "Anglerfish",
    latin: "Melanocetus johnsonii",
    zone: "The midnight deep",
    Model: AnglerfishModel,
    distance: 4.4,
    tagline: "A living fishing rod glowing in the crushing dark.",
    facts: [
      "Its lure glows with light made by billions of living bacteria.",
      "Tiny males bite on and permanently fuse to the female, becoming part of her body.",
      "It lives kilometres down, where no sunlight ever reaches.",
    ],
  },
  {
    id: "gulpereel",
    emoji: "🕳️",
    name: "Gulper Eel",
    latin: "Eurypharynx pelecanoides",
    zone: "The midnight deep",
    Model: GulperEelModel,
    distance: 6.4,
    offset: [0, 0, 0.55],
    tagline: "Almost all mouth, with a glowing lantern on its tail.",
    facts: [
      "Its enormous jaw unhinges like a net to swallow prey bigger than itself.",
      "The tip of its whip-like tail glows to lure curious animals close.",
      "In the food-scarce deep, it can gulp down whatever it happens to find.",
    ],
  },
  {
    id: "giantsquid",
    emoji: "🦑",
    name: "Giant Squid",
    latin: "Architeuthis dux",
    zone: "The midnight deep",
    Model: GiantSquidModel,
    distance: 7,
    offset: [0, 0, -0.3],
    tagline: "A deep-sea legend with the largest eyes in the animal kingdom.",
    facts: [
      "Its eyes are the size of dinner plates — perfect for catching faint deep-sea light.",
      "It can grow past 12 metres, yet was never filmed alive until 2004.",
      "It duels sperm whales in the dark; the whales surface with ring-shaped sucker scars.",
    ],
  },
  {
    id: "dumbo",
    emoji: "🐙",
    name: "Dumbo Octopus",
    latin: "Grimpoteuthis",
    zone: "The abyss",
    Model: DumboOctopusModel,
    distance: 4.2,
    tagline: "The deepest-living octopus, flapping ear-like fins to fly.",
    facts: [
      "It 'flies' through the water by flapping the two fins above its eyes.",
      "It's the deepest-dwelling octopus known — found nearly 6,000 m down.",
      "Instead of biting, it swallows its prey whole.",
    ],
  },
  {
    id: "tigershark",
    emoji: "🦈",
    name: "Tiger Shark",
    latin: "Galeocerdo cuvier",
    zone: "Sunlit to twilight",
    category: "shark",
    Model: TigerSharkModel,
    distance: 5.8,
    tagline: "The ocean's rubbish bin — a curious hunter that eats almost anything.",
    facts: [
      "Juveniles wear dark vertical stripes that fade with age.",
      "License plates, tyres and even armour have been found in their stomachs.",
      "One of the few sharks that will investigate almost any potential meal.",
    ],
  },
  {
    id: "whaleshark",
    emoji: "🦈",
    name: "Whale Shark",
    latin: "Rhincodon typus",
    zone: "Sunlit shallows",
    category: "shark",
    Model: WhaleSharkModel,
    distance: 6.2,
    tagline: "The largest fish alive — a gentle giant that eats only plankton.",
    facts: [
      "Can grow to 18 metres, yet filter-feeds on some of the ocean's tiniest life.",
      "Each one has a unique pattern of spots, like a fingerprint.",
      "Completely harmless to humans despite its enormous size.",
    ],
  },
  {
    id: "bullshark",
    emoji: "🦈",
    name: "Bull Shark",
    latin: "Carcharhinus leucas",
    zone: "Sunlit shallows",
    category: "shark",
    Model: BullSharkModel,
    distance: 5.8,
    tagline: "The shark that swims up rivers — thriving in fresh water and salt.",
    facts: [
      "Has been found hundreds of miles up the Amazon and Mississippi.",
      "Special kidneys let it move between the sea and fresh water.",
      "Stocky, powerful and famously bold in shallow coastal waters.",
    ],
  },
  {
    id: "blueshark",
    emoji: "🦈",
    name: "Blue Shark",
    latin: "Prionace glauca",
    zone: "Sunlit to twilight",
    category: "shark",
    Model: BlueSharkModel,
    distance: 5.8,
    tagline: "A slender, deep-blue wanderer that crosses whole oceans.",
    facts: [
      "One of the most wide-ranging sharks, migrating thousands of miles.",
      "Its long, slim body and pointed fins make it a graceful swimmer.",
      "Vivid indigo on top fading to a bright white belly.",
    ],
  },
  {
    id: "mako",
    emoji: "🦈",
    name: "Shortfin Mako",
    latin: "Isurus oxyrinchus",
    zone: "Sunlit to twilight",
    category: "shark",
    Model: MakoSharkModel,
    distance: 5.8,
    tagline: "The fastest shark in the sea — a metallic-blue torpedo.",
    facts: [
      "Can burst to speeds of around 45 mph in pursuit of prey.",
      "Warm-blooded muscles let it stay active in cold water.",
      "Known to leap several metres clear of the surface.",
    ],
  },
  {
    id: "thresher",
    emoji: "🦈",
    name: "Thresher Shark",
    latin: "Alopias vulpinus",
    zone: "Twilight zone",
    category: "shark",
    Model: ThresherSharkModel,
    distance: 5.8,
    tagline: "Hunts with a tail as long as its whole body, whipped like a whip.",
    facts: [
      "Its enormous upper tail fin can equal its body length.",
      "It stuns schooling fish with lightning-fast tail strikes.",
      "Shy and rarely seen, spending much of its time in open water.",
    ],
  },
  {
    id: "oceanicwhitetip",
    emoji: "🦈",
    name: "Oceanic Whitetip",
    latin: "Carcharhinus longimanus",
    zone: "Sunlit to twilight",
    category: "shark",
    Model: OceanicWhitetipModel,
    distance: 5.8,
    tagline: "The bold ruler of the open ocean, with paddle-like white-tipped fins.",
    facts: [
      "Rounded fins are dipped in white, as if painted at the tips.",
      "Roams the vast open sea far from any coast.",
      "Famously confident, often first to arrive when there's food.",
    ],
  },
  {
    id: "zebrashark",
    emoji: "🦈",
    name: "Zebra Shark",
    latin: "Stegostoma tigrinum",
    zone: "Sunlit shallows",
    category: "shark",
    Model: ZebraSharkModel,
    distance: 5.8,
    tagline: "Born with stripes, grown into spots — a gentle reef-floor dweller.",
    facts: [
      "Juveniles are striped like a zebra; adults are spotted like a leopard.",
      "Rests on the seabed by day and hunts through reef crevices by night.",
      "Slender and flexible enough to wriggle into tight coral gaps.",
    ],
  },
  {
    id: "goblinshark",
    emoji: "🦈",
    name: "Goblin Shark",
    latin: "Mitsukurina owstoni",
    zone: "The midnight deep",
    category: "shark",
    Model: GoblinSharkModel,
    distance: 5.8,
    tagline: "A living fossil of the deep, with jaws that shoot out to catch prey.",
    facts: [
      "Its jaws slingshot forward to snatch prey, then retract.",
      "Pinkish skin comes from blood vessels close to the surface.",
      "A 'living fossil' — the last of a family 125 million years old.",
    ],
  },
  {
    id: "wobbegong",
    emoji: "🦈",
    name: "Tasselled Wobbegong",
    latin: "Eucrossorhinus dasypogon",
    zone: "Sunlit shallows",
    category: "shark",
    Model: WobbegongModel,
    distance: 5.8,
    tagline: "A living carpet — a master of camouflage fringed with tassels.",
    facts: [
      "A beard of skin flaps breaks up its outline against the reef.",
      "Lies motionless on the seabed, ambushing fish that stray too close.",
      "So well hidden that prey often swims straight into its mouth.",
    ],
  },
  {
    id: "frilledshark",
    emoji: "🦈",
    name: "Frilled Shark",
    latin: "Chlamydoselachus anguineus",
    zone: "The midnight deep",
    category: "shark",
    Model: FrilledSharkModel,
    distance: 5.8,
    tagline: "An eel-like relic of the deep with 300 needle-sharp teeth.",
    facts: [
      "Its long, snake-like body coils through the deep sea.",
      "Rows of trident-shaped teeth trap soft-bodied prey like squid.",
      "Rarely seen alive — another 'living fossil' of ancient lineage.",
    ],
  },
  {
    id: "greenlandshark",
    emoji: "🦈",
    name: "Greenland Shark",
    latin: "Somniosus microcephalus",
    zone: "The midnight deep",
    category: "shark",
    Model: GreenlandSharkModel,
    distance: 5.8,
    tagline: "The longest-living vertebrate — some alive for 400 years.",
    facts: [
      "May not reach maturity until around 150 years old.",
      "Cruises the frigid Arctic deep at a famously sluggish pace.",
      "Individuals swimming today may predate the steam engine.",
    ],
  },
  {
    id: "cookiecutter",
    emoji: "🦈",
    name: "Cookiecutter Shark",
    latin: "Isistius brasiliensis",
    zone: "The midnight deep",
    category: "shark",
    Model: CookiecutterSharkModel,
    distance: 5.8,
    tagline: "Small but fierce — it bites round plugs from far larger animals.",
    facts: [
      "Latches on and twists to gouge a neat, cookie-shaped chunk of flesh.",
      "Its glowing belly lures big predators within striking range.",
      "Has left its round scars on whales, sharks and even submarines.",
    ],
  },
  {
    id: "epaulette",
    emoji: "🦈",
    name: "Epaulette Shark",
    latin: "Hemiscyllium ocellatum",
    zone: "Sunlit shallows",
    category: "shark",
    Model: EpauletteSharkModel,
    distance: 5.8,
    tagline: "The shark that walks — strolling across reef flats on its fins.",
    facts: [
      "Uses its paddle-like fins to 'walk' between tide pools.",
      "Can survive hours of low oxygen by slowing its own brain.",
      "Named for the big dark spot behind each pectoral fin.",
    ],
  },
  {
    id: "angelshark",
    emoji: "🦈",
    name: "Angel Shark",
    latin: "Squatina squatina",
    zone: "Sunlit to twilight",
    category: "shark",
    Model: AngelSharkModel,
    distance: 5.8,
    tagline: "A flattened ambush hunter that looks more like a ray.",
    facts: [
      "Buries itself in sand with only its eyes showing.",
      "Explodes upward to snatch fish passing overhead.",
      "Its broad, flat body blurs the line between shark and ray.",
    ],
  },
  {
    id: "portjackson",
    emoji: "🦈",
    name: "Port Jackson Shark",
    latin: "Heterodontus portusjacksoni",
    zone: "Sunlit shallows",
    category: "shark",
    Model: PortJacksonSharkModel,
    distance: 5.8,
    tagline: "A blunt-headed bottom-dweller with a harness-like face pattern.",
    facts: [
      "Dark markings across its head look like a fitted harness.",
      "Has crushing back teeth for grinding shellfish and urchins.",
      "Lays distinctive spiral-shaped egg cases wedged into rocks.",
    ],
  },
];

// Frames the model: sits the camera back by `distance` whenever it changes.
const Rig = ({ distance }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
  }, [camera, distance]);
  return null;
};

// The turntable: drags spin the model; left alone it rotates slowly by itself.
const Turntable = ({ Model, offset, rot }) => {
  const group = useRef();
  useFrame((_, delta) => {
    const r = rot.current;
    if (!r.dragging) r.yaw += delta * 0.3;
    if (group.current) group.current.rotation.set(r.pitch, r.yaw, 0);
  });
  return (
    <group ref={group}>
      <group position={offset || [0, 0, 0]}>
        <Model />
      </group>
    </group>
  );
};

const clampPitch = (v) => Math.min(Math.max(v, -0.9), 0.9);

const CreatureStage = ({ creature }) => {
  // Shared, ref-based rotation so pointer handlers never trigger re-renders.
  const rot = useRef({ yaw: 0.6, pitch: 0, dragging: false });
  const last = useRef({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const [hint, setHint] = useState(true);

  // Reset the turntable each time a new creature is chosen.
  useEffect(() => {
    rot.current.yaw = 0.6;
    rot.current.pitch = 0;
  }, [creature.id]);

  // Mobile drag comes from native touch events, not the pointer handlers:
  // React registers touch listeners as passive, and on real devices the
  // pointer stream can be cancelled mid-drag despite touch-action, so we
  // listen with { passive: false } and preventDefault while dragging.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const onStart = (e) => {
      rot.current.dragging = true;
      last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setHint(false);
    };
    const onMove = (e) => {
      if (!rot.current.dragging) return;
      e.preventDefault(); // the stage rotates; it never scrolls the page
      const t = e.touches[0];
      const dx = t.clientX - last.current.x;
      const dy = t.clientY - last.current.y;
      last.current = { x: t.clientX, y: t.clientY };
      rot.current.yaw += dx * 0.01;
      rot.current.pitch = clampPitch(rot.current.pitch + dy * 0.01);
    };
    const onEnd = () => {
      rot.current.dragging = false;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  // Desktop drag. Touch pointers are skipped — the native handlers above own
  // them, and handling both would double every movement.
  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return;
    rot.current.dragging = true;
    last.current = { x: e.clientX, y: e.clientY };
    setHint(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (e.pointerType === "touch" || !rot.current.dragging) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rot.current.yaw += dx * 0.01;
    rot.current.pitch = clampPitch(rot.current.pitch + dy * 0.01);
  };
  const onPointerUp = (e) => {
    if (e.pointerType === "touch") return;
    rot.current.dragging = false;
  };

  return (
    <div
      ref={stageRef}
      className={`cv-stage cv-zone-${creature.id}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 45, near: 0.1, far: 200, position: [0, 0, creature.distance] }}
        gl={{ antialias: true, alpha: true }}
      >
        <Rig distance={creature.distance} />
        <ambientLight intensity={0.75} color="#cfeafc" />
        <directionalLight position={[4, 6, 6]} intensity={1.5} color="#eaf8ff" />
        <directionalLight position={[-5, -1, -4]} intensity={0.5} color="#4f9fd0" />
        <pointLight position={[0, 2, 5]} intensity={12} distance={40} color="#bfe6ff" />
        <Turntable Model={creature.Model} offset={creature.offset} rot={rot} />
      </Canvas>
      <span className={`cv-hint ${hint ? "" : "is-hidden"}`}>Drag to rotate</span>
    </div>
  );
};

// Sharks get their own labelled section in the picker; everything else keeps
// the original flat order.
const MAIN_CREATURES = CREATURES.filter((c) => c.category !== "shark");
const SHARK_CREATURES = CREATURES.filter((c) => c.category === "shark");

// Lets other pages deep-link straight to a creature via /creatures#<id>.
const initialCreatureId = () => {
  if (typeof window === "undefined") return CREATURES[0].id;
  const hash = window.location.hash.replace("#", "");
  return CREATURES.some((c) => c.id === hash) ? hash : CREATURES[0].id;
};

const CreaturesPage = () => {
  const [activeId, setActiveId] = useState(initialCreatureId);
  // Which collection the picker is showing. Starts on "sharks" when the page
  // was deep-linked to a shark (e.g. from the Shark Trust section).
  const [filter, setFilter] = useState(() =>
    SHARK_CREATURES.some((c) => c.id === initialCreatureId()) ? "sharks" : "creatures"
  );
  const creature = useMemo(
    () => CREATURES.find((c) => c.id === activeId) || CREATURES[0],
    [activeId]
  );

  const list = filter === "sharks" ? SHARK_CREATURES : MAIN_CREATURES;

  // Switching filter keeps the current pick if it belongs to the new list,
  // otherwise jumps to the first creature of that list.
  const chooseFilter = (next) => {
    if (next === filter) return;
    setFilter(next);
    const nextList = next === "sharks" ? SHARK_CREATURES : MAIN_CREATURES;
    if (!nextList.some((c) => c.id === activeId)) setActiveId(nextList[0].id);
  };

  const renderChip = (c) => (
    <button
      key={c.id}
      className={`cv-chip ${c.id === activeId ? "is-active" : ""}`}
      onClick={() => setActiveId(c.id)}
    >
      <span className="cv-chip__emoji" aria-hidden="true">
        {c.emoji}
      </span>
      <span className="cv-chip__name">{c.name}</span>
    </button>
  );

  return (
    <div className="cv-page">
      <header className="cv-header">
        <Link to="/" className="btn cv-back">
          ← Back to the dive
        </Link>
        <div className="cv-titles">
          <p className="cv-kicker">The collection</p>
          <h1 className="cv-title">Sea Creatures</h1>
        </div>
        <div className="cv-filter" role="tablist" aria-label="Filter the collection">
          <button
            role="tab"
            aria-selected={filter === "creatures"}
            className={`cv-filter__btn ${filter === "creatures" ? "is-active" : ""}`}
            onClick={() => chooseFilter("creatures")}
          >
            Sea creatures
          </button>
          <button
            role="tab"
            aria-selected={filter === "sharks"}
            className={`cv-filter__btn ${filter === "sharks" ? "is-active" : ""}`}
            onClick={() => chooseFilter("sharks")}
          >
            🦈 Sharks
          </button>
        </div>
      </header>

      <div className="cv-body">
        <CreatureStage creature={creature} />

        <aside className="cv-info" key={creature.id}>
          <p className="cv-zone">{creature.zone}</p>
          <h2 className="cv-name">{creature.name}</h2>
          <p className="cv-latin">{creature.latin}</p>
          <p className="cv-tagline">{creature.tagline}</p>
          <ul className="cv-facts">
            {creature.facts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </aside>
      </div>

      <nav className="cv-picker" aria-label="Choose a creature">
        {list.map(renderChip)}
      </nav>
    </div>
  );
};

export default CreaturesPage;
