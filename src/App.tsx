import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

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

function App() {
  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const [awake, setAwake] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const normalizedX =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const normalizedY =
        (event.clientY / window.innerHeight - 0.5) * 2;

      setPointer({
        x: normalizedX,
        y: normalizedY,
      });
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, []);

  const handleWake = () => {
    if (awake) return;

    setAwake(true);

    window.setTimeout(() => {
      setAwake(false);
    }, 1600);
  };

  return (
    <main
      className={`nocturne ${awake ? "is-awake" : ""}`}
      onClick={handleWake}
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
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        className="machine"
        style={
          {
            "--pointer-x": `${pointer.x * 34}px`,
            "--pointer-y": `${pointer.y * 34}px`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        <div className="machine-halo" />
        <div className="machine-aura" />

        <div className="machine-orb">
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
          <p className="eyebrow">
            THE NOCTURNE MACHINE
          </p>

          <h1>
            NOCTURNE
            <br />
            <em>MACHINE</em>
          </h1>

          <div
            className={`machine-message ${
              awake ? "message-awake" : ""
            }`}
          >
            {awake
              ? "something heard you"
              : "something is awake"}
          </div>
        </div>

        <div className="interface-bottom">
          <span>MOVE CLOSER</span>

          <button
            className="wake-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleWake();
            }}
          >
            <span className="wake-button-dot" />
            WAKE
          </button>

          <span>2026</span>
        </div>
      </section>

      <div
        className="wake-flash"
        aria-hidden="true"
      />

      <div className="status">
        <span className="status-dot" />
        <span>
          {awake ? "SIGNAL DETECTED" : "LISTENING"}
        </span>
      </div>
    </main>
  );
}

export default App;
