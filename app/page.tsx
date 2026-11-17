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
          <p>Whether you are starting fresh or moving from another system, bring your daily operations, people, and decisions into one clear, institute-branded experience.</p>
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
      <section className="feature-rail" aria-label="GurukulOS capabilities">
        <div className="feature-rail-heading"><span>Everything your institutes need to grow, now in one place</span><small>One connected platform to simplify operations, strengthen engagement, and support confident growth.</small></div>
        <div className="feature-marquee">
          <div className="feature-track">
            {[['fees-follow-ups.png','Fees & Follow-Ups'],['attendance-tracking.png','Attendance Tracking'],['staff-management.png','Staff Management'],['students-parents-portal.png','Students & Parents Portal'],['multi-branch-reports.png','Multi-Branch Reports'],['video-lectures.png','Video Lectures & Premium Content'],['payroll-calculations.png','Payroll Calculations'],['auto-timetable-setup.png','Auto Time-Table Setup'],['revision-courses.png','Revision Courses'],['enquiries-to-admission.png','Enquiries to Admission'],['student-performance-feedback.png','Student Performance & Feedback'],['tests-exams-results.png','Tests, Exams & Results']].map(([image,label]) => <div className="feature-image-card" key={label}><img src={`/assets/features/${image}`} alt=""/><span>{label}</span></div>)}
            {[['fees-follow-ups.png','Fees & Follow-Ups'],['attendance-tracking.png','Attendance Tracking'],['staff-management.png','Staff Management'],['students-parents-portal.png','Students & Parents Portal'],['multi-branch-reports.png','Multi-Branch Reports'],['video-lectures.png','Video Lectures & Premium Content'],['payroll-calculations.png','Payroll Calculations'],['auto-timetable-setup.png','Auto Time-Table Setup'],['revision-courses.png','Revision Courses'],['enquiries-to-admission.png','Enquiries to Admission'],['student-performance-feedback.png','Student Performance & Feedback'],['tests-exams-results.png','Tests, Exams & Results']].map(([image,label]) => <div className="feature-image-card" key={`copy-${label}`}><img src={`/assets/features/${image}`} alt=""/><span>{label}</span></div>)}
          </div>
        </div>
      </section>      <section className="trust-proof" aria-label="Why institutes choose GurukulOS">
        <div className="trust-proof-intro"><span className="eyebrow">SAMPLE TRUST PROOF · PREVIEW ONLY</span><h2>The operating advantage growing institutes can feel every day.</h2><p>Replace these sample proof points with verified customer results, testimonials, and institute logos before launch.</p></div>
        <div className="trust-proof-grid">
          <article><h3>40+ Institute teams</h3><p>Sample metric showing how many growing institutes use the platform.</p></article>
          <article><h3>12k+ Learner records organized</h3><p>Sample metric showing the scale of connected student and parent operations.</p></article>
          <article><h3>“A calmer way to run every branch.”</h3><p>Replace this placeholder with a verified customer testimonial before launch.</p></article>
        </div>
      </section>
    </main>
  );
}