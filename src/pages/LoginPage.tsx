import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isEmailValid && password.length > 0 && !loading;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isEmailValid) {
      setError("Ingresa un correo válido.");
      return;
    }

    if (!password) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("uid", response.uid);
      localStorage.setItem("verified", String(response.verified));

      navigate("/dashboard");
    } catch {
      setError("Credenciales incorrectas o cuenta no verificada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="brand">
        <div className="brand-icon">U</div>
        <h1>UriPet</h1>
      </div>

      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome back</h2>
        <p>Sign in to manage your pets and caregivers.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="user@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {email && !isEmailValid && (
          <small className="field-hint error-hint">
            Ingresa un correo válido.
          </small>
        )}

        <label htmlFor="password">Password</label>
        <div className="password-field">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={!canSubmit}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-link">
          New to UriPet? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;