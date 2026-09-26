import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

type Mode = "awaken" | "telepathic" | "disturb";

const particles: Particle[] = Array.from(
  { length: 60 },
  (_, index) => ({
    id: index,
    x: (index * 47.37) % 100,
    y: (index * 73.19) % 100,
    size: 1 + ((index * 17) % 20) / 10,
    duration: 9 + ((index * 13) % 90) / 10,
    delay: -((index * 29) % 80) / 10,
    drift: -45 + ((index * 31) % 90),
  }),
);

const faqItems = [
  {
    question: "What is Nocturne Machine?",
    answer:
      "An interactive design experiment exploring curiosity, perception, and responsive interfaces.",
  },
  {
    question: "How do I interact with it?",
    answer:
      "Start with Touch-to-Awaken. Then try Telepathic Connection by moving your cursor near the orb and seeing whether it notices. Finally, try Double-Tap-to-Disturb.",
  },
  {
    question: "What is Telepathic Connection?",
    answer:
      "A cursor-based interaction that lets the machine respond to your movements. At first it follows. Then it starts noticing patterns, anticipating you, and occasionally doing something you did not ask it to do.",
  },
  {
    question: "Is it a game?",
    answer:
      "Not exactly. It is a prototype of an interaction system that could become a mechanic for a game, animation, or interactive story.",
  },
  {
    question: "What is Double-Tap-to-Disturb?",
    answer:
      "A simple discovery interaction. Tap twice as if you're knocking on something that shouldn't be hollow. The machine gets increasingly suspicious.",
  },
  {
    question: "Could these interactions be used elsewhere?",
    answer:
      "Yes. The exact same interaction system could become a reusable mechanic for games, animation, and interactive storytelling. Touch-to-Awaken could activate objects, characters, memories, or environments, while Telepathic Connection could make characters, objects, or environments respond to attention, movement, or inferred intent, and Double-Tap-to-Disturb could trigger hidden reactions or interruptions.",
  },
  {
    question: "What was the idea behind it?",
    answer:
      "To create an interface that teaches you how it works through response rather than instruction—and to see whether curiosity could become the reason someone keeps interacting.",
  },
  {
    question: "Why does it not explain everything?",
    answer:
      "Because curiosity is part of the interaction.",
  },
];

