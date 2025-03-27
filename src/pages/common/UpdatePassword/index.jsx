import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UpdatePassword = ({
  heading = "MeddiSupplyHub.com",
  subheading = "Set a new password",
  updateText = "Update Password",
  backToLoginText = "Back to login",
  loginUrl = "/login"
}) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter both fields.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Lưu mật khẩu vào localStorage (mô phỏng cập nhật)
    localStorage.setItem("userPassword", newPassword);
    
    setSuccess("Password updated successfully!");
    setError("");

    // Chuyển về trang login sau 2 giây
    setTimeout(() => {
      navigate(loginUrl);
    }, 2000);
  };

  return (
    <section className="py-32 px-80">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <p className="mb-2 text-2xl font-bold">{heading}</p>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            <div>
              <div className="grid gap-4">
                <Input 
                  type="password" 
                  placeholder="Enter new password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <Button type="button" onClick={handleUpdatePassword} className="mt-2 w-full">
                  {updateText}
                </Button>
              </div>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                <Link to={loginUrl} className="font-medium text-primary">
                  {backToLoginText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { UpdatePassword };
