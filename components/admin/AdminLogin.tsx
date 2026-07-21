"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Call the login API
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Store auth token and user data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      // Redirect to admin homepage
      router.push('/admin/homepage');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container" style={{ width: "100%", maxWidth: "450px", padding: "20px" }}>
      <div
        className="admin-login-card"
        style={{
          background: "var(--white)",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <div className="admin-login-logo" style={{ textAlign: "center", marginBottom: "30px" }}>
          <Image
            src="/image/logo/logo-2.png"
            alt="Al Bahar & Partners"
            width={180}
            height={45}
            style={{ margin: "0 auto" }}
          />
        </div>

        {/* Title */}
        <h2
          className="admin-login-title"
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "var(--on-suface-container)",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Admin Login
        </h2>
       

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Email Field */}
          <fieldset style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--on-suface-container)",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "16px",
                border: "1px solid var(--outline)",
                borderRadius: "8px",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--outline)";
              }}
            />
          </fieldset>

          {/* Password Field */}
          <fieldset style={{ marginBottom: "20px", position: "relative" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--on-suface-container)",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  paddingRight: "45px",
                  fontSize: "16px",
                  border: "1px solid var(--outline)",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--outline)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--on-suface-variant-1)",
                  fontSize: "18px",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </fieldset>


          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "20px",
                background: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
                color: "#c33",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="tf-btn style-1 bg-on-suface-container w-full text-center"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "500",
              borderRadius: "999px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ marginRight: "8px" }}>⏳</span>
                Logging in...
              </span>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Setup Info */}
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            background: "var(--bg-1)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--on-suface-variant-1)",
            textAlign: "center",
          }}
        >
        
        </div>
      </div>
    </div>
  );
}
