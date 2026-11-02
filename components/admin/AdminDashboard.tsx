"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, CircleAlert, ExternalLink, ImagePlus, LogOut, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import { type Profile, type Project } from "@/data/profile";
import { mergeProfile } from "@/lib/profile";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Panel = "profile" | "content" | "links";
type Notice = { kind: "success" | "error"; text: string } | null;

const skillGroups = [
  { key: "frontend" as const, label: "Frontend & experience" },
  { key: "backend" as const, label: "Backend & systems" },
  { key: "tools" as const, label: "Tools & workflow" },
];

export function AdminDashboard({ initialProfile }: { initialProfile: Profile }) {
  const router = useRouter();
  const supabase = useMemo(() => isSupabaseConfigured ? createSupabaseBrowserClient() : null, []);
  const [form, setForm] = useState<Profile>(initialProfile);
  const [activePanel, setActivePanel] = useState<Panel>("profile");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setNotice({ kind: "error", text: "Supabase belum dikonfigurasi. Isi environment variable dan jalankan SQL setup." });
      return;
    }

    let alive = true;
    const load = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.replace("/admin/login");
          return;
        }
        if (alive) setEmail(user.email ?? "Admin");

        const { data: admin, error: adminError } = await supabase.from("site_admins").select("user_id").eq("user_id", user.id).maybeSingle();
        if (adminError || !admin) {
          if (alive) setAccessDenied(true);
          return;
        }

        const { data, error } = await supabase.from("site_profile").select("content").eq("id", 1).maybeSingle();
        if (alive) {
          if (error) setNotice({ kind: "error", text: `Profil gagal dimuat: ${error.message}` });
          else setForm(mergeProfile(data?.content ?? initialProfile));
        }
      } catch (cause) {
        if (alive) setNotice({ kind: "error", text: `Koneksi Supabase gagal: ${cause instanceof Error ? cause.message : "Coba muat ulang halaman."}` });
      } finally {
        if (alive) setLoading(false);
      }
    };
    void load();
    return () => { alive = false; };
  }, [initialProfile, router, supabase]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const updateProject = (index: number, changes: Partial<Project>) => {
    setForm((current) => ({ ...current, projects: current.projects.map((project, itemIndex) => itemIndex === index ? { ...project, ...changes } : project) }));
    setNotice(null);
  };

  const updateExperience = (index: number, changes: Partial<Profile["experience"][number]>) => {
    setForm((current) => ({ ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item) }));
    setNotice(null);
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      setNotice({ kind: "error", text: "Gunakan gambar JPG, PNG, WebP, atau AVIF." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setNotice({ kind: "error", text: "Ukuran gambar maksimal 5 MB." });
      return;
    }
    if (!supabase) {
      setNotice({ kind: "error", text: "Supabase belum dikonfigurasi." });
      return;
    }

    setUploading(true);
    setNotice(null);
    const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
    const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
    try {
      const { error } = await supabase.storage.from("profile-assets").upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("profile-assets").getPublicUrl(path);
      onUploaded(data.publicUrl);
      setNotice({ kind: "success", text: "Gambar diunggah. Simpan perubahan agar tampil di situs." });
    } catch (cause) {
      setNotice({ kind: "error", text: `Upload gagal: ${cause instanceof Error ? cause.message : "Periksa koneksi dan kebijakan storage."}` });
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    if (!form.name.trim() || form.role.length === 0 || !form.socials.email.trim()) {
      setNotice({ kind: "error", text: "Nama, minimal satu role, dan email kontak wajib diisi." });
      return;
    }
    const slugs = form.projects.map((project) => project.slug.trim());
    if (slugs.some((slug) => !slug) || new Set(slugs).size !== slugs.length) {
      setNotice({ kind: "error", text: "Setiap proyek harus memiliki slug yang unik." });
      setActivePanel("content");
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const { error } = await supabase.from("site_profile").upsert({ id: 1, content: form }, { onConflict: "id" });
      if (error) setNotice({ kind: "error", text: `Perubahan belum tersimpan: ${error.message}` });
      else {
        window.localStorage.removeItem("portfolio-theme");
        setNotice({ kind: "success", text: "Profil berhasil disimpan dan situs publik sudah diperbarui." });
        router.refresh();
      }
    } catch (cause) {
      setNotice({ kind: "error", text: `Penyimpanan gagal: ${cause instanceof Error ? cause.message : "Periksa koneksi dan coba lagi."}` });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  if (accessDenied) return <main className="admin-state-page"><CircleAlert size={28} /><h1>Akses belum diizinkan.</h1><p>Akun ini belum terdaftar sebagai admin. Tambahkan user ID di tabel <code>site_admins</code> Supabase.</p><button className="button button-ghost" onClick={logout}>KELUAR <LogOut size={14} /></button></main>;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-sidebar-brand"><span className="wordmark-mark">{form.name.trim().charAt(0) || "D"}<span>/</span>ADMIN</span><span>PORTFOLIO<br />CONTROL ROOM</span></Link>
      <div className="admin-sidebar-label">WORKSPACE</div>
      <nav className="admin-side-nav" aria-label="Panel admin">
        <button className={activePanel === "profile" ? "active" : ""} onClick={() => setActivePanel("profile")}><span>01</span> Profil & tampilan</button>
        <button className={activePanel === "content" ? "active" : ""} onClick={() => setActivePanel("content")}><span>02</span> Konten & proyek</button>
        <button className={activePanel === "links" ? "active" : ""} onClick={() => setActivePanel("links")}><span>03</span> Tautan sosial</button>
      </nav>
      <div className="admin-sidebar-bottom"><span className="admin-live-dot" /> SUPABASE SYNC <span className="admin-sync-status">{loading ? "CONNECTING" : "READY"}</span></div>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar"><div><span className="admin-breadcrumb">R/P&nbsp; / &nbsp;ADMIN</span><span className="admin-user-email">{email || "Loading admin session…"}</span></div><div className="admin-top-actions"><Link href="/" target="_blank" className="admin-visit-link">LIHAT SITUS <ExternalLink size={13} /></Link><button className="admin-logout" type="button" onClick={logout}><LogOut size={14} /><span>KELUAR</span></button></div></header>

      <div className="admin-content">
        <div className="admin-page-heading"><div><span className="admin-kicker">CONTROL ROOM / 0{activePanel === "profile" ? 1 : activePanel === "content" ? 2 : 3}</span><h1>{activePanel === "profile" ? "Bentuk identitas." : activePanel === "content" ? "Atur cerita." : "Tetap terhubung."}</h1><p>{activePanel === "profile" ? "Perbarui tampilan dan informasi yang tampil di halaman utama." : activePanel === "content" ? "Kelola keahlian, pengalaman, angka, dan proyek pilihan." : "Arahkan pengunjung ke tempat terbaik untuk menemukan Anda."}</p></div><Link href="/" target="_blank" className="admin-preview-link">PREVIEW LIVE <ArrowUpRight size={14} /></Link></div>

        {notice && <div className={`admin-notice ${notice.kind}`} role="status">{notice.kind === "success" ? <Check size={16} /> : <CircleAlert size={16} />}{notice.text}</div>}
        {loading ? <div className="admin-loading"><span className="admin-spinner" /> MENGAMBIL DATA PROFIL…</div> : <form className="admin-editor-form" onSubmit={save}>
          {activePanel === "profile" && <>
            <section className="admin-panel-card">
              <div className="admin-card-heading"><div><span>01 / VISUAL IDENTITY</span><h2>Foto & identitas</h2></div><ImagePlus size={19} /></div>
              <div className="admin-identity-row">
                <div className="admin-avatar-preview">{form.avatar && <Image src={form.avatar} alt="Foto profil saat ini" fill unoptimized sizes="120px" />}</div>
                <div className="admin-avatar-controls"><strong>Foto profil</strong><p>JPG, PNG, WebP, atau AVIF. Maksimal 5 MB.</p><label className="admin-upload-button"><UploadCloud size={15} />{uploading ? "MENGUNGGAH…" : "UNGGAH FOTO"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={(event) => uploadImage(event, (avatar) => update("avatar", avatar))} /></label><span>Gambar tersimpan di Supabase Storage.</span></div>
              </div>
              <div className="admin-form-grid"><label className="admin-field"><span>NAMA / NICKNAME</span><input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Nama yang tampil" required /></label><label className="admin-field"><span>LOKASI</span><input value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Kota, Negara" /></label><label className="admin-field"><span>ROLE (PISAHKAN DENGAN KOMA)</span><input value={form.role.join(", ")} onChange={(event) => update("role", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="Full-Stack Developer, Designer" required /></label><label className="admin-field"><span>TIMEZONE</span><input value={form.timezone} onChange={(event) => update("timezone", event.target.value)} placeholder="Asia/Jakarta" /></label></div>
            </section>
            <section className="admin-panel-card">
              <div className="admin-card-heading"><div><span>02 / FIRST IMPRESSION</span><h2>Pesan utama</h2></div><ArrowUpRight size={19} /></div>
              <label className="admin-field"><span>TAGLINE</span><input value={form.tagline} onChange={(event) => update("tagline", event.target.value)} maxLength={180} placeholder="Kalimat singkat tentang cara Anda berkarya" /></label>
              <label className="admin-field"><span>TENTANG SAYA</span><textarea value={form.bio} onChange={(event) => update("bio", event.target.value)} rows={5} maxLength={900} placeholder="Ceritakan tentang diri Anda…" /></label>
              <label className="admin-field"><span>SEDANG MENGERJAKAN</span><input value={form.currentlyBuilding} onChange={(event) => update("currentlyBuilding", event.target.value)} placeholder="Apa yang sedang Anda bangun?" /></label>
              <div className="admin-theme-setting"><div><strong>Tema situs</strong><span>Pilih warna aksen utama portofolio.</span></div><div className="admin-theme-options"><button type="button" className={form.theme === "green" ? "selected" : ""} onClick={() => update("theme", "green")}><i className="green-swatch" /> MATRIX GREEN</button><button type="button" className={form.theme === "red" ? "selected" : ""} onClick={() => update("theme", "red")}><i className="red-swatch" /> CRIMSON RED</button></div></div>
            </section>
          </>}

          {activePanel === "content" && <>
            <section className="admin-panel-card">
              <div className="admin-card-heading"><div><span>01 / NUMBERS & SKILLS</span><h2>Statistik & keahlian</h2></div><span className="admin-item-count">{form.stats.length} STATS</span></div>
              <div className="admin-repeat-list">{form.stats.map((item, index) => <div className="admin-stat-row" key={`${item.label}-${index}`}><label className="admin-field"><span>LABEL</span><input value={item.label} onChange={(event) => update("stats", form.stats.map((stat, i) => i === index ? { ...stat, label: event.target.value } : stat))} /></label><label className="admin-field"><span>ANGKA</span><input type="number" min="0" value={item.value} onChange={(event) => update("stats", form.stats.map((stat, i) => i === index ? { ...stat, value: Number(event.target.value) } : stat))} /></label><button className="admin-icon-danger" type="button" aria-label="Hapus statistik" onClick={() => update("stats", form.stats.filter((_, i) => i !== index))}><Trash2 size={15} /></button></div>)}</div>
              <button className="admin-add-button" type="button" onClick={() => update("stats", [...form.stats, { label: "Statistik baru", value: 0 }])}><Plus size={14} /> TAMBAH STATISTIK</button>
              <div className="admin-divider" />
              <div className="admin-skills-grid">{skillGroups.map(({ key, label }) => <label className="admin-field" key={key}><span>{label.toUpperCase()} — SATU SKILL PER BARIS</span><textarea rows={6} value={form.skills[key].join("\n")} onChange={(event) => update("skills", { ...form.skills, [key]: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} /></label>)}</div>
            </section>

            <section className="admin-panel-card">
              <div className="admin-card-heading"><div><span>02 / CAREER PATH</span><h2>Pengalaman</h2></div><span className="admin-item-count">{form.experience.length} CHAPTERS</span></div>
              {form.experience.map((item, index) => <div className="admin-repeat-card" key={`${item.year}-${index}`}><div className="admin-repeat-card-top"><span>CHAPTER 0{index + 1}</span><button className="admin-icon-danger" type="button" aria-label="Hapus pengalaman" onClick={() => update("experience", form.experience.filter((_, i) => i !== index))}><Trash2 size={15} /></button></div><div className="admin-form-grid"><label className="admin-field"><span>TAHUN</span><input value={item.year} onChange={(event) => updateExperience(index, { year: event.target.value })} /></label><label className="admin-field"><span>POSISI / PENCAPAIAN</span><input value={item.title} onChange={(event) => updateExperience(index, { title: event.target.value })} /></label><label className="admin-field admin-field-wide"><span>DESKRIPSI</span><textarea rows={2} value={item.desc} onChange={(event) => updateExperience(index, { desc: event.target.value })} /></label></div></div>)}
              <button className="admin-add-button" type="button" onClick={() => update("experience", [...form.experience, { year: "2026 — NOW", title: "Posisi baru", desc: "Deskripsi singkat pengalaman." }])}><Plus size={14} /> TAMBAH PENGALAMAN</button>
            </section>

            <section className="admin-panel-card">
              <div className="admin-card-heading"><div><span>03 / SELECTED WORK</span><h2>Proyek</h2></div><span className="admin-item-count">{form.projects.length} PROJECTS</span></div>
              {form.projects.map((project, index) => <div className="admin-repeat-card" key={`${project.slug}-${index}`}><div className="admin-repeat-card-top"><span>PROJECT 0{index + 1}</span><button className="admin-icon-danger" type="button" aria-label="Hapus proyek" onClick={() => update("projects", form.projects.filter((_, i) => i !== index))}><Trash2 size={15} /></button></div><div className="admin-form-grid"><label className="admin-field"><span>JUDUL PROYEK</span><input value={project.title} onChange={(event) => updateProject(index, { title: event.target.value })} /></label><label className="admin-field"><span>SLUG URL</span><input value={project.slug} onChange={(event) => updateProject(index, { slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} /></label><label className="admin-field"><span>LABEL KATEGORI</span><input value={project.eyebrow} onChange={(event) => updateProject(index, { eyebrow: event.target.value })} /></label><label className="admin-field"><span>TEKNOLOGI (PISAHKAN DENGAN KOMA)</span><input value={project.tags.join(", ")} onChange={(event) => updateProject(index, { tags: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label><label className="admin-field admin-field-wide"><span>DESKRIPSI</span><textarea rows={2} value={project.description} onChange={(event) => updateProject(index, { description: event.target.value })} /></label><label className="admin-field"><span>URL DEMO</span><input type="url" value={project.demo} onChange={(event) => updateProject(index, { demo: event.target.value })} /></label><label className="admin-field"><span>URL SOURCE</span><input type="url" value={project.source} onChange={(event) => updateProject(index, { source: event.target.value })} /></label><label className="admin-field admin-field-wide"><span>URL GAMBAR / ARTWORK</span><input type="url" value={project.image} onChange={(event) => updateProject(index, { image: event.target.value })} /></label></div></div>)}
              <button className="admin-add-button" type="button" onClick={() => update("projects", [...form.projects, { slug: `project-${Date.now()}`, title: "Proyek baru", eyebrow: "WEB EXPERIENCE · 2026", description: "Deskripsi singkat proyek.", tags: [], image: "/images/avatar-placeholder.svg", demo: "https://example.com", source: "https://github.com", number: String(form.projects.length + 1).padStart(2, "0") }])}><Plus size={14} /> TAMBAH PROYEK</button>
            </section>
          </>}

          {activePanel === "links" && <section className="admin-panel-card">
            <div className="admin-card-heading"><div><span>01 / SOCIAL PRESENCE</span><h2>Tautan sosial</h2></div><ArrowUpRight size={19} /></div>
            <label className="admin-field"><span>EMAIL KONTAK</span><input type="email" value={form.socials.email} onChange={(event) => update("socials", { ...form.socials, email: event.target.value })} /></label>
            <label className="admin-field"><span>GITHUB</span><input type="url" value={form.socials.github} onChange={(event) => update("socials", { ...form.socials, github: event.target.value })} placeholder="https://github.com/username" /></label>
            <label className="admin-field"><span>LINKEDIN</span><input type="url" value={form.socials.linkedin} onChange={(event) => update("socials", { ...form.socials, linkedin: event.target.value })} placeholder="https://linkedin.com/in/username" /></label>
            <label className="admin-field"><span>WHATSAPP</span><input type="url" value={form.socials.whatsapp} onChange={(event) => update("socials", { ...form.socials, whatsapp: event.target.value })} placeholder="https://wa.me/62…" /></label>
          </section>}

          <div className="admin-savebar"><span>Perubahan akan langsung tampil di situs publik.</span><button className="button button-primary" type="submit" disabled={saving || loading || uploading}>{saving ? "MENYIMPAN…" : <><Save size={15} /> SIMPAN PERUBAHAN</>}</button></div>
        </form>}
      </div>
    </section>
  </main>;
}
