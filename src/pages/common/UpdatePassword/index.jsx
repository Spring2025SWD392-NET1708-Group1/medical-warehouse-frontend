import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UpdatePassword = ({
  heading = "MeddiSupplyHub.com",
  subheading = "Set a new password",

  logo = {
    url: "https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716",
    src: "https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716",
    alt: "logo"
  },

  updateText = "Update Password",
  backToLoginText = "Back to login",
  loginUrl = "/login"
}) => {
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
            <div>
              <div className="grid gap-4">
                <Input type="password" placeholder="Enter new password" required />
                <Input type="password" placeholder="Confirm new password" required />
                <Button type="submit" className="mt-2 w-full">
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
