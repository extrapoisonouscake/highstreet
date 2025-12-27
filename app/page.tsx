import Image from "next/image";
import { Suspense } from "react";
import { IsLoungeBooked } from "./is-lounge-booked";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-8">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Image
            src="/logo.webp"
            alt="логотипчик"
            className="invert dark:invert-0"
            height={60}
            width={200}
          />
          <h1 className="text-2xl font-medium">проверялка лаунджа🪩</h1>
          <Suspense
            fallback={<p className="animate-pulse text-xl">ща секунду...🤔</p>}
          >
            <IsLoungeBooked />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
