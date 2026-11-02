import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span className="section-index">404 — ROUTE NOT FOUND</span><h1>Lost in<br /><span>the void.</span></h1><Link href="/">RETURN HOME ↗</Link></main>;
}
