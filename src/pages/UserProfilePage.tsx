import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMe } from "../api/petApi";
import type { User } from "../types/User";

function UserProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const copyUid = async () => {
    if (!user) return;

    try {
      await navigator.clipboard.writeText(user.uid);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <main className="dashboard">
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="text-button"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <span>/</span>

            <span>User Profile</span>
          </nav>

          <p aria-live="polite">Loading profile...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-layout">
        <main className="dashboard">
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              className="text-button"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <span>/</span>

            <span>User Profile</span>
          </nav>

          <button
            className="text-button"
            type="button"
            onClick={() => navigate("/dashboard")}
            aria-label="Go back to dashboard"
          >
            Back to dashboard
          </button>

          <div
            className="error-message"
            role="alert"
            style={{ marginTop: "20px" }}
          >
            Could not load user profile.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <main className="dashboard">
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            color: "#64748b",
            fontSize: "14px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="text-button"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <span>/</span>

          <span>User Profile</span>
        </nav>

        <button
          className="text-button"
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Go back to dashboard"
        >
          Back to dashboard
        </button>

        <div className="panel" style={{ marginTop: "20px" }}>
          <p className="eyebrow">Account</p>
          <h1>User Profile</h1>

          <div className="pets-list" aria-label="User profile details">
            <div className="pet-row">
              <strong>Name</strong>
              <span>{user.name}</span>
            </div>

            <div className="pet-row">
              <strong>Email</strong>
              <span>{user.email}</span>
            </div>

            <div className="pet-row">
              <strong>Phone</strong>
              <span>{user.phone}</span>
            </div>

            <div className="pet-row">
              <strong>User UID</strong>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span>{user.uid}</span>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={copyUid}
                  aria-label="Copy user UID"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="pet-row">
              <strong>Verified</strong>
              <span>{user.verified ? "Yes" : "No"}</span>
            </div>

            <div className="pet-row">
              <strong>Created At</strong>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <p style={{ marginTop: "20px", color: "#64748b" }}>
            Share your UID with another owner so they can add you as a caregiver.
          </p>
        </div>
      </main>
    </div>
  );
}

export default UserProfilePage;