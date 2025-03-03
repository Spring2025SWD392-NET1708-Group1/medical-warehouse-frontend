import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import axios from "axios";

const Login = ({
  heading = "MeddiSupplyHub.com",
  subheading = "Welcome back",
  logo = {
    url: "https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716",
    src: "https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716",
    alt: "logo"
  },
  loginText = "Log in",
  googleText = "Log in with Google",
  signupText = "Don't have an account?",
  signupUrl = "#"
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  // Function to decode JWT token without using external libraries
  const parseJwt = (token) => {
    try {
      // Get the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      // Replace characters for valid base64 string
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      // Parse the JSON
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT", error);
      return null;
    }
  };

  const extractTokenFromResponse = (responseData) => {
    // Log the exact response structure for debugging
    console.log("API Response:", responseData);

    // If responseData is a string, try to parse it as JSON
    if (typeof responseData === 'string') {
      try {
        responseData = JSON.parse(responseData);
      } catch (e) {
        // If it's not valid JSON, see if it's a token directly
        if (responseData.split('.').length === 3) {
          return responseData; // It might be a raw JWT token
        }
      }
    }

    // Common response structures
    // Case 1: {token: "..."}
    if (responseData.token) {
      return responseData.token;
    }

    // Case 2: {data: {token: "..."}}
    if (responseData.data && responseData.data.token) {
      return responseData.data.token;
    }

    // Case 3: {access_token: "..."}
    if (responseData.access_token) {
      return responseData.access_token;
    }

    // Case 4: {auth: {token: "..."}}
    if (responseData.auth && responseData.auth.token) {
      return responseData.auth.token;
    }

    // Case 5: {data: "..."} - where data is the token itself
    if (responseData.data && typeof responseData.data === 'string' && responseData.data.split('.').length === 3) {
      return responseData.data;
    }

    // Case 6: The response itself might be the token
    if (typeof responseData === 'string' && responseData.split('.').length === 3) {
      return responseData;
    }

    // Log all keys in the response for debugging
    console.log("Response keys:", Object.keys(responseData));

    return null; // No token found
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setDebugInfo(null);

    try {
      // Login request
      const response = await axios.post("http://localhost:5090/api/auth/login", {
        email,
        password,
      });

      // Store full response for debugging
      setDebugInfo({
        responseData: response.data,
        responseKeys: Object.keys(response.data),
        responseType: typeof response.data
      });

      // Try to extract token from various response formats
      const token = extractTokenFromResponse(response.data);

      if (!token) {
        console.error("Token extraction failed", response.data);
        setError("Token extraction failed. Please check console for details.");
        setIsLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set token for all future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Decode the JWT token
      const decodedToken = parseJwt(token);

      if (!decodedToken) {
        setError("Failed to decode token. Token might be invalid.");
        setIsLoading(false);
        return;
      }

      // Log the decoded token for debugging
      console.log("Decoded token:", decodedToken);
      setDebugInfo(prev => ({ ...prev, decodedToken }));

      // Extract role from token
      // Common claim formats for role in JWT
      const possibleRolePaths = [
        "role",
        "roles",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
        "https://schemas.microsoft.com/ws/2008/06/identity/claims/role",
        "custom:role"
      ];

      let userRole = null;

      // Try to find role in any of the possible paths
      for (const path of possibleRolePaths) {
        if (decodedToken[path]) {
          userRole = Array.isArray(decodedToken[path])
            ? decodedToken[path][0]  // If it's an array, take the first role
            : decodedToken[path];    // If it's a string, use it directly
          console.log(`Found role in ${path}:`, userRole);
          break;
        }
      }

      // If no role found yet, check all properties
      if (!userRole) {
        console.log("Searching all token properties for role");
        const allKeys = Object.keys(decodedToken);
        for (const key of allKeys) {
          const value = decodedToken[key];
          console.log(`Checking key ${key}:`, value);

          if (typeof value === 'string') {
            // Check if the value itself is a role name
            if (['admin', 'staff', 'manager'].includes(value.toLowerCase())) {
              userRole = value;
              console.log(`Found role in key ${key}:`, userRole);
              break;
            }

            // Check if the key contains the word "role"
            if (key.toLowerCase().includes('role')) {
              userRole = value;
              console.log(`Found potential role in key ${key}:`, userRole);
              break;
            }
          }
        }
      }

      if (userRole) {
        // Normalize role to ensure consistent capitalization
        const normalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
        console.log("Normalized role:", normalizedRole);

        // Store user role
        localStorage.setItem("userRole", normalizedRole);

        // Navigate based on user role
        setIsLoading(false);

        switch (normalizedRole) {
          case "Admin":
            navigate("/admin");
            break;
          case "Staff":
            navigate("/staff");
            break;
          case "Manager":
            navigate("/manager");
            break;
          default:
            // If role doesn't match expected values, still allow login but warn
            console.warn(`Unrecognized role: ${normalizedRole}`);
            setDebugInfo(prev => ({ ...prev, warning: `Unrecognized role: ${normalizedRole}` }));
            navigate("/");
        }
      } else {
        // If no role was found
        console.error("No role found in token");
        setError("No role found in the token. You might not have appropriate permissions.");
        setDebugInfo(prev => ({ ...prev, error: "No role found in token" }));
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status} ${error.response.statusText || ''}`);
        setDebugInfo({
          errorType: "Response error",
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
        setDebugInfo({
          errorType: "Request error",
          request: "Request sent but no response received"
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
        setDebugInfo({
          errorType: "Setup error",
          message: error.message
        });
      }
    }
  };

  return (
    <section className="py-32 px-80">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <a href={logo.url}>
                <img src={logo.src} alt={logo.alt} className="h-20 w-20" />
              </a>
              <p className="mb-2 text-2xl font-bold">{heading}</p>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                {error && <p className="text-red-500">{error}</p>}
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-muted-foreground" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password
                  </Link>
                </div>
                <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : loginText}
                </Button>
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button>
              </div>
            </form>
            <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>{signupText}</p>
              <a href={signupUrl} className="font-medium text-primary">
                Sign up
              </a>
            </div>

            {/* Debug information (only for development) */}
            {debugInfo && (
              <div className="mt-4 border-t pt-4 text-xs text-gray-500">
                <details>
                  <summary className="cursor-pointer font-bold">Debug Info (click to expand)</summary>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-2">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login };
