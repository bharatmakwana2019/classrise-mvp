const audienceCards = [
  {
    icon: "▣",
    title: "For Institutes",
    text: "Manage admissions, classes and performance with ease.",
  },
  {
    icon: "▤",
    title: "For Teachers",
    text: "Plan, teach and track progress effortlessly.",
  },
  {
    icon: "◆",
    title: "For Students",
    text: "Learn at your own pace and reach new heights.",
  },
  {
    icon: "●",
    title: "For Parents",
    text: "Stay informed, support learning and celebrate growth.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <nav className="nav">
          <div className="brand">
            <span className="brand-icon">↗</span>
            <span>
              Class<span>Rise</span>
            </span>
          </div>

          <div className="nav-links">
            <span>For institutes⌄</span>
            <span>For teachers⌄</span>
            <span>For students⌄</span>
            <button className="sign-in">Sign in</button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">THE MODERN LEARNING PLATFORM</p>

            <h1>
              Make progress
              <strong> impossible to miss.</strong>
            </h1>

            <p className="hero-description">
              Track. Support. Achieve. — All in one powerful education platform
              for institutes, teachers, students and parents.
            </p>

            <div className="hero-actions">
              <button className="primary-button">
                Explore ClassRise <span>→</span>
              </button>

              <button className="demo-button">
                <span className="play-icon">▶</span>
                Watch demo
              </button>
            </div>
          </div>

          <div className="dashboard-area">
            <div className="dashboard-glow" />

            <div className="dashboard">
              <div className="dashboard-header">
                <div className="dashboard-brand">
                  <span className="small-brand-icon">↗</span>
                  ClassRise
                </div>

                <span className="date-filter">Last 30 Days⌄</span>
              </div>

              <div className="dashboard-top">
                <div className="student-stat">
                  <div className="stat-icon">●●</div>
                  <strong>95</strong>
                  <span>Students</span>
                  <small>↑ 12% <em>vs. prior period</em></small>
                </div>

                <div className="line-chart">
                  <span className="chart-value">92%</span>
                  <div className="chart-line">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>

              <div className="learning-progress">
                <div>
                  <h3>Learning Progress</h3>

                  <div className="progress-ring">
                    <span>78%</span>
                  </div>
                </div>

                <div className="progress-legend">
                  <p>
                    <i className="excellent" />
                    Excellent <b>45%</b>
                  </p>
                  <p>
                    <i className="track" />
                    On Track <b>33%</b>
                  </p>
                  <p>
                    <i className="attention" />
                    Needs Attention <b>22%</b>
                  </p>
                </div>
              </div>
            </div>

            <div className="achievement-card">
              <div className="trophy">🏆</div>
              <strong>Achievement Unlocked!</strong>
              <b>Top Performer</b>
              <span>+50 points</span>
            </div>
          </div>
        </div>

        <div className="hero-wave" />
      </section>

      <section className="audience-section">
        <div className="audience-grid">
          {audienceCards.map((card) => (
            <article className="audience-card" key={card.title}>
              <div className="audience-icon">{card.icon}</div>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
              <a href="#">{`Learn more  →`}</a>
            </article>
          ))}
        </div>

        <div className="metrics">
          <div>
            <strong>★</strong>
            <span>
              <b>4.8/5</b>
              Customer Satisfaction
            </span>
          </div>

          <div>
            <strong>●●●</strong>
            <span>
              <b>2M+</b>
              Students Empowered
            </span>
          </div>

          <div>
            <strong>🏆</strong>
            <span>
              <b>500+</b>
              Institutes Trust ClassRise
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}