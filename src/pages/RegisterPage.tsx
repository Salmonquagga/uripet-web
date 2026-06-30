import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = /^[0-9]{9}$/.test(phone);
  const isPasswordValid = password.length >= 8;

  const canSubmit =
    isNameValid && isEmailValid && isPhoneValid && isPasswordValid && !loading;

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isNameValid) {
      setError("Ingresa tu nombre completo.");
      return;
    }

    if (!isEmailValid) {
      setError("Ingresa un correo válido.");
      return;
    }

    if (!isPhoneValid) {
      setError("Ingresa un teléfono válido de 9 dígitos.");
      return;
    }

    if (!isPasswordValid) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      navigate(`/verify?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setError(
        "No se pudo crear la cuenta. Revisa si el correo ya está registrado."
      );
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

      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Create your account</h2>
        <p>Register as a person first.</p>

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          type="text"
          placeholder="Adriana Matumay"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        {name && !isNameValid && (
          <small className="field-hint error-hint">
            El nombre debe tener al menos 2 caracteres.
          </small>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="adriana@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {email && !isEmailValid && (
          <small className="field-hint error-hint">
            Ingresa un correo válido.
          </small>
        )}

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          placeholder="987654321"
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
          maxLength={9}
        />

        {phone && !isPhoneValid && (
          <small className="field-hint error-hint">
            El teléfono debe tener 9 dígitos.
          </small>
        )}

        <label htmlFor="password">Password</label>
        <div className="password-field">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
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

        {password && !isPasswordValid && (
          <small className="field-hint error-hint">
            La contraseña debe tener al menos 8 caracteres.
          </small>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={!canSubmit}>
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;