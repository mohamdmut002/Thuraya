export type Service = {
  id: string;
  name: string;
  tagline: string;
  priceMin: number;
  priceMax: number;
  features: string[];
};

export const services: Service[] = [
  {
    id: "complete-website",
    name: "Complete Website Development",
    tagline: "Multi-page marketing sites with CMS-ready structure.",
    priceMin: 300,
    priceMax: 500,
    features: [
      "Up to 6 custom pages",
      "Responsive on all devices",
      "SEO fundamentals & meta setup",
      "Contact form & analytics",
      "1 month post-launch support",
    ],
  },
  {
    id: "simple-website",
    name: "Simple Website",
    tagline: "One-pager or landing page with impact.",
    priceMin: 100,
    priceMax: 300,
    features: [
      "1–2 page design",
      "Mobile-first layout",
      "Basic SEO",
      "Social + WhatsApp links",
    ],
  },
  {
    id: "digital-menu",
    name: "Restaurant & Cafe Digital Menu",
    tagline: "QR-ready digital menu, elegant & fast.",
    priceMin: 100,
    priceMax: 250,
    features: [
      "QR code delivery",
      "Bilingual (EN / AR)",
      "Categories & pricing management",
      "Photography-friendly layout",
    ],
  },
  {
    id: "brochure",
    name: "Brochure Design",
    tagline: "Print-ready brochures with editorial polish.",
    priceMin: 50,
    priceMax: 150,
    features: [
      "Bi-fold or tri-fold",
      "Print-ready PDF",
      "Custom typography",
      "2 revision rounds",
    ],
  },
  {
    id: "logo",
    name: "Logo Design",
    tagline: "A mark your brand can grow into.",
    priceMin: 100,
    priceMax: 300,
    features: [
      "3 initial concepts",
      "Vector deliverables (SVG, PDF)",
      "Light & dark variants",
      "Usage guidelines",
    ],
  },
  {
    id: "branding",
    name: "Complete Branding Package",
    tagline: "Logo, palette, type & guidelines — the full identity.",
    priceMin: 300,
    priceMax: 500,
    features: [
      "Logo suite",
      "Color palette & typography",
      "Stationery templates",
      "Social media kit",
      "Brand guidelines PDF",
    ],
  },
];

export const priceRange = (s: Service) =>
  s.priceMin === s.priceMax ? `AED ${s.priceMin}` : `AED ${s.priceMin} – ${s.priceMax}`;
