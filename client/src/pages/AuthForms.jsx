import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(1_0_0)] p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            switchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            switchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}

function LoginForm({ showPassword, setShowPassword, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      
      const { token, utilisateur } = response.data;

      // Store JWT and user info in secure cookies
      Cookies.set("jwt", token, { secure: true, sameSite: "strict", expires: 1 });
      Cookies.set("userEmail", utilisateur.email, { secure: true, sameSite: "strict", expires: 1 });
      Cookies.set("userRole", utilisateur.role, { secure: true, sameSite: "strict", expires: 1 });

      // Redirect based on user role
      if (utilisateur.role === "superadmin") {
        navigate("/dashboard/superadmin");
      } else if (utilisateur.role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    }
  };

  return (
    <div className="rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[oklch(0.145_0_0)]">Connexion</h1>
        <p className="mt-1 text-[oklch(0.556_0_0)]">Entrez vos identifiants pour accéder à votre compte</p>
      </div>
      {error && <div className="text-[oklch(0.577_0.245_27.325)] mb-2 text-center">{error}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="w-full rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
              Mot de passe
            </label>
            <a href="#" className="text-xs text-[oklch(47.3%_0.137_46.201)] hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.556_0_0)] hover:text-[oklch(0.145_0_0)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-[oklch(0.922_0_0)] text-[oklch(47.3%_0.137_46.201)] focus:ring-[oklch(47.3%_0.137_46.201)]"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-[oklch(0.556_0_0)]">
            Se souvenir de moi
          </label>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-[var(--radius)] bg-[oklch(47.3%_0.137_46.201)] px-4 py-2 text-[oklch(0.985_0_0)] hover:bg-[oklch(50%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2"
        >
          Se connecter
          <ArrowRight size={16} className="ml-2" />
        </button>
        <div className="text-center mt-4 text-sm">
          Pas de compte ?{" "}
          <button
            type="button"
            className="text-[oklch(47.3%_0.137_46.201)] underline"
            onClick={switchToRegister}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}

function RegisterForm({
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  switchToLogin,
}) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        nom,
        email,
        password,
      });
      
      // Optionally log in the user after registration
      if (response.data.token) {
        Cookies.set("jwt", response.data.token, { secure: true, sameSite: "strict" });
        Cookies.set("userEmail", email, { secure: true, sameSite: "strict" });
      }
      
      setSuccess("Inscription réussie. Vous pouvez vous connecter.");
      setTimeout(() => {
        switchToLogin();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] p-6 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[oklch(0.145_0_0)]">Créer un compte</h1>
        <p className="mt-1 text-[oklch(0.556_0_0)]">Remplissez le formulaire pour créer votre compte</p>
      </div>
      {error && <div className="text-[oklch(0.577_0.245_27.325)] mb-2 text-center">{error}</div>}
      {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="nom" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Nom complet
          </label>
          <input
            id="nom"
            type="text"
            placeholder="Votre nom complet"
            className="w-full rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={nom}
            onChange={e => setNom(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            className="w-full rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.556_0_0)] hover:text-[oklch(0.145_0_0)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[oklch(0.145_0_0)]">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-[var(--radius)] border border-[oklch(0.922_0_0)] bg-[oklch(1_0_0)] px-3 py-2 text-[oklch(0.145_0_0)] placeholder-[oklch(0.556_0_0)] focus:border-[oklch(47.3%_0.137_46.201)] focus:outline-none focus:ring-1 focus:ring-[oklch(47.3%_0.137_46.201)]"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.556_0_0)] hover:text-[oklch(0.145_0_0)]"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-[var(--radius)] bg-[oklch(47.3%_0.137_46.201)] px-4 py-2 text-[oklch(0.985_0_0)] hover:bg-[oklch(50%_0.137_46.201)] focus:outline-none focus:ring-2 focus:ring-[oklch(47.3%_0.137_46.201)] focus:ring-offset-2"
        >
          S'inscrire
          <ArrowRight size={16} className="ml-2" />
        </button>
        <div className="text-center mt-4 text-sm">
          Déjà un compte ?{" "}
          <button
            type="button"
            className="text-[oklch(47.3%_0.137_46.201)] underline"
            onClick={switchToLogin}
          >
            Se connecter
          </button>
        </div>
      </form>
    </div>
  );
}

export const handleLogout = async (navigate) => {
  // Remove all cookies and localStorage
  Cookies.remove("jwt");
  Cookies.remove("userEmail");
  Cookies.remove("userRole");
  localStorage.removeItem("token");
  navigate("/");
};