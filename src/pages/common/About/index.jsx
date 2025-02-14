import { CircleArrowRight, Files, Settings } from "lucide-react"
const About = () => {
  return (
    <section className="py-32 px-20">
      <div className="container flex flex-col gap-28">
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-7xl">
            Bringing the power of software to everyone
          </h1>
          <p className="max-w-xl text-lg">
            At MediSupply, we revolutionize medical warehouse management with cutting-edge technology, precision, and reliability. Our mission is to empower healthcare providers with a seamless, efficient, and secure inventory management system.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <img
            src="https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716"
            alt="placeholder"
            className="size-full max-h-96 rounded-2xl object-cover"
          />
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10">
            <p className="text-sm text-muted-foreground">OUR MISSION</p>
            <p className="text-lg font-medium">
              We envision a future where medical supply chains are optimized, reducing waste, improving efficiency, and ensuring that essential medical products reach those in need—when they need them the most.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Why Choose Us?
            </h2>
            <p className="text-muted-foreground">
              Join us in transforming the way medical warehouses operate, making healthcare logistics smarter, faster, and more reliable.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Files className="size-5" />
              </div>
              <h3 className="mb-3 mt-2 text-lg font-semibold">
                Unmatched Quality
              </h3>
              <p className="text-muted-foreground">
                We prioritize accuracy and compliance, ensuring that your inventory is managed with the highest standards.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                <CircleArrowRight className="size-5" />
              </div>
              <h3 className="mb-3 mt-2 text-lg font-semibold">
                Innovative Solutions
              </h3>
              <p className="text-muted-foreground">
                Our system integrates the latest technology to automate and simplify
              </p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Settings className="size-5" />
              </div>
              <h3 className="mb-3 mt-2 text-lg font-semibold">
                Reliable Performance
              </h3>
              <p className="text-muted-foreground">
                A secure, scalable, and efficient platform you can trust 24/7.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-10 text-sm font-medium text-muted-foreground">
              JOIN OUR TEAM
            </p>
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              We&apos;re changing how software is made
            </h2>
          </div>
          <div>
            <img
              src="https://shadcnblocks.com/images/block/placeholder.svg"
              alt="placeholder"
              className="mb-6 max-h-36 w-full rounded-xl object-cover"
            />
            <p className="text-muted-foreground">
              And we&apos;re looking for the right people to help us do it. If
              you&apos;re passionate about making change in the world, this
              might be the place for you
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { About }
