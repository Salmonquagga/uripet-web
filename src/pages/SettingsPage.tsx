import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";

function SettingsPage() {
  const handleComingSoon = () => {
    toast.info("This setting will be available soon.");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="dashboard">
        <p className="eyebrow">Account preferences</p>

        <h1>Settings</h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "32px",
          }}
        >
          Manage your account preferences, privacy options and application
          information.
        </p>

        <div className="dashboard-grid">
          <section className="panel">
            <h2>Account</h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "22px",
              }}
            >
              Review your basic account information.
            </p>

            <div className="pets-list">
              <div className="pet-row">
                <strong>Name</strong>
                <span>Current user</span>
              </div>

              <div className="pet-row">
                <strong>Email</strong>
                <span>Registered email</span>
              </div>

              <div className="pet-row">
                <strong>Phone</strong>
                <span>Registered phone</span>
              </div>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={handleComingSoon}
              style={{
                marginTop: "20px",
              }}
            >
              Edit Account Information
            </button>
          </section>

          <section className="panel">
            <h2>Privacy</h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "22px",
              }}
            >
              Choose what information should be visible when someone scans your
              pet's QR code.
            </p>

            <div className="pets-list">
              <label className="settings-option">
                <input type="checkbox" defaultChecked />

                <span>Show emergency contact in public profile</span>
              </label>

              <label className="settings-option">
                <input type="checkbox" defaultChecked />

                <span>Show pet basic information</span>
              </label>

              <label className="settings-option">
                <input type="checkbox" />

                <span>Show health summary in public profile</span>
              </label>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={handleComingSoon}
              style={{
                marginTop: "20px",
              }}
            >
              Save Privacy Preferences
            </button>
          </section>

          <section className="panel">
            <h2>Application</h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "22px",
              }}
            >
              Customize your UriPet experience.
            </p>

            <div className="pets-list">
              <div className="pet-row">
                <strong>Theme</strong>
                <span>Light mode</span>
              </div>

              <div className="pet-row">
                <strong>Notifications</strong>
                <span>Enabled</span>
              </div>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={handleComingSoon}
              style={{
                marginTop: "20px",
              }}
            >
              Customize App
            </button>
          </section>

          <section className="panel">
            <h2>About UriPet</h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "22px",
              }}
            >
              UriPet helps families protect their pets with digital profiles,
              QR identification and emergency contact information.
            </p>

            <div className="pets-list">
              <div className="pet-row">
                <strong>Version</strong>
                <span>1.0.0</span>
              </div>

              <div className="pet-row">
                <strong>Support</strong>
                <span>support@uripet.com</span>
              </div>

              <div className="pet-row">
                <strong>Status</strong>
                <span>Active</span>
              </div>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={() =>
                window.open(
                  "mailto:support@uripet.com?subject=UriPet Support Request"
                )
              }
              style={{
                marginTop: "20px",
              }}
            >
              Contact Support
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;