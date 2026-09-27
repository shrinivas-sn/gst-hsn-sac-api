export const GUIDES = [
  {
    id: "free-hsn-code-lookup-api-nodejs",
    title: "Free HSN Code Lookup in Node.js Without Paid GSP Gateways",
    summary: "Query India's 16,825 HSN tariff codes and slab rates in Node.js and React using a keyless, zero-dependency public REST API.",
    readTime: "5 min read",
    category: "Integration Guide",
    date: "Sep 2026",
    keywords: ["free hsn code api", "gst hsn search nodejs", "hsn code lookup api india", "cbic hsn codes"],
    sections: [
      {
        heading: "The Problem with Commercial GSP Gateways",
        content: "Building invoicing software or e-commerce checkouts for Indian businesses requires classifying products against the Central Board of Indirect Taxes and Customs (CBIC) Harmonized System of Nomenclature (HSN). Most commercial GST Suvidha Providers (GSPs) put basic code search behind monthly subscriptions, credit card forms, and opaque API authentication tokens.\n\nThe GST classification table is public domain data under Section 52(1)(q) of the Indian Copyright Act 1957. A search service for this data does not need private tokens or monthly subscriptions."
      },
      {
        heading: "HSN Code Numbering Structure",
        content: "Indian HSN codes follow an 8-digit hierarchical tree:\n\n• Chapter (Digits 1–2): Broad commodity group (e.g., Chapter 09 covers Coffee, Tea, Mate, and Spices).\n• Heading (Digits 3–4): Specific product classification within the chapter (e.g., 0901 covers Coffee).\n• Sub-heading (Digits 5–6): Intermediate product condition (e.g., 0901.11 covers Coffee, not roasted, not decaffeinated).\n• Tariff Item (Digits 7–8): Specific national product definition (e.g., 0901.11.10 covers Arabica plantation coffee)."
      },
      {
        heading: "Quick Start cURL Example",
        code: 'curl -s "http://localhost:3000/v1/hsn/search?q=coffee"'
      },
      {
        heading: "Node.js Integration Code",
        code: `async function searchHsn(query) {
  const url = \`http://localhost:3000/v1/hsn/search?q=\${encodeURIComponent(query)}\`;
  const response = await fetch(url);
  const json = await response.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data; // returns array of { code, description, rate, chapter }
}`
      }
    ]
  },
  {
    id: "hsn-code-digits-rules-einvoicing",
    title: "4-Digit vs 6-Digit vs 8-Digit HSN Codes: GST Invoicing Rules and Validation",
    summary: "Mandatory HSN code length rules under CBIC Notification 78/2020 for Indian B2B invoicing, e-invoicing, and exports, with automated validation logic.",
    readTime: "6 min read",
    category: "Compliance & Rules",
    date: "Sep 2026",
    keywords: ["hsn code digits rule gst e-invoicing", "b2b gst hsn validation api", "turnover 5 crore hsn mandatory digits"],
    sections: [
      {
        heading: "Statutory Length Rules (CBIC Notification 78/2020)",
        content: "Effective 1st April 2021, the mandatory number of digits depends strictly on the supplier's Aggregate Annual Turnover (AATO) in the preceding financial year:\n\n• Turnover up to ₹5 Crore: Minimum 4 digits for B2B supplies (optional for B2C).\n• Turnover above ₹5 Crore: Minimum 6 digits for all B2B and B2C supplies.\n• Export & Import: Full 8 digits strictly mandatory regardless of company turnover.\n• Chemical & Special notified goods: Mandatory 8 digits for 49 specific tariff lines."
      },
      {
        heading: "Why 2-Digit Chapter Codes Fail on IRP Gateways",
        content: "In the initial 2017 rollout of GST, some small taxpayers used 2-digit chapter numbers on invoices. Under current regulations, a 2-digit number (e.g., '09') is rejected for all B2B transactions. The minimum valid level is the 4-digit heading (e.g., '0901'). Furthermore, 4-digit or 6-digit codes must be valid prefixes of real 8-digit tariff lines in the official Customs Tariff Act schedule."
      },
      {
        heading: "Programmatic Validation Snippet",
        code: `function checkHsnLength(code, annualTurnoverInCr, isExport = false) {
  const clean = String(code).replace(/\\D/g, '');
  if (isExport && clean.length !== 8) return { valid: false, reason: 'Export requires 8 digits' };
  if (annualTurnoverInCr > 5 && clean.length < 6) return { valid: false, reason: 'Turnover > 5Cr requires 6 digits' };
  if (clean.length < 4) return { valid: false, reason: 'Minimum 4 digits required for B2B' };
  return { valid: true };
}`
      }
    ]
  },
  {
    id: "sac-vs-hsn-codes-invoicing-pipeline",
    title: "SAC vs HSN Codes: Building a Dual Tax Classification Pipeline in Node.js",
    summary: "How Services Accounting Codes (Chapter 99) differ from HSN tariff codes and how to handle dual goods and services classification in invoicing software.",
    readTime: "7 min read",
    category: "Architecture & ERP",
    date: "Sep 2026",
    keywords: ["sac code search api", "services accounting code gst lookup", "difference between hsn and sac code api", "chapter 99 gst services"],
    sections: [
      {
        heading: "Fundamental Differences Between HSN and SAC",
        content: "Enterprise billing and ERP applications in India must handle two distinct tax classification systems under GST:\n\n• HSN (Goods): Chapters 01 to 98 covering 16,825 tangible goods. Variable length (2, 4, 6, 8 digits).\n• SAC (Services): Chapter 99 exclusively covering 568 service classifications. Fixed 6 digits starting with '99'."
      },
      {
        heading: "Common Tech & SaaS SAC Codes",
        content: "• 998313: Information technology consulting and support services\n• 998314: Internet telecommunication and hosting infrastructure services\n• 998315: Web design and hosting services\n• 998319: Other IT services not elsewhere classified\n• 998431: On-line text and software retrieval services"
      },
      {
        heading: "Unified Dual Router Implementation",
        code: `async function classifyTaxItem(query) {
  const isService = query.startsWith('99') && /^\\d{6}$/.test(query);
  const endpoint = isService
    ? \`/v1/sac/\${query}\`
    : \`/v1/hsn/\${query}\`;
  const res = await fetch(endpoint);
  return res.json();
}`
      }
    ]
  }
];
