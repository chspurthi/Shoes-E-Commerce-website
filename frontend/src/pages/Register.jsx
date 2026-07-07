import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2">Create account</h1>
      <p className="text-slate mb-8">Join VoltStride to track orders and check out faster.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required placeholder="Full name" value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
        />
        <input
          type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
        />
        <input
          type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white"
        />
        {error && <p className="text-rust text-sm">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full bg-ink text-bone font-display py-3 rounded-full hover:bg-volt hover:text-ink transition-colors disabled:opacity-50"
        >
          {loading ? "CREATING..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ink font-semibold underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
