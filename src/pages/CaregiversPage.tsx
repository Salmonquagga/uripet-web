import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getResponsibles,
  addResponsible,
  removeResponsible,
} from "../api/petApi";

import type { Responsible } from "../types/Responsible";

function CaregiversPage() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingUid, setRemovingUid] = useState("");

  const [userUid, setUserUid] = useState("");
  const [accessLevel, setAccessLevel] = useState("EDITOR");
  const [responsibleRole, setResponsibleRole] = useState("FAMILY");

  const loadResponsibles = async () => {
    if (!pid) return;

    try {
      setLoading(true);
      const data = await getResponsibles(pid);
      setResponsibles(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load caregivers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponsibles();
  }, [pid]);

  const formatUid = (uid: string) => {
    if (!uid) return "-";
    if (uid.length <= 14) return uid;
    return `${uid.slice(0, 8)}...${uid.slice(-6)}`;
  };

  const clearForm = () => {
    setUserUid("");
    setAccessLevel("EDITOR");
    setResponsibleRole("FAMILY");
  };

  const handleAddResponsible = async () => {
    if (!pid) return;

    if (!userUid.trim()) {
      toast.error("Please enter the user UID.");
      return;
    }

    try {
      setSaving(true);

      await addResponsible(pid, {
        userUid: userUid.trim(),
        accessLevel,
        responsibleRole,
      });

      toast.success("Caregiver added successfully.");

      clearForm();
      await loadResponsibles();
    } catch (error) {
      console.error(error);
      toast.error(
        "Could not add caregiver. Please check the UID and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResponsible = async (responsible: Responsible) => {
    if (!pid) return;

    const confirmed = window.confirm(
      `Remove ${responsible.userName || "this caregiver"} from this pet?`
    );

    if (!confirmed) return;

    try {
      setRemovingUid(responsible.userUid);

      await removeResponsible(pid, responsible.userUid);

      toast.success("Caregiver removed successfully.");

      await loadResponsibles();
    } catch (error) {
      console.error(error);
      toast.error("Could not remove caregiver.");
    } finally {
      setRemovingUid("");
    }
  };

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
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <span>/</span>

          <button
            className="text-button"
            onClick={() => navigate(`/pets/${pid}`)}
          >
            Pet Profile
          </button>

          <span>/</span>

          <span>Caregivers</span>
        </nav>

        <button
          className="text-button"
          onClick={() => navigate(`/pets/${pid}`)}
          aria-label="Go back to pet profile"
        >
          Back to pet profile
        </button>

        <div className="panel" style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <p className="eyebrow">Caregivers</p>

              <h1 style={{ marginBottom: "6px" }}>Pet Responsibles</h1>

              <p
                style={{
                  color: "#64748b",
                  margin: 0,
                }}
              >
                Share pet access with trusted people and manage permissions.
              </p>
            </div>

            <div
              className="stat-icon"
              aria-label={`${responsibles.length} caregivers`}
            >
              {responsibles.length}
            </div>
          </div>

          <div className="pet-row" style={{ marginTop: "24px" }}>
            <strong>Pet ID</strong>
            <span>{pid}</span>
          </div>

          <div
            style={{
              marginTop: "24px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "24px",
            }}
          >
            <div className="panel" style={{ boxShadow: "none" }}>
              <h3>Add caregiver</h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label htmlFor="caregiver-uid">User UID</label>

                <input
                  id="caregiver-uid"
                  aria-label="User UID"
                  placeholder="USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                  value={userUid}
                  onChange={(event) => setUserUid(event.target.value)}
                />

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  The user can copy this UID from their profile page.
                </p>

                <label htmlFor="caregiver-access-level">
                  Access Level
                </label>

                <select
                  id="caregiver-access-level"
                  aria-label="Caregiver access level"
                  value={accessLevel}
                  onChange={(event) => setAccessLevel(event.target.value)}
                >
                  <option value="EDITOR">
                    EDITOR - Can manage pet information
                  </option>
                  <option value="VIEWER">
                    VIEWER - Can only view pet information
                  </option>
                </select>

                <label htmlFor="caregiver-role">Role</label>

                <select
                  id="caregiver-role"
                  aria-label="Caregiver role"
                  value={responsibleRole}
                  onChange={(event) => setResponsibleRole(event.target.value)}
                >
                  <option value="OWNER">OWNER</option>
                  <option value="FAMILY">FAMILY</option>
                  <option value="CARETAKER">CARETAKER</option>
                  <option value="VETERINARIAN">VETERINARIAN</option>
                </select>

                <button
                  className="primary-button"
                  type="button"
                  onClick={handleAddResponsible}
                  disabled={saving}
                  aria-label="Add caregiver"
                >
                  {saving ? "Adding..." : "Add Caregiver"}
                </button>
              </div>
            </div>

            <div className="panel" style={{ boxShadow: "none" }}>
              <div className="panel-header">
                <h3>Current caregivers</h3>
              </div>

              {loading ? (
                <div className="empty-state" aria-live="polite">
                  <h3>Loading caregivers...</h3>

                  <p>Please wait while we load the caregivers assigned to this pet.</p>
                </div>
              ) : responsibles.length === 0 ? (
                <div className="empty-state">
                  <h3>No caregivers added</h3>

                  <p>
                    You have not assigned any caregivers to this pet yet. Add trusted people
                    who can help if your pet is ever lost or needs assistance.
                  </p>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      })
                    }
                  >
                    Add Caregiver
                  </button>
                </div>
              ) : (
                <div className="pets-list" aria-label="Current caregivers list">
                  {responsibles.map((responsible) => (
                    <div
                      key={responsible.userUid}
                      className="pet-row"
                      style={{
                        alignItems: "flex-start",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <strong>{responsible.userName || "Unnamed user"}</strong>

                          <p>{responsible.userEmail}</p>
                        </div>

                        <span>{responsible.responsibleRole}</span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            marginLeft: 0,
                            background:
                              responsible.accessLevel === "EDITOR" ? "#dcfce7" : "#f1f5f9",
                            color:
                              responsible.accessLevel === "EDITOR" ? "#15803d" : "#475569",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            fontSize: "12px",
                          }}
                        >
                          {responsible.accessLevel}
                        </span>

                        <span
                          style={{
                            marginLeft: 0,
                            color: "#64748b",
                            fontSize: "13px",
                          }}
                        >
                          UID: {formatUid(responsible.userUid)}
                        </span>
                      </div>

                      <button
                        className="danger-button"
                        type="button"
                        onClick={() => handleDeleteResponsible(responsible)}
                        disabled={removingUid === responsible.userUid}
                        aria-label={`Remove ${responsible.userName || "caregiver"}`}
                        style={{
                          minHeight: "34px",
                          padding: "6px 12px",
                          marginTop: "10px",
                        }}
                      >
                        {removingUid === responsible.userUid ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CaregiversPage;