import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppName } from "@/components/AppName";

export default function Completed() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <AppName />
        </div>
        <div className="relative flex place-items-center ">
          <h1>About us</h1>
        </div>
        <Footer />
      </main>
    </>
  );
}
