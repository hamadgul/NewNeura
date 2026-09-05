/**
 * Site-wide SEO constants and JSON-LD builders.
 *
 * Two rules govern everything in this file.
 *
 * 1. NOTHING HERE IS INVENTED. Every value is a fact the site already states
 *    somewhere a visitor can read: the phone number and email from `OFFICES`,
 *    the service lines from `SERVICE_LINKS`, the founder's name and role from
 *    the About page. There is no `aggregateRating`, no `review`, no
 *    `numberOfEmployees`, no `priceRange` and no `foundingDate`, because none
 *    of those are established anywhere on this site. Structured data that
 *    contradicts the page it sits on is a manual-action risk, and a fabricated
 *    rating is a policy violation outright.
 *
 * 2. NO STREET ADDRESS. The team works out of New York with no street office —
 *    that is the honest reading of `OFFICES`, and it is why `address` carries
 *    locality, region and country only. `ProfessionalService` (a `LocalBusiness`
 *    subtype) is the correct type for a service-area business: Google reads
 *    `areaServed` for the geography and does not require `streetAddress` to
 *    understand the entity. Inventing one to satisfy a validator would put a
 *    false location in the knowledge graph.
 *
 * The builders return plain objects. `JsonLd` serialises them into a
 * `<script type="application/ld+json">` inside a server component, so none of
 * this ships as client JavaScript.
 */

/** Canonical origin. Every `@id` and `url` below is absolute against it. */
export const SITE_URL = "https://neuragul.com";

export const SITE_NAME = "NeuraGul";

/**
 * The name the Google Business Profile is registered under. It differs from
 * `SITE_NAME`, and both are declared on the organization node so the listing
 * and the site resolve to one entity. See `alternateName` below.
 */
export const GBP_NAME = "NeuraGul Labs";

/**
 * Stable `@id` values, so the Organization node can be referenced by every
 * other node on every page rather than re-declared nine times. Google
 * de-duplicates on `@id`; a graph that repeats the publisher inline on each
 * route is the same entity described from scratch each time.
 */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The Google Business Profile.
 *
 * `?cid=` is the canonical, permanent form of a GBP link — the decimal of the
 * second hex value in a Maps place URL's `!1s0x…:0x…` pair. The
 * `maps.app.goo.gl` short link the profile shares is a redirector and is not
 * guaranteed stable, so it is not what goes in `sameAs`.
 *
 * This URL is what ties the website entity to the Maps entity. Without it
 * Google has to infer that neuragul.com and the profile are the same business
 * from name and phone alone; with it, the claim is explicit.
 */
export const GOOGLE_BUSINESS_PROFILE = "https://www.google.com/maps?cid=6246670277837173462";

/** Straight from `OFFICES` in `home/content.ts` — one source of truth. */
export const BUSINESS = {
  telephone: "+1-203-685-9193",
  email: "hamad@neuragul.com",
  // No `addressLocality`: see the note on `address` in `organizationSchema`.
  addressRegion: "NY",
  addressCountry: "US",
  founder: "Hamad Gul",
} as const;

/**
 * Service areas, mirrored EXACTLY from the Google Business Profile's own
 * "Service area" list (Business information → Location → Service area).
 *
 * This is not a wishlist and not a guess. Google cross-references a site's
 * stated geography against the profile's, and the profile is the authority —
 * so this array is a transcription, in the profile's own order, and it changes
 * only when the profile changes.
 *
 * ── Read this before adding a place ─────────────────────────────────────────
 * The profile says "No location; deliveries and home services only", which is
 * why `organizationSchema`'s address carries no locality and no street: there
 * is no business address to state. See the note there.
 *
 * Three things this list settles that were previously inferred wrong:
 *
 *   1. NO WESTCHESTER. An earlier pass reverse-geocoded the pin in the
 *      profile's share link to Rye, Westchester County, and built a Westchester
 *      tier on it. The pin is the hidden registered address, not a service
 *      area, and Westchester appears nowhere in this list. Do not reintroduce
 *      it.
 *   2. NO BRONX, NO STATEN ISLAND. "The five boroughs" is a phrase this site
 *      used freely; the profile claims three. Only three are listed here.
 *   3. CONNECTICUT IS A THIRD OF THE PROFILE. Newtown, Monroe and Trumbull are
 *      Fairfield County, which is also where the (203) phone number comes
 *      from. The two facts corroborate each other.
 *
 * Queens carries six of the twelve entries, which is why Queens and its
 * neighbourhoods lead: `areaServed` is how a service-area business tells Google
 * which local packs it belongs in, and a neighbourhood is the unit people
 * actually search in ("web developer Forest Hills").
 */
