import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verify } from "../api/authApi";

function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await verify({
        email,
        code,
      });

      setMessage(response.message || "Account verified successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch {
      setError("Invalid verification code or email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="brand">
        <div className="brand-icon">🐾</div>
        <h1>UriPet</h1>
      </div>

      <form className="auth-card" onSubmit={handleVerify}>
        <h2>Verify your account</h2>
        <p>Enter the code sent to your email.</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="adriana@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label>Verification code</label>
        <input
          type="text"
          placeholder="123456"
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify account"}
        </button>

        <p className="auth-link">
          Already verified? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default VerifyPage;