import { Infinity, MessagesSquare, Zap, ZoomIn } from "lucide-react";

const feature = [
  {
    title: "Quality",
    description:
      "Uncompromising Quality for Optimal Medical Supply Management.",
    icon: <ZoomIn className="size-6" />,
  },
  {
    title: "Innovation",
    description:
      "Cutting-Edge Technology to Streamline Your Warehouse Operations.",
    icon: <Zap className="size-6" />,
  },
  {
    title: "Customer Support",
    description:
      "Dedicated Support, Because Your Success is Our Priority.",
    icon: <MessagesSquare className="size-6" />,
  },
  {
    title: "Reliability",
    description:
      "A Secure and Dependable System You Can Trust, Every Time.",
    icon: <Infinity className="size-6" />,
  },
];

const Feature = () => {
  return (
    <section className="px-20">
      <div className="container">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm text-muted-foreground">WHY WE ARE UNIQUE</p>
            <h2 className="text-3xl font-medium md:text-5xl">
              Delivering Excellence: Trusted by Industry Experts
            </h2>

            <p className="text-muted-foreground md:max-w-2xl">
            </p>
          </div>
        </div>
        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
          {feature.map((feature, idx) => (
            <div
              className="flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[300px] md:p-8"
              key={idx}
            >
              <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-background">
                {feature.icon}
              </span>
              <div>
                <h3 className="text-lg font-medium md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Feature };
