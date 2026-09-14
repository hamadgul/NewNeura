/**
 * Content for `/work/rwd-pipeline/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/rwd-pipeline.md`, which cites the slide number
 * and the exact text in `~/Projects/NeuraGul/assets/docs/rwd-pipeline-portfolio.pptx`
 * behind each claim. That deck is the only source: the project has no
 * repository, no UI and no live site. Nothing below is written from memory,
 * and the dossier's "Unverifiable claims" section lists what was deliberately
 * NOT written (a year, a duration, a job title, the data vendor's name, the
 * deck's own "1 month -> 1 week" beside its "60%").
 *
 * Image sizing note: `width`/`height` are the files' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the diagram), because `next/image`
 * reserves the aspect ratio from them and every block here sizes itself from
 * that ratio rather than from a fixed height.
 *
 * The one in-page image is the deck's own data-flow diagram (slide 36),
 * letterboxed onto the site's cover ground; nothing in it is edited. No
 * screenshot exists for this project and none is invented, so the page is
 * text-forward on purpose: five prose blocks, one diagram, the details
 * table, the CTA.
 *
 * NUMBERS — every figure on this page is a figure the deck states, with its
 * slide cited in the dossier. None was re-measured, because there is nothing
 * to measure against, and the copy says so where the KPIs are printed. No
 * patient-level figure, cohort size or institution's private data appears
 * anywhere in the deck or here.
 *
 * VOICE — the site says "we", never "I", and nothing here claims a headcount.
 * This page is the site's one deliberate exception to "we": the pipeline is
 * Hamad Gul's own work as a product manager at Freenome before NeuraGul
 * existed, so a team "we" would be false and the copy attributes it to him by
 * name in the third person (the standing ruling recorded in
 * `neuragul-team-voice.md`, rule 4). Where the deck says "we" about the RWD
 * team at Freenome, this page says "the team". "We" never appears in the
 * rendered copy of this page.
 *
 * Freenome is named because the deck names it (slide 11) and `/about/` and
 * two service pages already do. The external data vendor the deck names once
 * (slide 24) is not named here or anywhere on the site; the copy says "one
 * external partner", the deck's own word for outside parties.
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are metadata only — the `<title>`
 * stem and the meta description — written to compete in a result list rather
 * than to open a page; see the notes on each.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Real-World Data Pipeline" on the page and in the breadcrumb.
 * The two diverge on purpose: an `<h1>` sits under a header that has already
 * established what the page is, while a `<title>` is read cold in a result
 * list, so it has to name the category of work as well as the domain.
 * "for Cancer Research" is slide 5's stated purpose ("accelerating research
 * in early cancer detection"). `PROJECT_TITLE` is referenced only by
 * `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "Real-World Data Pipeline for Cancer Research";
export const PROJECT_CANONICAL = "/work/rwd-pipeline/";
/**
 * The meta description. It states what was built and what it was built with,
 * in 160 characters (the SERP cap; "research" is dropped here because
 * `PROJECT_TITLE` already ends "for Cancer Research"). An earlier version
 * counted "dozens of sources", which
 * the deck never does (it says "diverse sources & formats", slide 5, and
 * names four source types, slide 6); the source types and the model are
 * what the deck states.
 */
export const PROJECT_DESCRIPTION =
  "A 0-to-1 ETL pipeline normalising real-world clinical data (hospital records, claims, wearables) into one OMOP model on Google Cloud for early cancer detection.";
export const PROJECT_OG_IMAGE = `${IMAGES}/rwd-pipeline.jpg`;

/**
 * No `PROJECT_LIVE` here (final review, 2026-09-11).
 *
 * This project has no site. The source page's "Case study" details row
 * opened the deck through the Office web viewer at
 * `https://neuragul.com/assets/docs/rwd-pipeline-portfolio.pptx`, but that
 * file is NOT in this repository (it lives in
 * `~/Projects/NeuraGul/assets/docs/`), so the URL 404s on the deployed site
 * and the viewer shows an error. The row is removed rather than pointed at
 * a file that does not ship. Whether the deck is committed is the user's
 * call, not this task's: it is 5.4 MB in a public repo and it names the data
 * vendor the page withholds (dossier, Unverifiable 6). If it is committed
 * under `public/assets/docs/`, restore the row as
 * `{ label: "Case study", value: "neuragul.com/assets/docs/rwd-pipeline-portfolio.pptx", href: <viewer URL> }`
 * and re-check the details table's row count below.
 */