function App() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [awake, setAwake] = useState(false);
  const [mode, setMode] = useState<Mode>("awaken");
  const [telepathyLevel, setTelepathyLevel] = useState(0);
  const [telepathyMessage, setTelepathyMessage] = useState("");
  const [faqOpen, setFaqOpen] = useState(false);
  const [wakeCount, setWakeCount] = useState(0);
  const [disturbCount, setDisturbCount] = useState(0);
  const [machineComment, setMachineComment] = useState("");
  const wakeTimer = useRef<number | null>(null);
  const tapTimer = useRef<number | null>(null);
  const tapCount = useRef(0);
  const telepathyNearCount = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;

      setPointer({ x: normalizedX, y: normalizedY });

      if (mode === "telepathic") {
        const movement = Math.hypot(event.clientX - lastPointer.current.x, event.clientY - lastPointer.current.y);
        lastPointer.current = { x: event.clientX, y: event.clientY };
        if (movement > 6) {
          const rect = document.querySelector(".machine-orb")?.getBoundingClientRect();
          if (rect) {
            const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
            if (distance < rect.width * 0.95) {
              telepathyNearCount.current += 1;
              const n = telepathyNearCount.current;
              const responses = ["I felt that.","you're over there.","I can see you.","you came back.","you're getting predictable.","I knew you'd do that.","stop thinking so loudly.","wait. that wasn't what I expected.","you felt that too, didn't you?","I was waiting for you."];
              const index = Math.min(responses.length - 1, Math.floor((n - 1) / 3));
              setTelepathyLevel(Math.min(7, index + 1));
              setTelepathyMessage(responses[index]);
            }
          }
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mode]);

  useEffect(() => {
    return () => {
      if (wakeTimer.current) window.clearTimeout(wakeTimer.current);
      if (tapTimer.current) window.clearTimeout(tapTimer.current);
    };
  }, []);

  const handleWake = () => {
    if (wakeTimer.current) window.clearTimeout(wakeTimer.current);
    setAwake(true);
    setWakeCount((count) => {
      const nextCount = count + 1;
      if (nextCount === 2) {
        setMachineComment("you found the stim button");
      } else if (nextCount === 3) {
        setMachineComment("you are still doing it");
      } else if (nextCount >= 4) {
        setMachineComment("this is now your entire personality");
      } else {
        setMachineComment("something heard you");
      }
      return nextCount;
    });
    wakeTimer.current = window.setTimeout(() => setAwake(false), 1600);
  };

  const handleOrbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (mode === "awaken") {
      handleWake();
      return;
    }

    if (mode === "disturb") {
      tapCount.current += 1;
      setAwake(true);
      if (tapTimer.current) window.clearTimeout(tapTimer.current);

      if (tapCount.current === 1) {
        setMachineComment("…");
      } else {
        tapCount.current = 0;
        setDisturbCount((count) => {
          const nextCount = count + 1;
          const responses = [
            "excuse me?",
            "why are you knocking?",
            "we're not doing this.",
            "that was unnecessarily loud.",
            "please stop interrogating the orb.",
            "it is pretending not to hear you.",
            "you've made the situation worse.",
            "this is becoming a little embarrassing.",
            "the orb would like a word.",
            "the orb has declined to comment.",
            "that was your second warning.",
            "you have officially disturbed the machine.",
            "the machine is reconsidering this relationship.",
            "you knocked. it remembers.",
            "something on the other side is annoyed.",
            "congratulations. now it's awkward.",
            "the orb has requested boundaries.",
            "you really thought that would help?",
            "there is definitely something home.",
            "okay. now you're just being nosy.",
          ];
          setMachineComment(responses[(nextCount - 1) % responses.length]);
          return nextCount;
        });
      }

      tapTimer.current = window.setTimeout(() => {
        tapCount.current = 0;
      }, 1100);
      return;
    }

    if (mode === "telepathic") {
      setMachineComment(telepathyMessage || "I felt that.");
      return;
    }
  };

  const chooseMode = (nextMode: Mode) => {
    if (tapTimer.current) window.clearTimeout(tapTimer.current);
    tapCount.current = 0;
    setMode(nextMode);
    setTelepathyLevel(0);
    setTelepathyMessage("");
    telepathyNearCount.current = 0;
    setDisturbCount(0);
    setAwake(false);
    setMachineComment(
      nextMode === "awaken"
        ? "approach it. see what happens."
        : nextMode === "telepathic"
          ? "think at it. see what happens."
          : "go ahead. knock.",
    );
  };

  const rootStyle = {
    "--pointer-x": `${pointer.x * 34}px`,
    "--pointer-y": `${pointer.y * 34}px`,
  } as CSSProperties;

  const machineClass = [
    "machine",
    mode === "disturb" && awake ? "is-disturbing" : "",
    mode === "telepathic" && telepathyLevel > 0 ? "is-telepathic" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main
      className={`nocturne ${awake ? "is-awake" : ""}`}
      style={rootStyle}
    >
      <div className="atmosphere atmosphere-one" />
      <div className="atmosphere atmosphere-two" />

      <div className="particle-field" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={
              {
                "--particle-x": `${particle.x}%`,
                "--particle-y": `${particle.y}%`,
                "--particle-size": `${particle.size}px`,
                "--particle-duration": `${particle.duration}s`,
                "--particle-delay": `${particle.delay}s`,
                "--particle-drift": `${particle.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className={machineClass}>
        <div className="machine-halo" />
        <div className="machine-aura" />

        <div
          className="machine-orb"
          role="button"
          tabIndex={0}
          aria-label={
            mode === "awaken"
              ? "Touch to awaken the Nocturne Machine"
              : mode === "telepathic"
                ? "Slide across the orb to reveal hidden colors"
                : "Tap the orb twice to disturb it"
          }
          onPointerDown={handleOrbPointerDown}
                    onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && mode === "awaken") {
              event.preventDefault();
              handleWake();
            }
          }}
        >
          <div className="distortion-field" />
          <div className="liquid-tendrils" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
          <div className="machine-orb-surface" />
          <div className="machine-core" />
          <div className="machine-highlight" />
        </div>

        <div className="machine-ring machine-ring-one" />
        <div className="machine-ring machine-ring-two" />
      </div>

      <section className="interface">
        <div className="interface-top">
          <span>LOGIC &amp; LUSTER</span>
          <span>EXPERIMENT 001</span>
        </div>

        <div className="title-block">
          <p className="eyebrow">THE NOCTURNE MACHINE</p>

          <h1>
            NOCTURNE
            <br />
            <em>MACHINE</em>
          </h1>

          <div className={`machine-message ${awake ? "message-awake" : ""}`}>
            {machineComment ||
              (mode === "telepathic" && telepathyMessage
                ? telepathyMessage
                : awake
                  ? "something heard you"
                  : "approach it. see what happens.")}
          </div>

          <div className="mode-switcher" aria-label="Interaction mode">
            <button type="button" className={mode === "awaken" ? "is-selected" : ""} onClick={() => chooseMode("awaken")}>
              <span>Touch-to-Awaken</span>
              <small>Wake it gently.</small>
            </button>
            <button type="button" className={mode === "telepathic" ? "is-selected" : ""} onClick={() => chooseMode("telepathic")}>
              <span>Telepathic Connection</span>
              <small>Think at it. See what happens.</small>
            </button>
            <button type="button" className={mode === "disturb" ? "is-selected" : ""} onClick={() => chooseMode("disturb")}>
              <span>Double-Tap-to-Disturb</span>
              <small>Knock twice.</small>
            </button>
          </div>
        </div>

        <div className="interface-bottom">
          <span>
            {mode === "awaken" ? "TOUCH / CLICK" : mode === "telepathic" ? "MOVE / NOTICE" : "TAP / TAP"}
          </span>

          <button className="faq-button" type="button" onClick={() => setFaqOpen(true)}>
            FAQ
          </button>

          <span>2026</span>
        </div>
      </section>

      <div className="wake-flash" aria-hidden="true" />

      <div className="status">
        <span className="status-dot" />
        <span>
          {mode === "telepathic" && telepathyLevel >= 6
            ? "CONNECTION ESTABLISHED"
            : mode === "telepathic" && telepathyLevel > 0
              ? "SIGNAL RETURNED"
              : disturbCount > 0 && mode === "disturb"
                ? "DISTURBED"
                : awake
                  ? "SIGNAL DETECTED"
                  : "STANDBY"}
        </span>
      </div>

      {faqOpen && (
        <div className="faq-overlay" role="dialog" aria-modal="true" aria-labelledby="faq-title">
          <div className="faq-panel">
            <div className="faq-heading">
              <div>
                <p className="faq-kicker">NOCTURNE MACHINE</p>
                <h2 id="faq-title">A few things worth knowing.</h2>
              </div>
              <button type="button" className="faq-close" aria-label="Close FAQ" onClick={() => setFaqOpen(false)}>
                ×
              </button>
            </div>

            <div className="faq-list">
              {faqItems.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>

            <p className="faq-footer">Go ahead. See what it does.</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
