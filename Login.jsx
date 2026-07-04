import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2">Sign in</h1>
      <p className="text-slate mb-8">Welcome back to VoltStride.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
        />
        <input
          type="password" required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
        />
        {error && <p className="text-rust text-sm">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full bg-ink text-bone font-display py-3 rounded-full hover:bg-volt hover:text-ink transition-colors disabled:opacity-50"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        No account?{" "}
        <Link to="/register" className="text-ink font-semibold underline">
          Create one
        </Link>
      </p>

      <div className="mt-8 text-xs text-slate bg-white border border-black/5 rounded-xl p-4">
        <p className="font-semibold mb-1">Demo accounts (after running the seed script):</p>
        <p>Admin — admin@voltstride.com / admin123</p>
        <p>User — user@voltstride.com / user123</p>
      </div>
    </div>
  );
};

export default Login;