/**
 * Header. `lead` is the project's arc, not its brief: the brief is the
 * `BlockIntroDouble` statement below. "MVP to V1" is the deck's own sequence
 * (slide 24: "Launched MVP … prepared for V1 release"; slide 27: "iterated to
 * deliver a refined V1 product"); "one OMOP model" is slide 37.
 * LENGTH IS MEASURED: this title is three words and wraps to three lines at
 * 320 px, so the lead slot is a line tighter than a one-word title's.
 * Measured in the live slot on the user's :3000 (`$SCRATCH/rwd-lead.mjs`,
 * task-17-report.md §6): the shipped 80 characters is four lines at 320
 * (h1 bottom 494), four at 360 (448) and three at 390 (417), all inside the
 * 500px band. A 94-character draft was five lines at 320 and ran 25 px into
 * the cover (measured before 5ab9d32). Since 5ab9d32 the band is
 * `minmax(500px, auto)` below `md`, so a longer lead can no longer run the
 * `<h1>` into the cover there; it pushes the cover down instead. The band is
 * still a fixed 500px from `md` up, and the xl lead column (1280, ~27
 * chars/line, three lines) is the tightest slot (this lead is three lines
 * there, gap -37.3), so re-measure at 1280 as well as 320 before
 * lengthening.
 *
 * `location` has no year, and this is the one case study header without one:
 * the deck carries no date for the engagement (its only date is a 2019
 * third-party survey it cites), and the site convention `2026 · …` would put
 * a year on this page that nothing supports. The `/work/` tile prints the
 * same string. See the dossier, Unverifiable 1.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Real-World Data Pipeline",
  lead: "A 0-to-1 pipeline normalising clinical data into one OMOP model, from MVP to V1.",
  location: "Product · 0-to-1",
  service: "Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/rwd-pipeline.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, run through `projectIntroTabs`, which relabels
 * the tabs to "The brief" / "The tech stack" and fills the second panel from
 * the `Stack` row of `PROJECT_DETAILS`. So only `statement` and `body` below
 * reach the page; `labels` and `activeLabel` are overwritten by that helper.
 * (An earlier version of this file set the second label to "What Hamad led";
 * the helper never rendered it, and the attribution now lives in `body`.)
 *
 * `statement` is the brief as a problem: slides 5, 6, 7 and 9. The source
 * types are slide 6's list; "in different formats" is slide 7 ("Too many data
 * formats"). `body` is slides 11 (Freenome), 5 (one unified CDM), 37 (OMOP),
 * 38 (Google Cloud) and 9 (who consumed it).
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "The tech stack"],
  activeLabel: 0,
  statement:
    "Early cancer detection research runs on real-world clinical data, and real-world clinical data arrives inconsistent and in different formats from hospital records, claims and billing systems, wearables and other sources.",
  body: "Hamad Gul led product management at Freenome for a 0-to-1 ETL pipeline that normalises all of it into one common data model, OMOP, on Google Cloud. Research and machine-learning teams built on that one model instead of on each raw dataset.",
};

/**
 * Block 3 — `BlockWysiwyg`: the before-state.
 *
 * Every sentence is slide 13 or 14, which are the deck's own account of the
 * manual process: queries rewritten per dataset, no version control, no
 * written procedure, corrections carried back by hand between steps, bugs
 * with no traceability, ML scientists waiting, partners without the
 * resources to standardise. The page argues against this paragraph.
 */
export const PROJECT_BEFORE: BlockWysiwygProps = {
  title: "Before the pipeline",
  body: [
    {
      type: "paragraph",
      text: "Each new dataset meant an analyst writing queries by hand to get it into the common model, then rewriting them for the next one. There was no version control and no written procedure, so a correction at one normalisation step had to be carried back by hand into the others. A bug that reached a machine-learning team could not be traced to the step that made it. The ML scientists waited on that manual work and sent the data problems back to the analysts who had done it. External partners without the resources to standardise their own data were left analysing it by hand, and sensitive data went through the same manual steps.",
    },
  ],
};

/**
 * Block 4 — `BlockWysiwyg`: what the pipeline does, stage by stage.
 *
 * Slide 35's "Pipeline Data Flow" list, in its order, with slide 36's diagram
 * (the block below) as the picture of it. "Pauses until an engineer or
 * informaticist" is slide 35's own rule. The DataHub sentence is slides 29
 * and 36; automatic runs and non-technical configuration are slide 29.
 */
