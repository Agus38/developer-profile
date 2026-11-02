"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, KeyRound, LoaderCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [setupMode, setSetupMode] = useState(!isSupabaseConfigured);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSetupMode(!isSupabaseConfigured || new URLSearchParams(window.location.search).get("setup") === "1");
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      const destination = new URLSearchParams(window.location.search).get("next") || "/admin";
      router.replace(destination.startsWith("/admin") ? destination : "/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Tidak dapat masuk. Periksa koneksi dan kredensial.");
    } finally {
      setBusy(false);
    }
  };

  return <main className="admin-login-page">
    <div className="admin-login-noise" aria-hidden="true" />
    <Link className="admin-back-home" href="/"><ArrowLeft size={15} /> KEMBALI KE PORTOFOLIO</Link>
    <section className="admin-login-card">
      <span className="admin-kicker"><KeyRound size={14} /> PRIVATE ACCESS / 01</span>
      <p className="admin-brand">R<span>/</span>P <i>CONTROL ROOM</i></p>
      <h1>{setupMode ? <>Satu langkah<br /><span>persiapan.</span></> : <>Good to<br /><span>see you.</span></>}</h1>
      {setupMode ? <div className="admin-setup-note"><p>Hubungkan project Supabase terlebih dahulu untuk mengaktifkan dashboard yang tersimpan dan terlindungi.</p><ol><li>Isi URL dan anon key Supabase di <code>.env.local</code>.</li><li>Jalankan SQL dari <code>supabase/schema.sql</code>.</li><li>Buat akun admin dan jalankan instruksi setup di README.</li></ol><a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">BUKA SUPABASE <ArrowUpRight size={13} /></a></div> : <form className="admin-login-form" onSubmit={submit}>
        <label><span>EMAIL ADMIN</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
        <label><span>PASSWORD</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••••" required /></label>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <button className="button button-primary admin-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={15} /> MEMERIKSA AKSES</> : <>MASUK KE DASHBOARD <ArrowUpRight size={15} /></>}</button>
        <p className="admin-login-footnote">Akses hanya untuk akun yang didaftarkan sebagai admin.</p>
      </form>}
    </section>
    <footer className="admin-login-footer"><span>R/P — PERSONAL PORTFOLIO SYSTEM</span><span>SECURE SESSION / HTTPS</span></footer>
  </main>;
}
