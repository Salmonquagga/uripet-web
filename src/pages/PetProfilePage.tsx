import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import { getPetById, deletePet } from "../api/petApi";
import type { Pet } from "../types/Pet";

function PetProfilePage() {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadPet = async () => {
      if (!pid) return;

      try {
        const data = await getPetById(pid);
        setPet(data);
      } catch {
        setError("Could not load pet information.");
        toast.error("Could not load pet information.");
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [pid]);

  const handleDelete = async () => {
    if (!pet) return;

    try {
      setDeleting(true);

      await deletePet(pet.pid);

      toast.success("Pet deleted successfully.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch {
      toast.error("Could not delete pet. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getPetImage = (currentPet: Pet) => {
    if (currentPet.imagesUrl && currentPet.imagesUrl.length > 0) {
      return currentPet.imagesUrl[0];
    }

    return "";
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="bolt-main dashboard">
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            <button
              className="text-button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <span>/</span>

            <span>Pet Profile</span>
          </nav>

          <div className="panel">
            <div className="empty-state" aria-live="polite">
              <h3>Loading pet profile...</h3>

              <p>Please wait while we load this pet's information.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="app-layout">
        <Sidebar />

        <main className="bolt-main dashboard">
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            <button
              className="text-button"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <span>/</span>

            <span>Pet Profile</span>
          </nav>

          <button
            className="text-button"
            onClick={() => navigate("/dashboard")}
          >
            Back to dashboard
          </button>

          <div className="error-message" style={{ marginTop: "20px" }}>
            {error || "Pet not found."}
          </div>
        </main>
      </div>
    );
  }

  const petImage = getPetImage(pet);

  return (
        <div className="app-layout">
      <Sidebar />

      <main className="bolt-main dashboard">
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

          <span>{pet.name}</span>
        </nav>

        <section className="pet-profile-hero">
          <div className="pet-profile-main">
            {petImage ? (
              <img
                src={petImage}
                alt={`Profile photo of ${pet.name}`}
                className="pet-profile-image"
              />
            ) : (
              <div className="pet-profile-placeholder">
                {pet.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="eyebrow">Pet Profile</p>

              <h1>{pet.name}</h1>

              <p className="pet-profile-subtitle">
                {pet.breed || pet.species || "Pet profile"}
              </p>

              <div className="pet-profile-tags">
                <span>Healthy</span>
                <span>{pet.species || "Species not set"}</span>
                <span>{pet.color || "Color not set"}</span>
              </div>
            </div>
          </div>

          <div className="pet-profile-actions">
            <button
              className="secondary-button"
              onClick={() => navigate(`/pets/${pet.pid}/health-records`)}
            >
              Health Records
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate(`/pets/${pet.pid}/caregivers`)}
            >
              Caregivers
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate(`/pets/${pet.pid}/qr`)}
            >
              QR & Emergency
            </button>

            <button
              className="primary-button"
              onClick={() => navigate(`/pets/${pet.pid}/edit`)}
            >
              Edit Pet
            </button>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Pet Details</h2>

                <p
                  style={{
                    color: "#64748b",
                    marginTop: "6px",
                  }}
                >
                  Basic information registered for this pet.
                </p>
              </div>

              <button
                className="danger-button"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Pet"}
              </button>
            </div>

            <div className="pet-detail-grid">
              <div className="pet-detail-card">
                <span>Pet ID</span>
                <strong>{pet.pid}</strong>
              </div>

              <div className="pet-detail-card">
                <span>Species</span>
                <strong>{pet.species || "-"}</strong>
              </div>

              <div className="pet-detail-card">
                <span>Breed</span>
                <strong>{pet.breed || "-"}</strong>
              </div>

              <div className="pet-detail-card">
                <span>Weight</span>
                <strong>{pet.weight ? `${pet.weight} kg` : "-"}</strong>
              </div>

              <div className="pet-detail-card">
                <span>Color</span>
                <strong>{pet.color || "-"}</strong>
              </div>

              <div className="pet-detail-card">
                <span>Emergency Contact</span>
                <strong>{pet.emergencyContact || "-"}</strong>
              </div>

              <div className="pet-detail-card">
                <span>Birth Date</span>
                <strong>{pet.birthDate || "-"}</strong>
              </div>

              <div className="pet-detail-card">
                <span>QR Code</span>
                <strong>{pet.qrCode || "-"}</strong>
              </div>
            </div>
          </div>

          <aside className="panel">
            <h2>Emergency Actions</h2>

            <p
              style={{
                color: "#64748b",
                marginTop: "6px",
                marginBottom: "18px",
              }}
            >
              Access the most important recovery tools for this pet.
            </p>

            <div className="pets-list">
              <button
                className="secondary-button"
                onClick={() => navigate(`/pets/${pet.pid}/qr`)}
              >
                View QR Code
              </button>

              <button
                className="secondary-button"
                onClick={() => window.open(`/public/pets/${pet.pid}`, "_blank")}
              >
                Open Public Profile
              </button>

              <button
                className="secondary-button"
                onClick={() => navigate(`/pets/${pet.pid}/caregivers`)}
              >
                Manage Caregivers
              </button>

              <button
                className="secondary-button"
                onClick={() => navigate(`/pets/${pet.pid}/health-records`)}
              >
                View Medical History
              </button>
            </div>
          </aside>
        </section>
                {pet.imagesUrl?.length > 0 && (
          <section className="panel" style={{ marginTop: "24px" }}>
            <div className="panel-header">
              <div>
                <h2>Photo Gallery</h2>

                <p
                  style={{
                    color: "#64748b",
                    marginTop: "6px",
                  }}
                >
                  Photos registered for this pet profile.
                </p>
              </div>
            </div>

            <div className="pet-gallery">
              {pet.imagesUrl.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${pet.name} photo ${index + 1}`}
                  className="pet-gallery-image"
                />
              ))}
            </div>
          </section>
        )}

        {showDeleteModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-pet-title"
            className="modal-backdrop"
          >
            <div className="modal-card">
              <p className="eyebrow" style={{ color: "#dc2626" }}>
                Dangerous action
              </p>

              <h2 id="delete-pet-title">Delete {pet.name}?</h2>

              <p>
                Are you sure you want to delete this pet profile? This action
                cannot be undone.
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PetProfilePage;