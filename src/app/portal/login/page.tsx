"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/fade-in";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/portal";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(
        "Invalid email or password. If this is your first deploy, run database setup (see README) to create portal users."
      );
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <FadeIn className="w-full max-w-md">
      <Card className="border-navy-100 shadow-xl dark:border-navy-800">
        <CardHeader>
          <CardTitle className="text-2xl">Client portal</CardTitle>
          <CardDescription>
            Sign in to upload and download documents. You stay logged in for 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-navy-500">
            Need help?{" "}
            <Link href="/contact" className="font-medium text-royal-600 hover:underline">
              Contact us
            </Link>
          </p>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-navy-50/50 px-4 py-20 dark:bg-navy-950">
      <Suspense
        fallback={
          <Card className="w-full max-w-md border-navy-100 p-8 shadow-xl dark:border-navy-800">
            <p className="text-center text-sm text-navy-500">Loading…</p>
          </Card>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
