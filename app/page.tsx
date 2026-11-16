export default function Home() {
  return (
    <main className="site-shell">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark">✦</span> classrise
        </div>

        <div className="nav-links">
          <span>For institutes</span>
          <span>For teachers</span>
          <span>For students</span>
          <span>Sign in</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE MODERN LEARNING PLATFORM</p>

          <h1>Make progress impossible to miss.</h1>

          <p className="lede">
            One clear place for institutes to connect teaching, learning,
            and the people who make progress happen.
          </p>

          <button className="primary-button">
            Explore ClassRise <span>↗</span>
          </button>

          <p className="fine-print">
            Built for ambitious institutes and every learner they support.
          </p>
        </div>

        <div className="hero-visual">
          <div className="glow" />

          <div className="progress-card">
            <div className="card-top">
              <span>Institute progress</span>
              <span className="live-dot">● Live</span>
            </div>

            <div className="progress-number">
              82<span>%</span>
            </div>

            <div className="progress-label">learning momentum</div>

            <div className="progress-line">
              <i />
            </div>

            <div className="progress-meta">
              <span>Up 18% this term</span>
              <span>Standards 8–10</span>
            </div>
          </div>

          <div className="mini-card students">
            <b>95</b>
            <span>students connected</span>
          </div>

          <div className="mini-card teachers">
            <b>24</b>
            <span>teachers aligned</span>
          </div>
        </div>
      </section>

      <section className="trust-row">
        <span>Designed for institutes that want to move forward</span>

        <div>
          <b>Teach</b>
          <b>Learn</b>
          <b>Connect</b>
          <b>Grow</b>
        </div>
      </section>
    </main>
  );
}