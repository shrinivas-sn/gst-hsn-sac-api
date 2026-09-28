export const GUIDES = [
  {
    id: "free-hsn-code-lookup-api-nodejs",
    title: "Search HSN Classifications in Node.js",
    summary: "Search the community-maintained HSN code dataset from Node.js using the free public REST API. Rates are not supplied.",
    readTime: "5 min read",
    category: "Integration Guide",
    date: "Sep 2026",
    keywords: ["free hsn code api", "gst hsn search nodejs", "hsn code lookup api india", "cbic hsn codes"],
    sections: [
      {
        heading: "What this API returns",
        content: "Use text search to explore code descriptions and exact lookup to retrieve a record. Results come from a third-party classification dataset with no verified snapshot date. The API does not return tax rates or establish current legal validity; check the applicable official source for compliance work."
      },
      {
        heading: "HSN Code Numbering Structure",
        content: "Indian HSN codes follow an 8-digit hierarchical tree:\n\n• Chapter (Digits 1–2): Broad commodity group (e.g., Chapter 09 covers Coffee, Tea, Mate, and Spices).\n• Heading (Digits 3–4): Specific product classification within the chapter (e.g., 0901 covers Coffee).\n• Sub-heading (Digits 5–6): Intermediate product condition (e.g., 0901.11 covers Coffee, not roasted, not decaffeinated).\n• Tariff Item (Digits 7–8): Specific national product definition (e.g., 0901.11.10 covers Arabica plantation coffee)."
      },
      {
        heading: "Quick Start cURL Example",
        code: 'curl -s "https://gst-hsn-sac-api.vercel.app/v1/hsn/search?q=coffee"'
      },
      {
        heading: "Node.js Integration Code",
        code: `async function searchHsn(query) {
  const url = \`https://gst-hsn-sac-api.vercel.app/v1/hsn/search?q=\${encodeURIComponent(query)}\`;
  const response = await fetch(url);
  const json = await response.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data; // classification records; no tax rates
}`
      }
    ]
  },
  {
    id: "hsn-code-digits-rules-einvoicing",
    title: "Understanding HSN Code Lengths",
    summary: "Understand chapter, heading, subheading, and tariff-item prefixes when browsing the HSN dataset.",
    readTime: "6 min read",
    category: "Classification Structure",
    date: "Sep 2026",
    keywords: ["hsn code digits rule gst e-invoicing", "b2b gst hsn validation api", "turnover 5 crore hsn mandatory digits"],
    sections: [
      {
        heading: "Classification levels",
        content: "The first two digits identify a chapter; four digits identify a heading; six identify a subheading; eight can identify a tariff item. This describes the structure of records in the dataset, not the number of digits required on a particular invoice."
      },
      {
        heading: "Lookup is not invoice validation",
        content: "The API looks up records from a community-maintained snapshot. It does not check current invoice rules, turnover thresholds, effective dates, or whether a code is accepted by an invoicing portal."
      },
      {
        heading: "Browse a chapter",
        code: 'curl "https://gst-hsn-sac-api.vercel.app/v1/hsn/chapters/09?limit=50&offset=0"'
      }
    ]
  },
  {
    id: "sac-vs-hsn-codes-invoicing-pipeline",
    title: "SAC vs HSN Codes: Routing Classification Lookups",
    summary: "How to route goods and services code lookups to the correct endpoint without inferring a tax rate.",
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
        code: `async function lookupClassification(query) {
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
