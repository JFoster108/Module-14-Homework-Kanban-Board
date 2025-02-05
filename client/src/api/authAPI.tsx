import { UserLogin } from "../interfaces/UserLogin";
import AuthService from "../utils/auth";

const API_URL = "http://localhost:5000/auth/login"; // Adjust if using an environment variable

const login = async (userInfo: UserLogin): Promise<boolean> => {
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

    return true; // ✅ Login successful
  } catch (error) {
    console.error("Login error:", error);
    return false; // ❌ Login failed
  }
};

export { login };
