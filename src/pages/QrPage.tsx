import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

import { getPetById, getPetQrData } from "../api/petApi";
import type { Pet } from "../types/Pet";
import type { PetQrData } from "../api/petApi";

function QrPage() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement | null>(null);

  const [pet, setPet] = useState<Pet | null>(null);
  const [qrData, setQrData] = useState<PetQrData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQrData = async () => {
      if (!pid) return;

      try {
        const petResponse = await getPetById(pid);
        const qrResponse = await getPetQrData(pid);

        setPet(petResponse);
        setQrData(qrResponse);
      } catch {
        setError("Could not load QR information.");
        toast.error("Could not load QR information.");
      } finally {
        setLoading(false);
      }
    };

    loadQrData();
  }, [pid]);

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

            <span>QR & Emergency</span>
          </nav>

          <h2 aria-live="polite">Loading QR information...</h2>
        </main>
      </div>
    );
  }

  if (error || !pet || !qrData) {
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

            <span>QR & Emergency</span>
          </nav>

          <button
            className="text-button"
            onClick={() => navigate(`/pets/${pid}`)}
            aria-label="Go back to pet profile"
          >
            Back to pet profile
          </button>

          <div className="error-message" style={{ marginTop: "20px" }}>
            {error || "Could not load QR information."}
          </div>
        </main>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/public/pets/${pet.pid}`;

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);
      toast.success("Public link copied successfully.");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Could not copy the public link.");
    }
  };

  const downloadQr = () => {
    if (!qrRef.current || !pet) {
      toast.error("Could not download QR code.");
      return;
    }

    const svg = qrRef.current.querySelector("svg");

    if (!svg) {
      toast.error("Could not download QR code.");
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const image = new Image();

    canvas.width = 900;
    canvas.height = 900;

    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Could not download QR code.");
      return;
    }

    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    image.onload = () => {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 90, 90, 720, 720);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `uripet-qr-${pet.pid}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR downloaded successfully.");
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error("Could not download QR code.");
    };

    image.src = url;
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

          <span>QR & Emergency</span>
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
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            <div>
              <p className="eyebrow">QR & Emergency</p>

              <h1 style={{ marginBottom: "10px" }}>Emergency Profile</h1>

              <p style={{ color: "#64748b", margin: 0 }}>
                Generate and share this QR code to help others contact you if
                your pet gets lost.
              </p>
            </div>

            <div
              className="stat-icon"
              aria-label={`Public QR status ${
                qrData.public ? "on" : "off"
              }`}
            >
              {qrData.public ? "ON" : "OFF"}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "24px",
            }}
          >
            <div className="panel" style={{ boxShadow: "none" }}>
              <p className="eyebrow">Public Emergency Link</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  marginBottom: "24px",
                }}
              >
                <div
                  ref={qrRef}
                  aria-label={`QR code for ${pet.name} public emergency profile`}
                  style={{
                    background: "#ffffff",
                    padding: "22px",
                    borderRadius: "24px",
                    border: "1px solid #dce8e2",
                  }}
                >
                  <QRCode value={publicUrl} size={220} />
                </div>
              </div>

              <div
                aria-label="Public emergency profile link"
                style={{
                  border: "1px solid #dce8e2",
                  borderRadius: "14px",
                  padding: "16px",
                  background: "#f9fcfb",
                  wordBreak: "break-all",
                  color: "#102a43",
                  fontWeight: 700,
                }}
              >
                {publicUrl}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <button
                  className="primary-button"
                  type="button"
                  onClick={copyPublicUrl}
                  aria-label="Copy public emergency link"
                >
                  {copied ? "Copied" : "Copy Link"}
                </button>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={downloadQr}
                  aria-label="Download QR code as PNG"
                >
                  Download QR
                </button>
              </div>

              <div
                style={{
                  marginTop: "24px",
                  padding: "18px",
                  borderRadius: "16px",
                  border: "1px solid #dce8e2",
                  background: "#f9fcfb",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
                  Emergency Access
                </h3>

                <p style={{ marginBottom: "10px" }}>
                  Anyone with this QR can access the public emergency
                  information.
                </p>

                <p style={{ marginBottom: "10px" }}>
                  Print this QR and attach it to your pet's collar tag.
                </p>

                <p style={{ margin: 0 }}>
                  Keep your emergency contact information updated.
                </p>
              </div>
            </div>

            <div className="panel" style={{ boxShadow: "none" }}>
              <p className="eyebrow">Pet Summary</p>

              <div className="pets-list" aria-label="Pet QR summary">
                <div className="pet-row">
                  <strong>Pet Name</strong>
                  <span>{pet.name}</span>
                </div>

                <div className="pet-row">
                  <strong>Pet ID</strong>
                  <span>{qrData.pid}</span>
                </div>

                <div className="pet-row">
                  <strong>Public QR Status</strong>
                  <span>{qrData.public ? "Public" : "Private"}</span>
                </div>

                <div className="pet-row">
                  <strong>Species</strong>
                  <span>{pet.species}</span>
                </div>

                <div className="pet-row">
                  <strong>Breed</strong>
                  <span>{pet.breed || "-"}</span>
                </div>

                <div className="pet-row">
                  <strong>Emergency Contact</strong>
                  <span>{pet.emergencyContact || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QrPage;