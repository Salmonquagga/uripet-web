import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPublicPetById } from "../api/petApi";
import type { Pet } from "../types/Pet";

function PublicPetPage() {
  const { pid } = useParams();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const loadPet = async () => {
      if (!pid) {
        setError("Emergency pet information could not be found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getPublicPetById(pid);
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
      <div className="public-pet-page">
        <div className="public-pet-card public-pet-status-card">
          <p aria-live="polite">Loading emergency information...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="public-pet-page">
        <div className="public-pet-card public-pet-status-card">
          <div className="public-pet-error" role="alert">
            {error || "Emergency pet information could not be found."}
          </div>
        </div>
      </div>
    );
  }

  const emergencyPhone = pet.emergencyContact?.trim();
  const mainImage = pet.imagesUrl?.[0];

  return (
    <div className="public-pet-page">
      <main className="public-pet-card">
        <section className="public-pet-hero">
          <p className="public-pet-eyebrow">Emergency Pet Profile</p>
          <h1>Hello, I&apos;m {pet.name}</h1>
          <p>
            If you found me, please contact my family using the information below.
          </p>
        </section>

        <section className="public-pet-body">
          {mainImage ? (
            <img
              src={mainImage}
              alt={`Profile photo of ${pet.name}`}
              className="public-pet-image"
            />
          ) : (
            <div
              className="public-pet-placeholder"
              role="img"
              aria-label={`${pet.name} profile placeholder`}
            >
              {pet.name.charAt(0).toUpperCase()}
            </div>
          )}

          <p className="public-pet-description">
            This public page contains essential information to help return this pet
            safely. Please use the emergency contact only for pet recovery.
          </p>

          <div className="public-pet-info-grid" aria-label="Emergency pet information">
            <InfoCard label="Pet ID" value={pet.pid} />
            <InfoCard label="Species" value={pet.species || "-"} />
            <InfoCard label="Breed" value={pet.breed || "-"} />
            <InfoCard label="Color" value={pet.color || "-"} />
            <InfoCard label="Weight" value={pet.weight ? `${pet.weight} kg` : "-"} />
            <InfoCard label="Birth Date" value={pet.birthDate || "-"} />
            <InfoCard label="Emergency Contact" value={emergencyPhone || "-"} full />
          </div>

          <div className="public-pet-actions">
            <button
              className="public-pet-primary-button"
              type="button"
              onClick={handleFoundPet}
              disabled={loadingLocation}
            >
              {loadingLocation ? "Preparing location..." : "I Found This Pet"}
            </button>

            {emergencyPhone && (
              <a className="public-pet-secondary-button" href={`tel:${emergencyPhone}`}>
                Call Emergency Contact
              </a>
            )}
          </div>

          {locationError && (
            <div className="public-pet-error" role="alert">
              {locationError}
            </div>
          )}

          <p className="public-pet-note">
            Location sharing only happens after pressing the button and granting
            browser permission.
          </p>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "public-pet-info-card full" : "public-pet-info-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default PublicPetPage;