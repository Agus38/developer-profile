# Cinematic Developer Portfolio

Portofolio developer one-page dengan nuansa sinematik gelap, pilihan tema Matrix Green / Crimson Red, motion berbasis scroll, dan halaman detail proyek. Dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lenis, React Three Fiber, Drei, dan Lucide.

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Perintah `npm run build` menghasilkan build production; `npm start` menjalankannya.

## Personalisasi

Semua konten personal berada di `data/profile.ts`. Ganti nama, peran, bio, angka, daftar skills, proyek, pengalaman, sosial, email, lokasi, dan timezone. Ganti aset proyek di `public/images/` serta URL `example.com` di `app/layout.tsx`, `app/sitemap.ts`, dan `app/robots.ts`.

Tema awal ditentukan oleh `profile.theme`. Pengunjung juga dapat berganti tema menggunakan kontrol di header; pilihan mereka disimpan pada browser.

## Environment variable

Tidak ada variabel environment yang diwajibkan. Form kontak menggunakan fallback `mailto:` dan tidak menyimpan data form. `.env.example` memuat contoh opsional jika kelak Anda menambahkan endpoint Resend (`RESEND_API_KEY`, `CONTACT_EMAIL`).

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Di Vercel pilih **Add New Project**, lalu import repository.
3. Gunakan pengaturan build default Next.js dan pilih **Deploy**. Tidak ada env var wajib.
4. Untuk domain sendiri, buka **Project → Settings → Domains**, tambahkan domain, lalu ikuti instruksi DNS Vercel. Setelah itu perbarui URL `example.com` di metadata, sitemap, dan robots.

## Aksesibilitas dan motion

Animasi yang berat, Lenis, cursor khusus, dan canvas 3D dinonaktifkan atau dikurangi pada `prefers-reduced-motion` / perangkat sentuh. Horizontal project reel hanya dipin pada layar desktop; di mobile ia menjadi strip swipe horizontal. Intro hanya muncul sekali per sesi dan bisa dilewati.

## Checklist sebelum rilis

- [ ] Ganti semua data `TODO` di `data/profile.ts` dan URL domain contoh.
- [ ] `npm run build` lolos.
- [ ] Uji layout pada lebar 360px, 768px, 1280px, dan 1920px.
- [ ] Uji navigasi keyboard, command palette (`Ctrl/Cmd + K`), dan `prefers-reduced-motion`.
- [ ] Verifikasi tautan sosial, email, proyek, metadata, dan Lighthouse setelah deploy.
