import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (error || !data) {
        setError("Username atau password salah");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role === "ADMIN") {
          navigate("/admin/beranda-admin");
        } else if (data.role === "KEPSEK") {
          navigate("/kepsek/beranda-kepsek");
        } else {
          setError("Role tidak dikenali");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <div className="md:w-1/2 flex justify-center items-center bg-gray-50 p-6">
          <img src="man1.png" alt="Login" className="w-2/4 md:w-[250px]" />
        </div>
        <div className="md:w-1/2 w-full p-6 md:p-10">
          <div className="text-center text-gray-700">
            <strong className="text-2xl block">ARISMA</strong>
            <strong className="text-base md:text-lg block leading-tight mt-1">
              ARSIP DIGITAL MADRASAH ALIYAH NEGERI 1 SINTANG
            </strong>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 pr-10 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img src="visibility.png" alt="Hide" width="20px" />
                  ) : (
                    <img src="invisible-symbol.png" alt="Show" width="18px" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-2 rounded-full transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
