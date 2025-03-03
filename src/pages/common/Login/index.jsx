import { useState } from "react";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Login and get token
      const response = await axios.post("http://localhost:5090/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      // Set token for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Decode the JWT token to get the role
      const decodedToken = parseJwt(token);

      // Extract role from Microsoft identity claim
      const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      localStorage.setItem("userRole", role);

      // Navigate based on user role
      setIsLoading(false);
      switch (role) {
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
          navigate("/"); // Default redirect if role is not recognized
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", error);
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
          </div>
        </div>
      </div>
    </section>
  );
};

export { Login };
