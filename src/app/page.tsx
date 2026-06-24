"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {

    async function bootstrap() {

      const {
        data: { session },
      } =
        await supabaseClient.auth.getSession();

      if (session) {
        router.replace("/rooms");
      } else {
        router.replace("/signup");
      }
    }

    bootstrap();

  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      Loading...
    </main>
  );
}