export default function Home() {
  return (
    <main className="site-shell">
      <nav className="top-nav">
        <a className="logo-link" href="#" aria-label="GurukulOS home">
          <img src="/assets/gurukulos-logo.png" alt="GurukulOS — Connected Learning, Infinite Growth" />
        </a>
        <div className="nav-menu">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
          <a href="#login">Log In</a>
          <a className="demo-link" href="#demo">Request a Demo</a>
        </div>
      </nav>

      <section className="reference-hero">
        <div className="hero-copy">
          <h1>One Platform.<br />Complete Class<br />Management.</h1>
          <p>The comprehensive solution for coaching institutes and tuition centers to streamline administration and boost growth.</p>
          <a className="green-button" href="#get-started">Get Started Free</a>
        </div>
        <div className="dashboard-stage" aria-label="GurukulOS institute performance dashboard preview">
          <div className="dashboard-window">
            <aside className="dashboard-sidebar">
              <img src="/assets/gurukulos-logo.png" alt="" />
              <span className="side-item active">▦</span><span className="side-item">⌘</span><span className="side-item">♙</span><span className="side-item">□</span><span className="side-item">♡</span><span className="side-item">⚙</span>
              <span className="side-bottom">↪</span>
            </aside>
            <div className="dashboard-main">
              <div className="dashboard-userbar"><span>Institute Owner</span><span>◉ &nbsp;♧ &nbsp;👤</span></div>
              <div className="dashboard-titlebar"><div><h2>Institute Performance Overview</h2><p>Clearer-based analytics amours in institute dashboard.</p></div><button>▤ &nbsp;Analots dashboard⌄</button></div>
              <div className="dashboard-cards">
                <article className="stat-card"><span className="card-label"><b>1</b> Active Students</span><strong>1,493</strong><div className="mini-line"><i/><i/><i/><i/><i/><i/><i/></div><small>Spark lime<br/><b>13</b></small></article>
                <article className="stat-card"><span className="card-label"><b>2</b> Fee Collections</span><strong>₹14,050.00</strong><div className="bar-chart"><i/><i/><i/><i/><i/><i/></div><small>Progress person<br/><em>━━━━━━</em></small></article>
                <article className="stat-card"><span className="card-label"><b>3</b> Avg. Attendance</span><strong>42.7%</strong><div className="donut"/><small>● Attendance<br/><b>23%</b></small></article>
              </div>
              <div className="students-table"><div><b>Student Students</b><span>Search&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; All Active⌄</span></div><small>Student Name　　　　　　　　 Last Name　　　　　　　　 Standards</small></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
