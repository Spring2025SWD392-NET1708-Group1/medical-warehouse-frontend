import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { AuthService } from "@/services/authService";

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
  const token = localStorage.getItem("token");


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

      if (response.data) {
        localStorage.removeItem("token");
        // Store token in localStorage
        localStorage.setItem("token", response.data);

        // Store full response for debugging
        setDebugInfo({
          responseData: response.data,
          responseKeys: Object.keys(response.data),
          responseType: typeof response.data
        });
        AuthService.handleUserNavigation(navigate)
        setIsLoading(false);
      } else {
        setError('Server did not return a token.')
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
