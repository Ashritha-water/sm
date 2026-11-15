"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { serviceOptions, validateContact, type ContactInput } from "@/lib/contact";
import { site } from "@/lib/site";

const empty: ContactInput = { name: "", email: "", phone: "", company: "", service: "", message: "", website: "" };
type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <label htmlFor={id} className="mb-2 flex justify-between text-xs uppercase tracking-[0.16em] text-muted">
        {label}
        {optional && <span className="normal-case tracking-normal">Optional</span>}
      </label>
      {children}
      <p id={`${id}-err`} role={error ? "alert" : undefined} className="mt-1.5 min-h-[1.1rem] text-xs text-rose-300">
        {error ?? ""}
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3.5 text-[15px] text-white placeholder:text-muted/60 transition-colors focus:border-cyan/60 focus:bg-white/[0.05] focus:outline-none aria-[invalid=true]:border-rose-400/60";

export default function ContactForm() {
  const uid = useId();
  const [v, setV] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // service pages link here with ?service=<slug>
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service");
    // the URL is only known after hydration, so this one-time sync has to run in an effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (s && serviceOptions.some((o) => o.value === s)) setV((x) => ({ ...x, service: s }));
  }, []);

  const set = (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched) setErrors(validateContact(next, { strictBusinessEmail: true }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const errs = validateContact(v, { strictBusinessEmail: true });
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    // Static site: enquiries go straight from the browser to a form service (Formspree).
    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
    if (!endpoint) {
      setStatus({
        kind: "error",
        message: site.contact.email
          ? `Our contact form is being set up. Please email us at ${site.contact.email}.`
          : "Our contact form is being set up. Please try again shortly.",
      });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const serviceLabel = serviceOptions.find((o) => o.value === v.service)?.label ?? v.service;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: v.name.trim(),
          email: v.email.trim(),
          phone: v.phone.trim(),
          company: v.company.trim(),
          service: serviceLabel,
          message: v.message.trim(),
          _subject: `New enquiry: ${serviceLabel} from ${v.name.trim()}`,
          _gotcha: v.website, // Formspree's spam trap; bots fill it, people never see it
        }),
      });
      if (res.ok) {
        setStatus({ kind: "sent" });
        setV({ ...empty });
        setTouched(false);
      } else {
        const data = (await res.json().catch(() => ({}))) as { errors?: { message?: string }[] };
        setStatus({ kind: "error", message: data.errors?.[0]?.message ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  const id = (k: string) => `${uid}-${k}`;
  const aria = (k: keyof ContactInput) => ({
    id: id(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": `${id(k)}-err`,
  });

  return (
    <form noValidate onSubmit={onSubmit} className="glass relative rounded-[28px] p-6 sm:p-9" aria-labelledby="contact-title">
      <AnimatePresence mode="wait">
        {status.kind === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[520px] flex-col items-start justify-center"
            role="status"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-cyan/40 text-2xl text-cyan">✓</span>
            <h3 className="display mt-6 text-4xl text-white">Thank you. Your project is on its way to us.</h3>
            <p className="mt-4 max-w-md text-soft">Our team will review the details and get back to you on the email you shared.</p>
            <button type="button" className="btn btn-ghost mt-8" onClick={() => setStatus({ kind: "idle" })}>
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid gap-x-5 sm:grid-cols-2">
              <Field id={id("name")} label="Name" error={errors.name}>
                <input {...aria("name")} name="name" autoComplete="name" className={inputCls} value={v.name} onChange={set("name")} required />
              </Field>
              <Field id={id("email")} label="Business email" error={errors.email}>
                <input {...aria("email")} name="email" type="email" autoComplete="email" inputMode="email" className={inputCls} value={v.email} onChange={set("email")} required />
              </Field>
              <Field id={id("phone")} label="Phone number" error={errors.phone} optional>
                <input {...aria("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" className={inputCls} value={v.phone} onChange={set("phone")} />
              </Field>
              <Field id={id("company")} label="Company name" error={errors.company} optional>
                <input {...aria("company")} name="company" autoComplete="organization" className={inputCls} value={v.company} onChange={set("company")} />
              </Field>
            </div>
            <Field id={id("service")} label="Service interested in" error={errors.service}>
              <select {...aria("service")} name="service" className={`${inputCls} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat`} value={v.service} onChange={set("service")} required
                style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%238390a8' stroke-width='1.5'/></svg>\")" }}
              >
                <option value="" disabled className="bg-night">Select a service</option>
                {serviceOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-night">{o.label}</option>
                ))}
              </select>
            </Field>
            <Field id={id("message")} label="Project description" error={errors.message}>
              <textarea {...aria("message")} name="message" rows={5} className={`${inputCls} resize-y`} value={v.message} onChange={set("message")} required
                placeholder="What are you building, who is it for, and what would success look like?" />
            </Field>
            {/* honeypot for bots: hidden from people and assistive tech */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor={id("website")}>Website</label>
              <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
            </div>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="btn btn-primary justify-center disabled:opacity-60" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending…" : "Start Your Project"}
                <span aria-hidden>→</span>
              </button>
              <p className="text-xs text-muted">We use your details only to reply to this enquiry.</p>
            </div>
            <p role="alert" className="mt-4 min-h-[1.25rem] text-sm text-rose-300">
              {status.kind === "error" ? status.message : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
