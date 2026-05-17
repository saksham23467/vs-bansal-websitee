export const siteConfig = {
  name: "V S bansal & associates",
  shortName: "V S bansal & associates",
  legalName: "V S bansal & associates",
  tagline: "Trusted Chartered Accountants in Delhi NCR & Across India",
  description:
    "V S bansal & associates is an ICAI-registered chartered accountancy firm led by CA Sumit Bansal and CA Vineeta Bansal. Expert GST filing, income tax, ROC compliance, company registration, Virtual CFO, and startup advisory from Pitampura, Delhi.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vsbansalassociates.com",
  phone: "+91 98105 58120",
  phoneDisplay: "+91 98105 58120",
  /** Digits only for wa.me links (no + or spaces) */
  whatsapp: "919810558120",
  email: "vsbansalassociates@gmail.com",
  address: {
    line1: "706, PP Trade Centre",
    line2: "Netaji Subhash Place, Pitampura",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110034",
    country: "India",
    full: "706, PP Trade Centre, Netaji Subhash Place, Pitampura, Delhi 110034",
  },
  geo: {
    latitude: 28.6959,
    longitude: 77.152,
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.8!2d77.152!3d28.6959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d049e2e3c3c3b%3A0x0!2sNetaji%20Subhash%20Place%2C%20Pitampura%2C%20Delhi!5e0!3m2!1sen!2sin!4v1",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=706+PP+Trade+Centre+Netaji+Subhash+Place+Pitampura+Delhi+110034",
  businessHours: [
    { day: "Monday", hours: "10:00 AM – 7:00 PM" },
    { day: "Tuesday", hours: "10:00 AM – 7:00 PM" },
    { day: "Wednesday", hours: "10:00 AM – 7:00 PM" },
    { day: "Thursday", hours: "10:00 AM – 7:00 PM" },
    { day: "Friday", hours: "10:00 AM – 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM – 3:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  partners: [
    {
      name: "CA Sumit Bansal",
      role: "Partner",
      expertise: "GST, Income Tax & Litigation",
      slug: "ca-sumit-bansal",
    },
    {
      name: "CA Vineeta Bansal",
      role: "Partner",
      expertise: "Audit, ROC & Startup Advisory",
      slug: "ca-vineeta-bansal",
    },
  ],
  icaiMembership: "ICAI Registered Practicing Chartered Accountants",
  founded: 2016,
  rating: { value: 4.9, count: 127 },
  social: {
    linkedin: "https://linkedin.com/company/vs-bansal-associates",
    facebook: "https://facebook.com/vsbansalassociates",
    instagram: "https://instagram.com/vsbansalassociates",
  },
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  keywords: [
    "chartered accountant near me",
    "CA in Delhi",
    "CA in Pitampura",
    "GST consultant Delhi",
    "tax consultant India",
    "company registration Delhi",
    "GST filing services",
    "ROC filing",
    "virtual CFO India",
    "startup CA services",
    "income tax filing Delhi",
    "V S bansal associates",
    "CA Sumit Bansal",
    "CA Vineeta Bansal",
  ],
  serviceAreas: [
    "Delhi",
    "Noida",
    "Gurgaon",
    "Mumbai",
    "Bangalore",
    "Pune",
    "Hyderabad",
    "Chennai",
    "Ahmedabad",
    "Jaipur",
    "Pan India (Remote)",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** E.164-style tel: href */
export function getTelHref(phone = siteConfig.phone) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** WhatsApp chat URL — always uses site WhatsApp number */
export function getWhatsAppUrl(message?: string) {
  const text = message ?? "Hello V S bansal & associates, I would like to book a consultation.";
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}
