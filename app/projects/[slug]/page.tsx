import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublicProfile } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicProfile();
  const project = profile.projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const profile = await getPublicProfile();
  const project = profile.projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return <main className="project-detail-page">
    <header className="detail-nav"><Link href="/#projects" className="back-link"><ArrowLeft size={15} /> ALL PROJECTS</Link><span className="detail-mark">R<span>/</span>P — CASE STUDY</span></header>
    <section className="detail-hero"><span className="section-index">{project.eyebrow}</span><h1>{project.title}<span>.</span></h1><p>{project.description}</p><div className="project-tags detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="detail-image"><Image src={project.image} alt={`Artwork untuk ${project.title}`} fill unoptimized priority sizes="100vw" /></div>
    </section>
    <section className="detail-copy"><div><span className="section-index">THE IDEA</span><h2>Make the complex<br /><span className="text-outline">feel simple.</span></h2></div><div><p>{project.description} The experience was shaped around clear hierarchy, responsive interactions, and details that make everyday workflows feel a little more considered.</p><div className="detail-links"><a href={project.demo} target="_blank" rel="noreferrer">VISIT LIVE PROJECT <ArrowUpRight size={15} /></a><a href={project.source} target="_blank" rel="noreferrer">VIEW SOURCE <ArrowUpRight size={15} /></a></div></div></section>
    <footer className="detail-footer"><Link href="/#projects">← BACK TO SELECTED WORK</Link><Link href="/#contact">HAVE A PROJECT? LET’S TALK ↗</Link></footer>
  </main>;
}
