import Sidebar from "../components/Sidebar";

function HelpPage() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="bolt-main dashboard">
        <p className="eyebrow">Support Center</p>

        <h1>Help & Support</h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "32px",
          }}
        >
          Learn how UriPet works and find answers to common questions.
        </p>

        <div className="pets-list">
          <div className="panel">
            <h2>What is UriPet?</h2>

            <p>
              UriPet is a digital platform that helps pet owners manage pet
              profiles, medical information, caregivers and QR identification
              for emergencies.
            </p>
          </div>

          <div className="panel">
            <h2>How does the QR code work?</h2>

            <p>
              Every pet has a unique QR code. If someone finds your pet, they
              can scan the QR code and view public information that helps them
              contact you.
            </p>
          </div>

          <div className="panel">
            <h2>What information can someone see?</h2>

            <p>
              The public profile can display your pet's name, species, emergency
              contact information and other details that you choose to share.
            </p>
          </div>

          <div className="panel">
            <h2>How do I add caregivers?</h2>

            <p>
              Open a pet profile and navigate to the caregivers section. You can
              add trusted people who may help manage your pet information.
            </p>
          </div>

          <div className="panel">
            <h2>What should I do if my pet gets lost?</h2>

            <p>
              Make sure your pet has updated emergency information and an active
              QR code. Anyone who scans the QR code will be able to access the
              public profile and contact you.
            </p>
          </div>
        </div>

        <div
          className="panel"
          style={{
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <h2>Still need help?</h2>

          <p
            style={{
              color: "#64748b",
              marginBottom: "24px",
            }}
          >
            Our support team is here to help you.
          </p>

          <button
            className="primary-button"
            onClick={() =>
                window.open(
                "mailto:support@uripet.com?subject=UriPet Support Request"
                )
            }
            >
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
}

export default HelpPage;