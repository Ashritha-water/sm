import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-[clamp(2.6rem,6vw,5rem)] text-white">This page drifted out of orbit.</h1>
      <p className="mt-5 max-w-md text-soft">The page you are looking for does not exist or has moved.</p>
      <div className="mt-10 flex gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/#services" className="btn btn-ghost">Our services</Link>
      </div>
    </section>
  );
}