export const PROJECT_STAGES: BlockWysiwygProps = {
  title: "Four stages, paused on any failed check",
  body: [
    {
      type: "paragraph",
      text: "The pipeline reads a dataset in memory from a landing bucket and runs it through four stages. Syntactic normalisation fixes formatting: a misplaced comma, a mismatched type. Semantic normalisation maps the dataset's own codes to standard vocabularies through a terminology management system. Structural normalisation reshapes the result into the common data model and writes it to BigQuery, and post-processing derives further values from business rules and adds them alongside.",
    },
    {
      type: "paragraph",
      text: "Quality checks run throughout. If one fails, processing pauses until an engineer or informaticist corrects the data, and a final quality assessment runs on the processed output with OMOP's own open-source tools. Each stage emits metadata to DataHub, which holds the record of what happened to a dataset at every step. A run starts on its own when data refreshes, and the pipeline's settings and configurations can be changed by non-technical users.",
    },
  ],
};

/**
 * Block 5 — `BlockImageFull`: the deck's data-flow diagram, slide 36.
 *
 * The evidence for the two paragraphs above it: every box and arrow label in
 * the alt is the diagram's own. The diagram is `ppt/media/image51.png`
 * (2048x963) scaled to 1520x715 and centred on the site's cover ground;
 * provenance and the compose script are in the dossier's Shot list. It is
 * the first image after the header's own, so the page passes it `priority`.
 * The diagram's own spelling of the first stage is kept in the picture; the
 * alt describes the stages, it does not transcribe the typo.
 */
