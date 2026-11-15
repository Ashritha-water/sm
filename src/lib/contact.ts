import { services } from "./services";

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  website?: string; // honeypot, must stay empty
};

export const serviceOptions = [...services.map((s) => ({ value: s.slug, label: s.title })), { value: "other", label: "Something else" }];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|aol|proton|protonmail|rediffmail)\./i;
const PHONE = /^[+()\d\s-]{7,20}$/;

/** Shared validation used by the form and the API route. Returns field errors (empty object = valid). */
export function validateContact(v: Partial<ContactInput>, { strictBusinessEmail = false } = {}) {
  const e: Partial<Record<keyof ContactInput, string>> = {};
  const name = (v.name ?? "").trim();
  const email = (v.email ?? "").trim();
  const phone = (v.phone ?? "").trim();
  const company = (v.company ?? "").trim();
  const message = (v.message ?? "").trim();
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > 100) e.name = "Name is too long.";
  if (!EMAIL.test(email)) e.email = "Please enter a valid email address.";
  else if (strictBusinessEmail && FREE_MAIL.test(email)) e.email = "Please use your business email address.";
  if (phone && !PHONE.test(phone)) e.phone = "Please enter a valid phone number.";
  if (company.length > 120) e.company = "Company name is too long.";
  if (!serviceOptions.some((o) => o.value === v.service)) e.service = "Please choose a service.";
  if (message.length < 20) e.message = "Please tell us a little more (at least 20 characters).";
  else if (message.length > 4000) e.message = "Please keep the description under 4000 characters.";
  return e;
}
