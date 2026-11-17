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
          <h1>Run Your Business<br />Smarter.</h1>
          <p>Whether you are starting fresh or moving from another system, bring every branch, team, student, and parent into one clear, institute-branded experience.</p>
          <a className="green-button" href="#get-started">Plan Your Setup</a>
        </div>
        <div className="dashboard-stage" aria-label="GurukulOS institute performance dashboard preview">
          <div className="dashboard-window">
            <aside className="dashboard-sidebar">
              <img src="/assets/gurukulos-logo.png" alt="" />
              <span className="side-item active">▦</span><span className="side-item">⌘</span><span className="side-item">♙</span><span className="side-item">□</span><span className="side-item">♡</span><span className="side-item">⚙</span>
              <span className="side-bottom">↪</span>
            </aside>
            <div className="dashboard-main">
              <div className="dashboard-userbar"><span>Institute Command Center</span><span>◉ &nbsp;♧ &nbsp;👤</span></div>
              <div className="dashboard-titlebar"><div><h2>All Branches Performance Overview</h2><p>See the numbers that need your attention across every branch.</p></div><button>▤ &nbsp;Branch overview⌄</button></div>
              <div className="dashboard-cards">
                <article className="stat-card"><span className="card-label"><b>1</b> Active Branches</span><strong>12</strong><div className="mini-line"><i/><i/><i/><i/><i/><i/><i/></div><small>Spark lime<br/><b>13</b></small></article>
                <article className="stat-card"><span className="card-label"><b>2</b> Fee Collection Rate</span><strong>94%</strong><div className="bar-chart"><i/><i/><i/><i/><i/><i/></div><small>Progress person<br/><em>━━━━━━</em></small></article>
                <article className="stat-card"><span className="card-label"><b>3</b> Avg. Attendance</span><strong>87.4%</strong><div className="donut"/><small>● Attendance<br/><b>23%</b></small></article>
              </div>
              <div className="students-table"><div><b>Branch Performance</b><span>Search&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; All Active⌄</span></div><small>Branch　　　　　　　　 Students　　　　　　　　 Attendance</small></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}