export const PROJECT_IMAGE_DATAFLOW: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/rwd-pipeline-dataflow.jpg`,
    alt: "The deck's data-flow diagram: a data landing bucket read in memory, then syntactic, semantic and structural normalisation and post-processing inside the RWD pipeline, a terminology management system read and written at the semantic step, BigQuery written at the end, and metadata emitted to DataHub after each step.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 6 — `BlockWysiwyg`: the model and the stack.
 *
 * Slide 37 (OMOP, its tables and vocabularies), slide 9 (who consumes it and
 * why; "without the need to constantly rewrite models for every single raw
 * dataset" is the slide's own sentence), slide 29 (the CDM library with an
 * API) and slide 38 (the technology list, verbatim in the dossier's Stack
 * table).
 */
export const PROJECT_MODEL: BlockWysiwygProps = {
  title: "One model: OMOP",
  body: [
    {
      type: "paragraph",
      text: "The common data model is OMOP, the Observational Medical Outcomes Partnership model: a fixed set of tables such as Person, Drug Exposure and Measurement, with values mapped to the standard vocabularies SNOMED, LOINC and RxNorm. The point of a fixed model is what sits downstream. Research teams query one standardised dataset to form hypotheses for early cancer detection, machine-learning teams train against one schema without rewriting a model for every raw dataset, and a CDM library holds every OMOP data model with an API for users to read from.",
    },
    {
      type: "paragraph",
      text: "The pipeline itself is Python, with Pandas, Polars and SQLGlot, orchestrated by Flyte, running on Google Cloud with BigQuery as the data lake for the OMOP data and DataHub as the metadata store. Its front end is React.",
    },
  ],
};

/**
 * Block 7 — `BlockWysiwyg`: how the product was run.
 *
 * This is the site's one product-management case study, so the management
 * record is the argument. Slides 17–27, in order: KPIs before development
 * and OKRs (17); interviews, the biweekly sync, the one-on-ones (18);
 * MoSCoW, RICE and the PRD (19); epics named for the stages, quarterly story
 * mapping, estimation (21); the four ceremonies (22); tech-debt tickets each
 * quarter (23); the A/B-tested library dispute (20); governance, privacy and
 * IP approvals (23) and the HIPAA changes (26); UAT, synthetic then real
 * data, MVP to V1, load/integration/beta testing (24); monitoring, the lake
 * to lakehouse move, the later features (25, 26).
 *
 * "One external partner" replaces the vendor the deck names on slide 24; see
 * the header note. "A selected group" is slide 24's "select RWD Informatics
 * users"; no size is stated and none is written.
 */
export const PROJECT_RUN: BlockWysiwygProps = {
  title: "How it was run",
  body: [
    {
      type: "paragraph",
      text: "Success metrics and KPIs were set before development started, and OKRs tied to company goals tracked progress against them. Requirements came from interviews with the RWD informatics analysts who would run the pipeline, from a biweekly sync between them and engineering, and from one-on-ones with the engineering managers, the director of RWD informatics and the product managers upstream and downstream. MVP features were ranked with MoSCoW and RICE and recorded in a PRD alongside deadlines and major decisions.",
    },
    {
      type: "paragraph",
      text: "Work was broken into JIRA epics named for the pipeline's own stages, story-mapped each quarter and estimated with engineering. Hamad ran the daily standups, backlog grooming, sprint planning and retrospectives, and each quarter's plan carried tickets to pay down technical debt. When the analysts and the engineers disagreed on which Python library a stage should be built on, both were A/B tested and the team chose on the result. Any process touching sensitive data needed sign-off from data governance, privacy and IP, and when new governance policies arrived the pipeline's infrastructure was changed to stay HIPAA compliant.",
    },
    {
      type: "paragraph",
      text: "The MVP went to a selected group of RWD informatics users, tested first on synthetic data and then on real-world data from one external partner. Their feedback shaped the V1, which shipped after load, integration and beta testing. After launch the pipeline was monitored against its KPIs in GCP Cloud Log, BigQuery and DataHub, its output moved from the BigQuery data lake to an in-house lakehouse, and later releases added NLP extraction from patient reports, a metadata solution and ML-powered anomaly detection.",
    },
  ],
};

/**
 * Block 8 — `BlockWysiwyg`: the four KPIs the deck records, slide 30.
 *
 * Each figure is the slide's, with its wording kept close: "60% decrease in
 * TAT for RWD Normalization"; "40% less bugs reported by internal teams &
 * external partners for data (based on completeness, accuracy, file
 * formatting)"; "12% increase in ML Model Risk Prediction accuracy"; "100%
 * Adoption by RWD Analysts, no longer relying on manual methods".
 *
 * The slide also prints "From 1 month -> 1 week" beside the 60%, and the two
 * do not agree with each other (a month to a week is roughly 75%). The page
 * prints the headline figure only and the dossier flags the pair for the
 * user (Unverifiable 4). The 12% belongs to the ML teams' models and the
 * research behind them, and the sentence says so. The last sentence makes
 * the provenance explicit on the page, because nothing here was re-measured.
 */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Measured after launch",
  body: [
    {
      type: "paragraph",
      text: "Against the KPIs set at the start, the turnaround for normalising a real-world dataset fell 60%. Data bugs reported by internal teams and external partners, counted on completeness, accuracy and file formatting, fell 40%. The internal ML teams' risk-prediction models gained 12% in accuracy on the standardised data, a result that belongs to those models and the research behind them. Adoption among the RWD analysts reached 100%, with none still on the manual method. All four are the figures the case-study deck records.",
    },
  ],
};

/**
 * Block 9 — `BlockProjectDetails`. The real facts only.
 *
 * `Stack` is slide 38's "Technology Used" list, which is what the second
 * intro tab prints under "The tech stack". It used to hold three disciplines
 * ("Product Management, Agile, Planning"), which read oddly under that
 * heading; the disciplines are now the `Role` row. `Model` is slide 37;
 * `Cloud` and `Orchestration` are slide 38; `Stage` is slide 3 ("0 - 1") and
 * slides 24/27 (MVP → V1). There is no `Year` row: the deck gives no date
 * (see `PROJECT_HEADER`).
 *
 * `Stack` stays in this array — `projectIntroTabs` (in `page.tsx`) reads it
 * to build the second intro tab — but `projectDetailsWithoutStack` filters it
 * out before this array reaches `BlockProjectDetails`, so the rendered table
 * sees the other five rows. Five is odd, so from `md` up the last row
 * (`Orchestration`) stands alone in the left column with the right one
 * empty — the same shape `packship` renders with its five rows. It was six
 * until the dead "Case study" row was removed (see the note above
 * `PROJECT_HEADER`).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Python, Pandas, Polars, SQLGlot, Flyte, Google Cloud, BigQuery, DataHub, React" },
  { label: "Role", value: "Product management" },
  { label: "Stage", value: "0-to-1 · MVP to V1" },
  { label: "Model", value: "OMOP common data model" },
  { label: "Cloud", value: "Google Cloud · BigQuery" },
  { label: "Orchestration", value: "Flyte" },
];

/**
 * Block 10 — `GeneralCta`, the site's call-to-action band.
 *
 * Declared here rather than imported from `GeneralCta.tsx`: that block is a
 * `"use client"` module, so a plain value imported from it into a server
 * component arrives as a client-reference proxy and spreads to undefined
 * props. This file has no `"use client"`, so the value stays real in the
 * server graph.
 *
 * The line is this project's own problem, per `.agents/product-marketing.md`
 * §1: slide 13's "rewrite ETL queries for new each dataset", as the question
 * a reader with the same process would recognise.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Still rewriting the ETL for every new dataset?",
  label: "Tell us about your pipeline",
  href: "/contact/",
};
