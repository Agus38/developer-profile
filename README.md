# Cinematic Developer Portfolio

Portofolio developer sinematik dengan panel admin yang dapat mengubah profil, foto, keahlian, pengalaman, proyek, tautan sosial, dan tema. Perubahan disimpan di Supabase dan langsung dipakai situs publik. Dibangun memakai Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lenis, React Three Fiber, dan Supabase Auth/Storage.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Jika Supabase belum dikonfigurasi, halaman publik memakai data fallback di `data/profile.ts`; `/admin` akan menampilkan petunjuk setup.

## Setup Supabase

1. Buat project di [Supabase](https://supabase.com/dashboard).
2. Buka **Authentication → Providers / Sign In**, aktifkan Email, dan nonaktifkan public sign-ups. Buat satu user admin dari **Authentication → Users → Add user**.
3. Buka **SQL Editor**, jalankan seluruh isi `supabase/schema.sql`. Ini membuat tabel dengan Row Level Security dan bucket gambar publik `profile-assets`.
4. Daftarkan user admin dengan SQL berikut, ganti alamat email:

   ```sql
   insert into public.site_admins (user_id)
   select id from auth.users where email = lower('email-anda@domain.com')
   on conflict (user_id) do nothing;
   ```

   Pastikan query menambahkan satu baris. Tabel profil akan dibuat saat Anda menekan **Simpan perubahan** pertama kali.
5. Salin `.env.example` menjadi `.env.local`, lalu isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari **Project Settings → API**. Jangan gunakan atau publikasikan `service_role` key.
6. Jalankan ulang `npm run dev`, buka `/admin`, lalu masuk menggunakan user admin yang dibuat di langkah 2.

## Panel admin

- `/admin` meminta sesi Supabase Auth; belum login akan diarahkan ke `/admin/login`.
- **Profil & tampilan** mengedit nama, foto, role, tagline, lokasi, bio, statistik now-building, dan tema.
- **Konten & proyek** mengedit statistik, skills, pengalaman, serta detail proyek.
- **Tautan sosial** mengedit email, GitHub, LinkedIn, dan WhatsApp.
- Foto profil diunggah ke Supabase Storage. Format yang diterima JPG, PNG, WebP, atau AVIF, maksimal 5 MB.
- Akses tulis diperiksa di database, bukan hanya disembunyikan di UI. Hanya user pada `site_admins` yang dapat menyimpan konten atau mengunggah gambar.

## Environment variable

| Variable | Wajib | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Untuk admin | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Untuk admin | Public anon/publishable key; keamanan tulis tetap ditentukan RLS |

Jangan menaruh `service_role` key dalam aplikasi browser atau variabel `NEXT_PUBLIC_*`. Form kontak tetap memakai fallback `mailto:` dan tidak menyimpan pesan.

## Deploy ke Vercel

1. Push repository ini ke GitHub dan import ke Vercel.
2. Di **Project → Settings → Environment Variables**, tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` untuk Production, Preview, dan Development sesuai kebutuhan.
3. Redeploy setelah mengisi variable. Pastikan URL redirect Supabase Auth mengizinkan domain Vercel dan domain kustom Anda.
4. Buka `https://domain-anda/admin` dan masuk.
5. Tambahkan domain melalui **Project → Settings → Domains**, lalu perbarui URL `example.com` di `app/layout.tsx`, `app/sitemap.ts`, dan `app/robots.ts`.

## Pemeriksaan sebelum rilis

- [ ] Ganti konten contoh di `data/profile.ts` atau edit langsung melalui `/admin` setelah Supabase tersambung.
- [ ] Pastikan public sign-ups nonaktif dan hanya akun Anda tercantum pada `site_admins`.
- [ ] Isi Environment Variables di Vercel; jangan commit `.env.local`.
- [ ] `npx tsc --noEmit`, `npm run lint`, dan `npm run build`.
- [ ] Uji panel admin, upload gambar, tampilan mobile, keyboard, dan `prefers-reduced-motion`.
