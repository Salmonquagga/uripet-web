import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <p className="eyebrow">404 ERROR</p>

        <h1
          style={{
            fontSize: "72px",
            marginBottom: "12px",
            color: "#16a34a",
          }}
        >
          404
        </h1>

        <h2
          style={{
            marginBottom: "12px",
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "32px",
          }}
        >
          The page you are looking for does not exist or may have been moved.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;