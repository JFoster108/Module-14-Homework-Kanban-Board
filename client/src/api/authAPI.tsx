import { UserLogin } from "../interfaces/UserLogin";
import AuthService from "../utils/auth";

const API_URL = "/auth/login"; // Adjust if using an environment variable

const login = async (userInfo: UserLogin) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ Ensures cookies (JWT) are included
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage.message || "Login failed");
    }

    const data = await response.json();
    
    // ✅ Store JWT in AuthService
    AuthService.login(data.token);

    return data; // ✅ Login successful
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject("login failed"); // ❌ Login failed
  }
};

export { login };
