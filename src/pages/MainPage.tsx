import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "QR Code Identification",
    description:
      "Each pet gets a unique QR code for instant identification and emergency access.",
  },
  {
    title: "Vaccination Tracking",
    description:
      "Keep vaccines, checkups, and important dates organized in one place.",
  },
  {
    title: "Medical Records",
    description:
      "Store allergies, medication notes, surgeries, and health history.",
  },
  {
    title: "Emergency Contacts",
    description:
      "Make critical contact information accessible when your pet needs help.",
  },
  {
    title: "Caregivers",
    description:
      "Share pet access with family, caretakers, and trusted people.",
  },
  {
    title: "Mobile Access",
    description:
      "Access pet information anywhere from a clean and responsive interface.",
  },
];

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-logo">
          <div className="landing-logo-icon">U</div>
          <span>UriPet</span>
        </div>

        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <button className="landing-link-button" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="landing-primary-button" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <div className="landing-badge">Trusted digital pet management</div>

            <h1>
              Your Pet&apos;s Digital
              <span>Health Passport</span>
            </h1>

            <p>
              Keep your pets safe with QR identification, vaccination tracking,
              emergency contacts, caregivers, and comprehensive medical records.
            </p>

            <div className="landing-hero-actions">
              <button
                className="landing-primary-button large"
                onClick={() => navigate("/register")}
              >
                Get Started Free
              </button>
            </div>
          </div>

          <div className="landing-hero-art">
            <div className="landing-orb">
              <div className="landing-card-shape"></div>
              <div className="landing-chip one"></div>
              <div className="landing-chip two"></div>
              <div className="landing-heart"></div>
            </div>
          </div>
        </section>

        <section className="landing-stats">
          <div>
            <strong>50K+</strong>
            <span>Pets Registered</span>
          </div>
          <div>
            <strong>100K+</strong>
            <span>QR Scans</span>
          </div>
          <div>
            <strong>99.9%</strong>
            <span>Uptime</span>
          </div>
          <div>
            <strong>4.9</strong>
            <span>User Rating</span>
          </div>
        </section>

        <section id="features" className="landing-features">
          <div className="landing-section-heading">
            <h2>Everything Your Pet Needs</h2>
            <p>
              Tools to manage your pet&apos;s health, safety, and wellness in one
              simple platform.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((feature) => (
              <article className="landing-feature-card" key={feature.title}>
                <div className="landing-feature-icon"></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="landing-how">
          <div className="landing-section-heading">
            <h2>Simple as 1-2-3</h2>
            <p>Get started in minutes and keep your pet protected.</p>
          </div>

          <div className="landing-steps">
            <div>
              <span>1</span>
              <h3>Register Your Pet</h3>
              <p>Add your pet&apos;s profile, health details, and emergency contact.</p>
            </div>

            <div>
              <span>2</span>
              <h3>Get QR Access</h3>
              <p>Use a public emergency profile linked to your pet&apos;s data.</p>
            </div>

            <div>
              <span>3</span>
              <h3>Stay Protected</h3>
              <p>Track health records and share access with trusted caregivers.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MainPage;