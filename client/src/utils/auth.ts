import { JwtPayload, jwtDecode } from "jwt-decode";

class AuthService {
  // ✅ Get user profile from the decoded JWT
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  // ✅ Check if the user is logged in
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // ✅ Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true; // If no expiration, assume expired
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true; // If decoding fails, assume expired
    }
  }

  // ✅ Retrieve token from localStorage
  getToken(): string | null {
    return localStorage.getItem("id_token");
  }

  // ✅ Login: Save token & redirect
  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/"); // Redirect to homepage
  }

  // ✅ Logout: Remove token & redirect
  logout() {
    localStorage.removeItem("id_token");
    // window.location.assign("/login"); // Redirect to login page
  }
}

export default new AuthService();
