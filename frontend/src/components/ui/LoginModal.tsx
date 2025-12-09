import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../../api/auth";

export default function LoginModal() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(username, password);

      if (!data.isSuccess) {
        setError(data.errorMessage || "Login failed. Please try again.");
      } else{
        login(
          { username, securityGroupId: data.securityGroupId },
          data.token
        );
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto my-8 min-h-fit">
        {/* Header with logo */}
        <div className="text-center pt-8 pb-6">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/Adagin-logo.png" 
              alt="Adagin Technologies" 
              className="h-25 w-auto"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {error && (
            <div className="text-red-600 text-sm text-center mb-4 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-slate-700 underline"
              onClick={() => {/* Handle forgot password */}}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}