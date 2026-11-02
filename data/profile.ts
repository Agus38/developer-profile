export type Profile = {
  name: string;
  role: string[];
  tagline: string;
  location: string;
  timezone: string;
  bio: string;
  avatar: string;
  currentlyBuilding: string;
  stats: { label: string; value: number }[];
  skills: { frontend: string[]; backend: string[]; tools: string[] };
  projects: {
    slug: string;
    title: string;
    eyebrow: string;
    description: string;
    tags: string[];
    image: string;
    demo: string;
    source: string;
    number: string;
  }[];
  experience: { year: string; title: string; desc: string }[];
  socials: { github: string; linkedin: string; whatsapp: string; email: string };
  theme: "green" | "red";
};

export type Project = Profile["projects"][number];

export const profile: Profile = {
  name: "Raka Pratama", // TODO: ganti dengan nama atau nickname Anda
  role: ["Full-Stack Developer", "Automation Builder", "Creative Technologist"], // TODO: sesuaikan peran
  tagline: "Merancang pengalaman digital yang terasa cepat, berguna, dan berkesan.", // TODO: ganti tagline
  location: "Jakarta, Indonesia", // TODO: ganti kota
  timezone: "Asia/Jakarta",
  bio: "Saya membangun produk digital dan automasi yang membantu ide bergerak lebih jauh. Berbekal rasa ingin tahu pada desain dan teknologi, saya menyukai proses mengubah masalah rumit menjadi pengalaman yang sederhana, cepat, dan menyenangkan.", // TODO: tulis bio Anda
  avatar: "/images/avatar-placeholder.svg", // TODO: unggah foto profil melalui /admin
  currentlyBuilding: "Eksperimen automasi yang lebih manusiawi", // TODO: update hal yang sedang dikerjakan
  stats: [
    { label: "Tahun eksplorasi", value: 4 }, // TODO: sesuaikan angka
    { label: "Proyek dikirim", value: 18 }, // TODO: sesuaikan angka
    { label: "Cangkir kopi", value: 640 }, // TODO: sesuaikan angka
  ],
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "PostgreSQL", "REST API", "Python", "Automation"],
    tools: ["Git", "Vercel", "Docker", "Figma", "Linux"],
  },
  projects: [
    {
      slug: "nusa-commerce",
      title: "Nusa Commerce",
      eyebrow: "COMMERCE PLATFORM · 2025",
      description: "Pengalaman belanja yang ringan untuk brand lokal, dari discovery sampai checkout yang terasa tanpa jeda.",
      tags: ["Next.js", "TypeScript", "Stripe"],
      image: "/images/nusa-commerce.svg",
      demo: "https://example.com", // TODO: ganti URL demo
      source: "https://github.com", // TODO: ganti URL source
      number: "01",
    },
    {
      slug: "signal-automation",
      title: "Signal Automations",
      eyebrow: "WORKFLOW TOOLING · 2024",
      description: "Dashboard orkestrasi workflow untuk memangkas pekerjaan repetitif dan memberi tim lebih banyak ruang untuk fokus.",
      tags: ["React", "Node.js", "PostgreSQL"],
      image: "/images/signal-automation.svg",
      demo: "https://example.com", // TODO: ganti URL demo
      source: "https://github.com", // TODO: ganti URL source
      number: "02",
    },
    {
      slug: "orbit-notes",
      title: "Orbit Notes",
      eyebrow: "PRODUCTIVITY · 2024",
      description: "Ruang kerja personal untuk menghubungkan catatan, ide, dan langkah berikutnya dalam satu alur yang tenang.",
      tags: ["Next.js", "Supabase", "Framer Motion"],
      image: "/images/orbit-notes.svg",
      demo: "https://example.com", // TODO: ganti URL demo
      source: "https://github.com", // TODO: ganti URL source
      number: "03",
    },
  ],
  experience: [
    { year: "2025 — NOW", title: "Independent Developer", desc: "Membangun produk web dan automasi untuk tim dan bisnis yang ingin bergerak lebih efisien." }, // TODO: ganti pengalaman
    { year: "2023 — 2025", title: "Product Engineer", desc: "Menerjemahkan kebutuhan pengguna menjadi antarmuka dan layanan digital yang siap digunakan." }, // TODO: ganti pengalaman
    { year: "2022 — 2023", title: "The beginning", desc: "Mulai dari rasa ingin tahu, proyek kecil, dan keberanian untuk terus mencoba hal baru." }, // TODO: ganti pengalaman
  ],
  socials: {
    github: "https://github.com/yourusername", // TODO: ganti URL
    linkedin: "https://linkedin.com/in/yourusername", // TODO: ganti URL
    whatsapp: "https://wa.me/6281234567890", // TODO: ganti nomor WhatsApp
    email: "hello@example.com", // TODO: ganti alamat email
  },
  theme: "green",
};
