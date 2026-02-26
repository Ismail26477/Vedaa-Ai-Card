import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export default function AuthPage() {
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const isLegacyPreviewHost = host.startsWith("id-preview--") && host.endsWith(".lovable.app");

    if (!isLegacyPreviewHost) return;

    const projectId = host.replace("id-preview--", "").replace(".lovable.app", "");
    const targetUrl = `https://${projectId}.lovableproject.com${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(targetUrl);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session) return <Navigate to="/dashboard" replace />;

  const withRetry = async <T,>(fn: () => Promise<T>, retries = 2): Promise<T> => {
    let attempt = 0;
    let lastError: unknown;

    while (attempt <= retries) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const isFetchError = error instanceof TypeError && error.message.includes("Failed to fetch");

        if (!isFetchError || attempt === retries) break;

        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        attempt += 1;
      }
    }

    throw lastError;
  };

  const getAuthErrorMessage = (err: unknown) => {
    if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
      return "Network issue reaching authentication service. Please try again in a few seconds.";
    }
    if (err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string") {
      return (err as { message: string }).message;
    }
    return "Something went wrong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await withRetry(() => supabase.auth.signInWithPassword({ email, password }));
        if (error) throw error;
        toast.success("Welcome back!");
      } else if (mode === "signup") {
        const { error } = await withRetry(() =>
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: { full_name: name },
            },
          })
        );
        if (error) throw error;
        toast.success("Account created! You can now sign in.");
      } else {
        const { error } = await withRetry(() =>
          supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          })
        );
        if (error) throw error;
        toast.success("Password reset email sent!");
        setMode("login");
      }
    } catch (err: unknown) {
      toast.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary-foreground font-display">Vedaa AI</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary-foreground font-display leading-tight">
            Your digital business card, powered by AI
          </h1>
          <p className="text-primary-foreground/70 text-lg">
            Share your card, collect leads, schedule meetings — all in one place.
          </p>
        </div>
        <div className="flex gap-4">
          {["500+ Users", "10K+ Cards Shared", "GDPR Compliant"].map(stat => (
            <div key={stat} className="bg-primary-foreground/10 rounded-xl px-4 py-2">
              <p className="text-primary-foreground text-sm font-medium">{stat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-display">Vedaa AI</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display">
              {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {mode === "login" ? "Sign in to access your dashboard" :
               mode === "signup" ? "Start sharing your digital card today" :
               "We'll send you a reset link"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {mode !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button type="button" onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending..."}
                </span>
              ) : (
                mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">Sign up</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary font-medium hover:underline">Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
