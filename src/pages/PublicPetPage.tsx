import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Pet } from "../types/Pet";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function PublicPetPage() {
  const { pid } = useParams();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const loadPet = async () => {
      if (!pid) return;

      try {
        const response = await fetch(`${API_URL}/pets/public/${pid}`);

        if (!response.ok) {
          throw new Error("Could not load public pet.");
        }

        const data: Pet = await response.json();
        setPet(data);
      } catch (err) {
        console.error("Public pet error:", err);
        setError("Could not load emergency pet information.");
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [pid]);

  const cleanPhoneNumber = (phone?: string) => {
    if (!phone) return "";

    const onlyNumbers = phone.replace(/\D/g, "");

    if (onlyNumbers.startsWith("51")) return onlyNumbers;
    if (onlyNumbers.length === 9) return `51${onlyNumbers}`;

    return onlyNumbers;
  };

  const handleFoundPet = () => {
    if (!pet) return;

    const phoneNumber = cleanPhoneNumber(pet.emergencyContact);

    if (!phoneNumber) {
      setLocationError("This pet does not have an emergency contact available.");
      return;
    }

    if (!navigator.geolocation) {
      const fallbackMessage = encodeURIComponent(
        `Hello, I found ${pet.name}. Please contact me to coordinate the return.`
      );

      window.open(`https://wa.me/${phoneNumber}?text=${fallbackMessage}`, "_blank");
      return;
    }

    setLoadingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

        const message = encodeURIComponent(
          `Hello, I found ${pet.name}. My current location is: ${mapsLink}`
        );

        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
        setLoadingLocation(false);
      },
      () => {
        const fallbackMessage = encodeURIComponent(
          `Hello, I found ${pet.name}. I could not share my location automatically, but I would like to contact you.`
        );

        window.open(`https://wa.me/${phoneNumber}?text=${fallbackMessage}`, "_blank");

        setLocationError(
          "Location permission was not granted. A WhatsApp message without location was prepared."
        );

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p aria-live="polite">Loading emergency information...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="error-message" role="alert">
            {error || "Emergency pet information could not be found."}
          </div>
        </div>
      </div>
    );
  }

  const emergencyPhone = pet.emergencyContact?.trim();

  return (
    <div className="auth-page">
      <div
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "540px",
          padding: "0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white",
            padding: "30px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: "12px",
            }}
          >
            Emergency Pet Profile
          </p>

          <h1 style={{ margin: "12px 0 0", fontSize: "36px" }}>
            Hello, I&apos;m {pet.name}
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.6,
            }}
          >
            If you found me, please contact my family using the information below.
          </p>
        </div>

        <div style={{ padding: "28px" }}>
          {pet.imagesUrl?.length > 0 ? (
            <img
              src={pet.imagesUrl[0]}
              alt={`Profile photo of ${pet.name}`}
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "28px",
                objectFit: "cover",
                border: "1px solid #dce8e2",
                marginBottom: "18px",
              }}
            />
          ) : (
            <div
              role="img"
              aria-label={`${pet.name} profile placeholder`}
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "28px",
                background: "#dcfce7",
                color: "#16a34a",
                fontSize: "42px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
              }}
            >
              {pet.name.charAt(0).toUpperCase()}
            </div>
          )}

          <p style={{ color: "#64748b", marginTop: 0, lineHeight: 1.6 }}>
            This public page contains essential information to help return this pet
            safely. Please use the emergency contact only for pet recovery.
          </p>

          <div className="pets-list" aria-label="Emergency pet information">
            <div className="pet-row">
              <strong>Pet ID</strong>
              <span>{pet.pid}</span>
            </div>

            <div className="pet-row">
              <strong>Species</strong>
              <span>{pet.species || "-"}</span>
            </div>

            <div className="pet-row">
              <strong>Breed</strong>
              <span>{pet.breed || "-"}</span>
            </div>

            <div className="pet-row">
              <strong>Color</strong>
              <span>{pet.color || "-"}</span>
            </div>

            <div className="pet-row">
              <strong>Emergency Contact</strong>
              <span>{emergencyPhone || "-"}</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", marginTop: "22px" }}>
            <button
              className="primary-button"
              type="button"
              onClick={handleFoundPet}
              disabled={loadingLocation}
            >
              {loadingLocation ? "Preparing location..." : "I Found This Pet"}
            </button>

            {emergencyPhone && (
              <a
                className="secondary-button"
                href={`tel:${emergencyPhone}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Call Emergency Contact
              </a>
            )}
          </div>

          {locationError && (
            <div className="error-message" role="alert" style={{ marginTop: "18px" }}>
              {locationError}
            </div>
          )}

          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginTop: "20px",
              lineHeight: 1.5,
            }}
          >
            Location sharing only happens after pressing the button and granting
            browser permission.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicPetPage;