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

const CreatureStage = ({ creature }) => {
  // Shared, ref-based rotation so pointer handlers never trigger re-renders.
  const rot = useRef({ yaw: 0.6, pitch: 0, dragging: false });
  const last = useRef({ x: 0, y: 0 });
  const [hint, setHint] = useState(true);

  // Reset the turntable each time a new creature is chosen.
  useEffect(() => {
    rot.current.yaw = 0.6;
    rot.current.pitch = 0;
  }, [creature.id]);

  const clampPitch = (v) => Math.min(Math.max(v, -0.9), 0.9);

  const onPointerDown = (e) => {
    rot.current.dragging = true;
    last.current = { x: e.clientX, y: e.clientY };
    setHint(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!rot.current.dragging) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rot.current.yaw += dx * 0.01;
    rot.current.pitch = clampPitch(rot.current.pitch + dy * 0.01);
  };
  const onPointerUp = () => {
    rot.current.dragging = false;
  };

  return (
    <div
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

const CreaturesPage = () => {
  const [activeId, setActiveId] = useState(CREATURES[0].id);
  const creature = useMemo(
    () => CREATURES.find((c) => c.id === activeId) || CREATURES[0],
    [activeId]
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
        {CREATURES.map((c) => (
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
        ))}
      </nav>
    </div>
  );
};

export default CreaturesPage;