export const AREA_SERVED = [
  // Queens — half the profile's list.
  "Queens, New York",
  "Jamaica, Queens, New York",
  "Ridgewood, Queens, New York",
  "Kew Gardens, Queens, New York",
  "Kew Gardens Hills, Queens, New York",
  "Forest Hills, Queens, New York",
  // Brooklyn.
  "Brooklyn, New York",
  "Williamsburg, Brooklyn, New York",
  // Manhattan — the profile's "New York, NY".
  "New York, New York",
  // Fairfield County, Connecticut.
  "Newtown, Connecticut",
  "Monroe, Connecticut",
  "Trumbull, Connecticut",
] as const;

/**
 * The service catalogue, as the nine routes under `/services/` describe it.
 * `name` is the search-facing name of the service rather than the nav label —
 * the nav says "Applied AI" because it sits in a column of five short nouns,
 * while structured data has no width constraint and should say what the thing
 * is.
 */
export const SERVICE_CATALOG = [
  { name: "Applied AI Development", href: "/services/applied-ai/" },
  { name: "Web Development", href: "/services/web-development/" },
  { name: "Mobile App Development", href: "/services/app-development/" },
  { name: "Cloud Infrastructure & DevOps", href: "/services/cloud-infrastructure/" },
  { name: "Data Engineering & Analytics", href: "/services/data-intelligence/" },
  { name: "AI Strategy Consulting", href: "/services/applied-ai/strategy/" },
  { name: "Custom AI Model Development", href: "/services/applied-ai/models/" },
  { name: "RAG & AI Agent Development", href: "/services/applied-ai/agents/" },
  { name: "AI Evaluation & Guardrails", href: "/services/applied-ai/evaluation/" },
] as const;

/** Absolute URL for a site-relative path. Paths carry their trailing slash. */
export const abs = (path: string) => `${SITE_URL}${path}`;

/**
 * The catalogue name for a service route.
 *
 * Service pages call this rather than passing their `<title>` stem: a title tag
 * says "Web Development Company in New York" because it is competing in a
 * result list, while `schema:name` and `serviceType` want the name of the
 * service itself. Passing the title would put a city and a page type inside a
 * field that means neither.
 *
 * Falls back to the passed label if the route is not catalogued, so a new
 * service page renders valid data before anyone remembers to list it here.
 */
export function serviceNameFor(href: string, fallback: string) {
  return SERVICE_CATALOG.find((service) => service.href === href)?.name ?? fallback;
}

/* ------------------------------------------------------------------ *
 * Site-wide nodes — emitted once, from the root layout
 * ------------------------------------------------------------------ */

/**
 * The publisher. `ProfessionalService` rather than the bare `Organization`
 * because this is a local business with a service area, and rather than
 * `LocalBusiness` because the more specific type is always preferred when it
 * fits.
 *
 * `hasOfferCatalog` is what connects the entity to the nine service pages. It
 * is the difference between "a company exists at this URL" and "this company
 * offers RAG development in Brooklyn", which is the claim the local pack is
 * actually ranking.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: SITE_NAME,
    /*
      The Google Business Profile is registered as "NeuraGul Labs" while the
      domain, the wordmark, the preloader and every page say "NeuraGul".
      `alternateName` is what reconciles the two into one entity without either
      side having to be renamed — Google matches a listing to a site partly on
      exact name, and this states outright that both strings are this business.
    */
    alternateName: GBP_NAME,
    url: `${SITE_URL}/`,
    description:
      "NeuraGul is a New York software development team building custom software, websites, mobile apps, cloud infrastructure, data pipelines and applied AI systems for small companies. Serving Queens, Brooklyn, Manhattan and Fairfield County, Connecticut.",
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    /*
      Region and country only — no `addressLocality`, deliberately.

      The Google Business Profile hides its address (it is a service-area
      business), and the town this pin sits in was inferred by reverse-geocoding
      the coordinates in the profile's share link, not read off the profile
      itself. Publishing a locality that turns out to be the neighbouring town
      would put a wrong location in the knowledge graph and break NAP against
      the profile — the exact failure this file exists to avoid.

      Since confirmed from the profile itself: it reads "No location; deliveries
      and home services only". There is no business address to state, so no
      locality is ever added here. `areaServed` carries the whole geography.
    */
    address: {
      "@type": "PostalAddress",
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: AREA_SERVED.map((name) => ({ "@type": "Place", name })),
    /*
      The only profile this business has anywhere. `sameAs` is how a site
      declares "these other URLs are also me", and the Google Business Profile
      is by far the highest-value one to declare for a local business — it is
      the difference between Google inferring the link and being told it.
    */
    sameAs: [GOOGLE_BUSINESS_PROFILE],
    founder: { "@type": "Person", name: BUSINESS.founder },
    knowsAbout: [
      "Custom software development",
      "Web development",
      "iOS and Android app development",
      "Applied artificial intelligence",
      "Retrieval-augmented generation",
      "AI agents",
      "Machine learning evaluation",
      "Data engineering",
      "ETL pipelines",
      "Cloud infrastructure",
      "Technical SEO",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software and AI development services",
      itemListElement: SERVICE_CATALOG.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: abs(service.href),
        },
      })),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      areaServed: "US",
      availableLanguage: "English",
    },
  };
}

/** The site itself, so search engines have a name for the domain. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/* ------------------------------------------------------------------ *
 * Per-page nodes
 * ------------------------------------------------------------------ */

export interface BreadcrumbEntry {
  name: string;
  /** Site-relative, trailing slash included. */
  href: string;
}

/**
 * `BreadcrumbList` is the only structured data on this site that changes what a
 * result *looks like* — Google replaces the URL line in the SERP with the
 * trail. Worth emitting on every page below the root, which is why the home
 * crumb is prepended here rather than repeated at nine call sites.
 */
export function breadcrumbSchema(trail: readonly BreadcrumbEntry[]) {
  const full = [{ name: "Home", href: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: abs(entry.href),
    })),
  };
}

export interface ServiceSchemaInput {
  /** Search-facing service name, e.g. "Web Development in New York". */
  name: string;
  description: string;
  /** Site-relative canonical, trailing slash included. */
  href: string;
  /**
   * The deliverables this service page lists. They become an `OfferCatalog`,
   * which is how a service page states its scope in a form an answer engine
   * can quote back.
   */
  deliverables?: readonly string[];
}

/**
 * A `Service` node bound to the publisher through `provider`.
 *
 * `serviceType` repeats the name deliberately: Google's own examples use it as
 * the categorical label, and it is the field most likely to be read as the
 * "what is this" answer when the page is summarised.
 */
export function serviceSchema({ name, description, href, deliverables }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url: abs(href),
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED.map((place) => ({ "@type": "Place", name: place })),
    ...(deliverables && deliverables.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${name} deliverables`,
            itemListElement: deliverables.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item },
            })),
          },
        }
      : {}),
  };
}

export interface CaseStudySchemaInput {
  name: string;
  description: string;
  href: string;
  /** Site-relative image path. */
  image: string;
  /** The service lines the project carries, e.g. ["Applied AI"]. */
  about?: readonly string[];
}

/**
 * Case studies are `CreativeWork`, not `Article`: nobody authored them as
 * journalism and they carry no `datePublished` anyone could verify. `creator`
 * points at the organization, which is the claim that matters — this is work
 * NeuraGul did.
 */
export function caseStudySchema({ name, description, href, image, about }: CaseStudySchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    headline: name,
    description,
    url: abs(href),
    image: abs(image),
    creator: { "@id": ORG_ID },
    inLanguage: "en-US",
    ...(about && about.length > 0
      ? { about: about.map((topic) => ({ "@type": "Thing", name: topic })) }
      : {}),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * `FAQPage`. Google narrowed rich-result eligibility for this type to
 * government and health sites in 2023, so it is emitted for the answer engines
 * rather than for a SERP accordion: ChatGPT, Perplexity and AI Overviews all
 * parse it, and a question-and-answer pair is the most quotable shape a page
 * can offer them.
 *
 * Every answer must also appear as visible text on the page. Structured data
 * that says something the page does not is the single most common reason a
 * site gets a structured-data manual action.
 *
 * Currently unused, and kept deliberately. No route has an FAQ section yet —
 * adding one is new content rather than a rewrite, so it was left as the
 * user's call. This is here so that when a page does grow one, the schema is
 * not reinvented alongside it.
 */
export function faqSchema(entries: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
