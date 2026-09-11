# Real-World Data Pipeline — case-study dossier

Source of record: **one file, `~/Projects/NeuraGul/assets/docs/rwd-pipeline-portfolio.pptx`, and
nothing else** (5,380,224 bytes, mtime 2026-05-30 00:02:45, sha256
`a1783530a7ea7cfb483684e6cd67f3d1636dc57cce75f1c73a646d6d108acbe4`). It is the deck the page's
details table already links to through the Office web viewer. There is no repository, no UI,
no live site and no manifest: the plan's row reads "No UI exists; this page stays text-forward.
Do not invent screenshots." Every line in this file names the slide number and the exact text on
it, or the media file inside the deck, and nothing is taken from memory.

The page it backs: `/work/rwd-pipeline/` — `src/components/site/work/rwd-pipeline/content.ts`
and `src/app/work/rwd-pipeline/page.tsx`.

**How the deck was read.** LibreOffice is not installed on this machine and nothing was
installed, so the plan's `soffice --headless` step was replaced by `unzip` into `$SCRATCH/rwd/`
and `python-pptx 1.0.2` (`$SCRATCH/rwd/dump.py` → `dump.txt`, 324 lines): every text frame,
picture, table and notes frame of every slide in presentation order (slide order from
`ppt/_rels/presentation.xml.rels`, rId6…rId43 → `slide1.xml`…`slide38.xml`, numeric). Pictures
were mapped to `ppt/media/*` through each slide's `_rels` and every media file was viewed on a
contact sheet. Section dividers (slides 4, 10, 15, 28, 31, 33) and the percentage rings on
slides 12 and 30 are groups of shapes, not images; they are described here in text and were never
rendered. The deck is a Google Slides export (every shape is `Google Shape;NNNN;pNN`; no
`docProps/`), 38 slides at 10 × 5.625 in.

**What "deck-only" means for every claim.** A claim survives onto the page only if a slide states
it. What a deck cannot show — when the engagement ran, how long it took, how large the team was,
what the client's data contained, whether the four KPIs were measured the way the slide implies —
is listed under *Unverifiable claims* for the user and never printed. The deck is written in the
first person ("I drafted OKRs", "I created a RACI matrix"); the page keeps this site's standing
ruling for this one project (memory `neuragul-team-voice.md`, rule 4: the Freenome pipeline is
Hamad's own biography, attributed by name in the third person, and is the deliberate exception to
the site's "we"), so the copy says "Hamad" where the deck says "I" and "the team" where the deck
says "we". Nothing on the page says "we" about this project and nothing claims a headcount.

**PHI and names.** No slide holds a patient identifier, a cohort figure, an institution's private
data or a screenshot of real data (slide 6: "these are all patient anonymous, meaning we are only
looking at specific data points"); none appears on the page. The deck names **Freenome** (slide
11 ×2, the notes of slide 17, an image `descr` on slide 3) and the current page, `/about/` and two
service pages already do, so the page keeps it. The deck names one external data vendor once
(slide 24, "testing with synthetic data and then with Cerner's real-world data"); neither the
current page nor `.agents/product-marketing.md` names it, so the page says "real-world data from
one external partner" (the deck's own word for outside parties, slides 16 and 30) and the name
stays in this dossier only.

---

## Stack (verified)

Read from slide 38, **"Technology Used"**, the deck's only stack slide, exact text:

| Component | Slide 38 text | Where else in the deck |
| --- | --- | --- |
| Language & libraries | **`Python: Backend, Pandas, SQLGlot, Polars`** | slide 20 ("library X in python"); the Python logo `image56.png` on slide 38 |
| Orchestration | **`Flyte: Task Orchestration Engine`** | the Flyte wordmark `image49.png` on slide 38 |
| Cloud | **`Google Cloud Platform: Used Compute, BigQuery, Buckets, Pub/Sub, Looker`** | slide 25 ("GCP Cloud Log, BigQuery, and DataHub"); slide 29 ("Utilizes GCP for cloud debugging/storage/access"); slide 35 ("reading data in-memory from a GCP bucket"); the Google Cloud logo `image58.png` |
| Metadata | **`DataHub: Metadata Store`** | slide 29 ("Metadata Traceability: Integrated with DataHub for full lifecycle insights at each ETL stage"); slide 36 diagram ("Emits Metadata after each normalization step" → DataHub); the DataHub mark `image48.png` |
| Storage | **`BigQuery: Data Lake for OMOP Data`** | slide 26 ("Initially, the output was directed to our Data Lake (BigQuery). However, with the development of an in-house Data Lakehouse, adjustments were necessary"); slide 35 ("stored in BigQuery datasets"); slide 36 diagram |
| Front end | **`JavaScript / React: Front end development`** | nowhere else; no screenshot of it exists in the deck |
| Common data model | slide 37 **"OMOP!"** — "Standardized Tables … (e.g., Person, Drug Exposure, Measurement)", "Unified Vocabularies: Uses standard codes like SNOMED, LOINC, RxNorm"; slide 29 "CDM Library: Repository that contains all OMOP data models with API's for users to access"; slide 35 "a common data model, such as OMOP or FHIR" | the OMOP wordmark `image52.png` on slide 37 |

**No test suite, no repository, no version numbers.** The deck states no version of anything and
no test count; none is printed. The old `Stack` row, "Product Management, Agile, Planning", was
the source site's discipline list (memory `neuragul-port-scope-and-decisions.md` flagged that it
"reads oddly under a heading saying 'tech stack'"); slide 38 gives the real one, and the
disciplines move to a `Role` row.

---

## Architecture decisions

Five things a reader can check against the deck rather than an adjective. Each is cited to a
slide and quoted where the wording matters.

**1. Four normalisation stages in a fixed order, quality checks between them, and a pause on any
failure.** Slide 35, "Pipeline Data Flow": *Data Ingestion* ("reading data in-memory from a GCP
bucket"), *Syntactic Normalization* ("resolves data formatting issues … eg misplaced commas,
mismatched types"), *Semantic Normalization* ("standardizes codeset terminology to align with
industry standards"), *Structural Normalization* ("transformed to a common data model, such as
OMOP or FHIR, and then stored in BigQuery datasets"), *Post-Processing* ("Additional values and
metrics are derived based on a set of business rules and added to BigQuery alongside the main
data"), *Quality Checks* ("Throughout the process, checks ensure data integrity. If any issues
arise, processing is paused until an engineer or informaticist applies necessary corrections"),
*Post Processing CDM QC* ("QC is run on processed data using open source software from CDM
provider (OMOP)"). Slide 36's diagram (`image51.png`, 2048x963) draws the same: `Data Landing
Bucket` ← "Read in memory" → `Synctactic Normalization` [sic] → `Semantic Normalization` (with
`Read` / `Write` arrows to a `Terminology Management System`) → `Structural Normalization` →
`Post Processing`; `Write` from structural to `BigQuery`, `Read / Write` from post-processing;
"Emits Metadata after each normalization step" → `DataHub`. The JIRA epics on slide 21 are named
for the same stages ("Data Ingestion, Syntactic & Semantic Normalization, Structural & Post
Processing"). Slide 29 adds that a run "Kicks off automatically, updates data upon data
refreshes" and has "robust anomaly detection".

**2. One common data model, OMOP, with a library and an API in front of it.** Slide 37: "A
standardized model to harmonize healthcare data from diverse sources"; "Standardized Tables:
Organizes data into consistent tables (e.g., Person, Drug Exposure, Measurement)"; "Unified
Vocabularies: Uses standard codes like SNOMED, LOINC, RxNorm for data mapping". Slide 29: "CDM
Library: Repository that contains all OMOP data models with API's for users to access". Slide 5's
vision sentence names the target: "one unified common data model (CDM)". Slide 8: "Goal: One
unified common data model, One fruit. Everytime." Who consumes it is slide 9: *Internal Research
Teams* ("To conduct analysis on standardized datasets to generate medical hypotheses for early
cancer detection"), *Internal ML Teams* ("Streamlining ML model training without the need to
constantly rewrite models for every single raw dataset"), *External Providers* ("Pharma companies
use RWD to understand long term effectiveness & safety of their medications").

**3. Metadata emitted at every stage to DataHub.** Slide 29: "Metadata Traceability: Integrated
with DataHub for full lifecycle insights at each ETL stage". Slide 36 diagram: "Emits Metadata
after each normalization step". Slide 38: "DataHub: Metadata Store". Slide 25 uses the same store
for monitoring ("Used analytical tools like GCP Cloud Log, BigQuery, and DataHub to track product
performance and ensure alignment with KPIs"). The before-state this answers is slide 14: "No
version control … bi-directional adjustments and manual corrections between normalization steps"
and "introduced data bugs with no traceability".

**4. Configuration by non-technical users.** Slide 29: "User-Friendly Configurations:
Non-technical users can manage settings & configs, reducing manual engineering effort". The
before-state is slide 13: "RWD Analysts: Having to write sophisticated queries to get data into
CDM & rewrite ETL queries for new each dataset. This was a highly manual and time consuming
process". The front end that carries this is slide 38's "JavaScript / React: Front end
development"; no screenshot of it exists in the deck and none is faked.

**5. Sensitive data gated by governance, and the pipeline changed to follow it.** Slide 16: "Since
data was sensitive Data Governance needs to approve of any processes involving sensitive data".
Slide 23: "Processes involving sensitive data required approvals from privacy and IP teams, while
cloud infrastructure processes needed Infra tickets". Slide 26: "As new Data Governance policies
and procedures were introduced, we needed to ensure that all processes remained compliant with
HIPAA standards. Required modifications to the pipeline's infrastructure." Slide 14 lists
"Management of sensitive data" as the first concern with the manual process. Slide 6: "these are
all patient anonymous".

**How it was run (slides 17–27), the product-management record the page is actually a case study
of:**

- Slide 17: "Define success metrics and KPIs to measure value before development"; "Collaborated
  with engineering team lead to evaluate feasibility"; "Drafted OKRs to monitor product progress,
  tied to company goals & objectives".
- Slide 18: "Initial interviews with Stakeholders & Users"; "Biweekly Team Meetings: Regular sync
  between engineering, RWD Analysts (SMEs), and myself"; 1-on-1s with "Engineering Managers,
  Director of RWD Informatics, Upstream/Downstream Product Managers".
- Slide 19: "Used frameworks like MoSCoW and RICE to identify critical features for the MVP";
  "Maintained a Product Requirements Document (PRD) to track: Requirements, Deadlines & Timelines,
  Major decisions".
- Slide 20: "Informatics group wants to use library X in python while Engineering wants to use
  library Z. We A/B tested both, discussed as a team and aligned!"
- Slide 21: the JIRA epics; "story mapping sessions (or PI Planning) every quarter"; "wrote user
  stories with UAT and estimated with engineering"; "data flow diagrams, feature documentation,
  RAID logs, and API documentation".
- Slide 22: "Lead all agile ceremonies for the RWD Team, including: Daily standups, Backlog
  grooming, Sprint planning, Retrospectives"; "Work with the Tech Lead to define the high-level
  tech stack and architecture"; "Initiated development with SPIKEs".
- Slide 23: "I'd make sure to include tickets every quarter to assess & resolve tech debt
  proactively"; "I created a RACI matrix to define roles explicitly".
- Slide 24: "Worked with RWD Informaticists on UAT"; "Provided product demos, training & manuals";
  "Launched MVP to select RWD Informatics users, testing with synthetic data and then with
  Cerner's real-world data"; "Collected feedback, iterated on the product, and prepared for V1
  release"; "conducted thorough pre-launch testing (load, integration, beta)".
- Slide 25: monitoring with "GCP Cloud Log, BigQuery, and DataHub"; "Introduced NLP extraction
  from patient reports, metadata solution & ML powered anomaly detection".
- Slide 26: the lake → lakehouse move; "I'd document times where we saw performance drops and held
  meetings to discuss mitigation strategies & root cause analysis".
- Slide 27: the five-stage recap (Opportunity Identification → Viability & Planning → Development
  → Introduction → Ongoing Management); "Launched the MVP to a targeted user group, gathered
  feedback, and iterated to deliver a refined V1 product".

**The before-state (slides 13–14), quoted because the page's brief argues against it:** "The key
gap was the inconsistency in clinical RWD from different disparate sources, which impeded
effective machine learning training and data analysis"; RWD Analysts "rewrite ETL queries for new
each dataset"; ML Scientists "Wait for informaticists to complete manual ETL … Data always had
issues and they'd report back to RWD analysts to fix bugs"; External Partners "Not having the
resources to standardize the data … highly manual analysis"; concerns: "Management of sensitive
data / Lack of documentation for standardization procedures / Limited scalability and throughput
/ Excessive time spent on ETL processes instead of actual data analysis for cancer detection / No
version control, resulting in the need for bi-directional adjustments and manual corrections
between normalization steps"; "introduced data bugs with no traceability".

**What the data is (slides 6–7):** "RWD is information gathered from everyday healthcare settings,
such as: Doctor visits (Symptom reports, Side Effects..) / Hospital records (Medical History,
Medication Records..) / Wearable devices (Activity levels, Heart Rate..) / Claims & Billing Data
(Follow-ups, Visits, Procedure Codes..)"; slide 7's source column reads "Hospital Records / Bills &
Claims / Wearables / Other Sources" and "RWD is: Diverse & Inconsistent / Highly Complex /
Significantly Variable".

---

## Gaps — in the deck, absent from the page

The 2026-09-07 page had three blocks and, in substance, two sentences: the brief ("messy and
inconsistent from dozens of sources") and one line of what was built ("standardized all of it into
a single Common Data Model. Downstream research and models were built on that foundation"). The
deck holds, and the page said nothing about:

1. **The pipeline's stages and its pause-on-failure rule** (decision 1, slides 35–36) — and the
   deck's one real diagram, now on the page.
2. **Which model** (decision 2, slide 37: OMOP, its tables and vocabularies) and the CDM library
   with an API (slide 29).
3. **The metadata trail** (decision 3, DataHub at every stage) and the traceability gap it closed
   (slide 14).
4. **The real tech stack** (slide 38): Python with Pandas, Polars and SQLGlot, Flyte, GCP,
   BigQuery, DataHub, React. The old Stack row was three disciplines.
5. **How the product was run** (slides 17–27): KPIs before development, OKRs, MoSCoW/RICE, a PRD,
   JIRA epics named for the stages, quarterly story mapping, the agile ceremonies, UAT, synthetic
   data then real data, MVP → V1, monitoring, and the governance and HIPAA work.
6. **The four post-launch KPIs the deck records** (slide 30), which the old page did not print at
   all — the header lead said "taken from concept to production" and stopped.

All six shape the rewritten page. One claim on the old page gets no support and is cut: **"dozens
of sources"** (`PROJECT_DESCRIPTION`, `PROJECT_INTRO.statement`; the deck says "diverse sources &
formats" on slide 5, "different disparate sources" on slide 13, and names four source *types* on
slides 6–7; `grep -il dozen ppt/slides/*.xml ppt/notesSlides/*.xml` → 0). The same phrase is echoed
in five other files and `llms.txt` (Cross-page deltas 1–6). Everything else on the old page traces:
"messy and inconsistent" ← slide 7 "Diverse & Inconsistent"; "0-to-1" ← slide 3 "0 - 1, product
doesn't exist!"; "single Common Data Model" ← slide 5; "Early cancer detection" ← slides 5, 9, 14;
"Downstream research and models" ← slide 9; "taken from concept to production" ← slides 24, 25, 27
(MVP, V1 release, post-launch monitoring); "Hamad Gul led product management at Freenome" ←
slide 11 (Freenome), slide 32 ("as a PM"), the PRD/OKR/ceremony slides, and the site's standing
attribution ruling (see the header note).

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 2 — **an operationally stretched company with a real
production problem**, here the data-engineering version of it: a team whose analysts hand-write the
same transformation for every new dataset, whose modellers wait on them, and whose bugs cannot be
traced to the step that made them (slides 13–14). The reader is someone with a manual data process
feeding analysis or a model, in any regulated or messy-data domain, who has been told "just
standardise it" and knows how much work that word hides.

**The objection this page has to answer:** *"A deck is a deck. What did the thing actually do, and
what did running it as a product involve?"* Every decision above is an answer with a slide behind
it: the four stages and the pause rule; the named model and its vocabularies; the metadata store;
non-technical configuration; governance gates. And, because this is the site's one
product-management case study, the page shows the management record itself: KPIs set before
development, the prioritisation frameworks, the PRD, the epics, the A/B-tested library dispute, the
synthetic-then-real rollout.

**Secondary objection**, per §2: *"can they do this kind of work?"* — answered by the specificity,
and by the range `/work/` shows beside it (a clinical data pipeline next to a wine catalogue and a
routing solver).

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
situation — the sentence on slide 13, "rewrite ETL queries for new each dataset", turned into a
question.

**What the page must not do:** count the sources ("dozens" is nowhere in the deck); name the data
vendor (slide 24) or any institution beyond Freenome; print any patient-level or cohort figure
(none exists in the deck); claim a duration, a date, a price or a team size; say "we" about this
project (the standing ruling) or "I" (the site rule); claim any research result as ours — slide
30's model-accuracy figure is attributed to the ML teams' models; restate slide 12's third-party
survey figures (they are about the market, not this project); print "from 1 month to 1 week"
beside "60%" (Unverifiable 4); say anything about the pipeline's UI (no screenshot exists).

---

## Verifiable numbers

Each with the slide it sits on and the exact text. "Verifiable" here means *stated in the deck*;
none was re-measured (there is nothing to measure against) and each is printed only with the deck
as its stated source.

| Number | Slide | Exact text |
| --- | --- | --- |
| **60%** shorter turnaround | 30 | "60% decrease in TAT for RWD Normalization. From 1 month -> 1 week." — the page prints 60% and not the month→week pair (Unverifiable 4) |
| **40%** fewer data bugs | 30 | "40% less bugs reported by internal teams & external partners for data (based on completeness, accuracy, file formatting)" |
| **12%** model accuracy | 30 | "12% increase in ML Model Risk Prediction accuracy." — attributed on the page to the ML teams' models |
| **100%** adoption | 30 | "100% Adoption by RWD Analysts, no longer relying on manual methods." |
| **4** normalisation stages + post-processing, **7** listed steps | 35, 36 | the "Pipeline Data Flow" list; the diagram's four boxes inside "RWD Pipeline" |
| **3** example OMOP tables, **3** vocabularies | 37 | "Person, Drug Exposure, Measurement"; "SNOMED, LOINC, RxNorm" |
| **3** consumer groups | 9 | Internal Research Teams / Internal ML Teams / External Providers |
| **4** source types | 6, 7 | doctor visits, hospital records, wearable devices, claims & billing (6); Hospital Records / Bills & Claims / Wearables / Other Sources (7) |
| **6** teams/roles | 16 | RWD Informatics, Infrastructure Eng, RWD Engineering, Customer Success, Data Governance, TPM |
| **4** agile ceremonies | 22 | Daily standups, Backlog grooming, Sprint planning, Retrospectives |
| **3** JIRA epic groups | 21 | Data Ingestion; Syntactic & Semantic Normalization; Structural & Post Processing |
| **3** pre-launch test kinds | 24 | load, integration, beta |
| **3** later features | 25 | NLP extraction from patient reports, metadata solution, ML powered anomaly detection |
| **38** slides, **55** media files, **1** real diagram | deck | `ls ppt/slides/*.xml \| wc -l`; `ls ppt/media \| wc -l`; `image51.png` 2048x963 (sha256 `9208b3236e2ead922e1ec5a7fd7e6c694ae0a39f6a3fd4e902c8cbbafcc4a21b`) |

**Numbers deliberately NOT used on the page:** slide 12's **44% / 54% / 40%** ("Source: The
Inteliquet 2019 Real-World Data Survey" — a third party's market survey, not a fact about this
project; the only dated thing in the deck, and it dates the survey, not the work); "From 1 month ->
1 week" (Unverifiable 4); the deck's file date (it dates the export, not the engagement); every
count in the table above that is a count of slide bullets rather than a fact about the product
(teams, ceremonies, epics — the page names them, it does not count them).

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **When the work happened, and for how long.** No slide carries a year for the engagement; the
   deck's only date is the 2019 survey it cites on slide 12; the file was exported 2026-05-30. The
   page's header therefore keeps `location: "Product · 0-to-1"` with **no year**, as the previous
   page did and as the brief allows ("unless the deck gives no date"). Every other case study
   header reads `2026 · …`; if the user wants this one on the convention it needs their own record
   of the year. No timeline is printed (`.agents/product-marketing.md`, open question 1).
2. **Hamad's title.** Slide 32 says "as a PM"; slide 16's role card for the author's own seat is
   labelled **"TPM"** ("Drive the team to deliver impactful, high-quality work with a strong
   emphasis on optimizing the user experience"); the site's `/about/` says "product manager at
   Freenome". The page says "led product management" and the details row reads "Product
   management", which every PM slide supports; it does not print a job title.
3. **Who built what.** The deck credits development to "RWD Engineering" (slide 16, "Team
   responsible for developing the RWD Pipeline") and architecture to "the Tech Lead" with the
   author (slide 22). Nothing on the page says Hamad wrote code; the stack is printed as the
   pipeline's stack (slide 38, "Technology Used"), not as his.
4. **The 60% and the "1 month -> 1 week".** Slide 30 gives both for the same KPI. A month to a week
   is a reduction of roughly 75%, not 60%, so the two figures on the slide do not agree with each
   other. The page prints the headline **60%** only, as the deck's figure, and not the month→week
   pair; the user may prefer the reverse, or to drop the KPI. Nothing on the page derives one from
   the other.
5. **How the four KPIs were measured.** Slide 30 says "Product success was measured through KPI's
   and pre-defined success metrics" and gives the four figures with no baseline period, sample or
   method. The page prints them as "the figures the case-study deck records" and does not restate
   them as measured by us. The 12% model-accuracy figure is the ML teams' result on their own
   models and is attributed that way.
6. **The external data vendor** (slide 24). Real, named in the deck, not named on the page (header
   note). If the user wants it named, the sentence is in `PROJECT_RUN` ("real-world data from one
   external partner").
7. **What the React front end looked like.** Slide 38 lists it; no slide shows it. The page
   describes configuration by non-technical users (slide 29) and shows no UI.
8. **Freenome's "flagship cancer detection product"** (slide 11) and its accuracy. The deck's
   framing of why the work was funded; the page says only that early-cancer-detection research and
   ML teams consumed the model (slide 9), and attributes nothing about the product's accuracy to
   the pipeline beyond slide 30's figure, attributed to the models.
9. **The frozen cover.** `public/site/images/rwd-pipeline.jpg` (1200x750, committed 2026-09-04) is a
   designed schematic on the site's dark ground, marked "NEURAGUL LABS": five source cards (EHR
   HL7, LABS CSV, CLAIMS X12, GENOMICS VCF, REGISTRY JSON), a pipeline card (normalize,
   de-duplicate, map & harmonize, validate), a `Common Data Model` table (patient_id UUID …), and
   the caption "Diverse real-world data, standardized into one Common Data Model for
   early-detection research. 5 SOURCES → 1". Its stage names and its five formats are the
   illustrator's, not the deck's (slides 35–36 name syntactic / semantic / structural /
   post-processing, and slide 6 names four source *types*, no formats). It is an illustration of
   the idea, used on nine other pages with alts that call it "the real-world clinical data
   pipeline", and it is left alone: the deck's diagram is a light-green Lucidchart export at
   2.13:1 and is not "clearly the intended cover". Noted for the user; no delta.

---

## Shot list

**No runner captures and no `scripts/shots/rwd-pipeline.config.mjs`.** There is no route to
capture: the project has no UI and no site. `defineShots` (`scripts/shots/_schema.mjs`) throws
`at least one shot required` on an empty list, and `scripts/check-assets.mjs` imports every config
file that exists, so an empty config would fail the checker at import; the checker does not
require a config per slug (it only iterates the files present), and a slug with none passes
(`node scripts/check-assets.mjs` → `OK — 57 referenced assets verified` at `6971bb2`, before this
task; re-run after Stage A with the new image referenced). Assertions (1) existence, (4) declared
pixels and (5) non-empty alt still cover the one placed image.

**One image, from the deck, composed the way Task 10 composed app screenshots.**

| File | Source | Evidence for |
| --- | --- | --- |
| `public/site/images/rwd-pipeline-dataflow.jpg` (1600x1000, JPEG q90, 73,653 bytes) | slide 36, `ppt/media/image51.png` (2048x963, sha256 `9208b323…c4a21b`) | "It reads a dataset in memory from a landing bucket and runs it through four stages …" and "Each stage emits metadata to DataHub" — the diagram's own labels: `Data Landing Bucket`, `Read in memory`, `Synctactic Normalization`, `Semantic Normalization`, `Terminology Management System` (`Read` / `Write`), `Structural Normalization`, `Post Processing`, `BigQuery` (`Write`, `Read / Write`), `Emits Metadata after each normalization step`, `DataHub` |

**How it was composed** (`$SCRATCH/rwd-compose.mjs`, reproduced in `task-17-report.md` §4, run from
the NewNeura root with the repo's own `sharp` 0.35.3): the PNG scaled with Lanczos to 1520x715 (40px
side margins) and centred on a 1600x1000 ground of `rgb(10,10,10)`, the colour sampled at all four
corners of the frozen cover, placed at (40,143). Nothing inside the diagram is edited, cropped,
recoloured or redrawn; the diagram's own misspelling ("Synctactic") is left as it is. No other
image from the deck is used: the remaining 54 media files are stock illustrations, clip art, icon
glyphs, a third-party RWD-sources infographic (slide 6, `image26.png`), a five-segment recap ring
(slide 27, `image46.png`), the Freenome mark (slide 3, `image1.png`) and four vendor logos (slide
38); none proves a sentence and a client's or vendor's logo is not ours to place.

**The page, looked at** (the user's own `:3000`, `$SCRATCH/rwd-look.mjs`, viewport frames only,
`.preloader` detached first): 320 / 360 / 390 / 768 / 1440, every block in order, no horizontal
scroll (`scrollWidth` = viewport at all five), `main` innerText carries 0 first-person tokens, 0
"we" (the only "we" on the route is the nav's "How we work") and 0 "dozens". The header lead was
measured in the live slot with candidate strings swapped into it (`$SCRATCH/rwd-lead.mjs`): the
shipped 80 characters is four lines at 320 (h1 bottom 494 against the cover's 500), four at 360
(448) and three at 390 (417), overlap 0; a 94-character draft was five lines at 320 and ran 25 px
into the cover, and was cut. The old 56-character lead was three lines at 320 (463). The stack
tab prints slide 38's list; the details table renders six rows in three pairs.

**Frozen cover `rwd-pipeline.jpg`:** NOT re-captured, not touched (Unverifiable 9). Referenced by
`work/content.ts:256` (alt "The real-world clinical data pipeline"), `home/content.ts:189` ("The
real-world data pipeline case study"), `about/content.ts:174`, `process/content.ts:210` ("The
real-world clinical data pipeline"), `services/{data-intelligence:89,149,304;
applied-ai-strategy:179,317; applied-ai-models:177,287; applied-ai:154}/content.ts`, and this
page's header with `alt: ""`. Every alt stays true as a description of a schematic of the pipeline.

---

## Cross-page deltas

Consistency edits, none applied by this task. Each is `{file, anchor, replacement, reason}`;
anchors are exact current strings, each verified to occur exactly once in its file by `grep -cF`
(table at the end). One rule behind all six: **"dozens of sources" is stated nowhere in the deck**
(Gaps), so every echo is brought to what slides 5–7 say — diverse sources and formats, of four
named types.

1. `{file: "public/llms.txt", line: 34, anchor: "A 0-to-1 ETL pipeline pulling messy clinical data from dozens of sources into one common model. Early cancer detection research ran on top of it.", replacement: "A 0-to-1 ETL pipeline normalising real-world clinical data from hospital records, claims and wearables into one OMOP common data model on Google Cloud. Early cancer detection research ran on top of it.", reason: "'dozens of sources' is not in the deck; the replacement is the new PROJECT_DESCRIPTION's facts (slides 6, 37, 38). This line is also the anchor of hasina-hijama-cupping delta 1, whose replacement keeps the whole line and appends a Hasina line after it — apply that one first; this substring anchor still occurs exactly once afterwards, so the two compose in either order"}`
2. `{file: "src/components/site/about/content.ts", line: 135, anchor: "building a 0-to-1 ETL pipeline that pulled messy real-world clinical data from dozens of sources into a single common model.", replacement: "building a 0-to-1 ETL pipeline that normalised messy real-world clinical data from hospital records, claims and wearables into one common data model, OMOP.", reason: "the about page's Freenome paragraph carries the same count; slides 6 and 37 name the source types and the model. The rest of the sentence ('Early cancer detection research …') is untouched"}`
3. `{file: "src/components/site/services/applied-ai-strategy/content.ts", line: 238, anchor: "Real-world clinical data arrives messy and inconsistent from dozens of sources.", replacement: "Real-world clinical data arrives messy and inconsistent, in different formats from hospital records, claims and wearables.", reason: "same unsupported count in the AI-strategy page's project paragraph; slide 7 ('Diverse & Inconsistent', four source types)"}`
4. `{file: "src/components/site/services/data-intelligence/content.ts", line: 108, anchor: "leading a 0-to-1 ETL pipeline that pulled messy real-world clinical data from dozens of sources into a single Common Data Model.", replacement: "leading a 0-to-1 ETL pipeline that normalised messy real-world clinical data from hospital records, claims and wearables into one Common Data Model, OMOP.", reason: "the data-intelligence page's intro repeats the count; same evidence as delta 2 (slides 6, 37). The sentence that follows ('… the pipeline went from concept to production.') is untouched"}`
5. `{file: "src/components/site/services/data-intelligence/content.ts", line: 148, anchor: "At Freenome that meant messy real-world clinical data from dozens of sources standardized into a single Common Data Model", replacement: "At Freenome that meant messy real-world clinical data from hospital records, claims and wearables standardized into one Common Data Model, OMOP", reason: "the ETL service card's example sentence; same count, same evidence"}`
6. `{file: "src/components/site/services/data-intelligence/content.ts", line: 212, anchor: "standardized real-world clinical data from dozens of sources into one Common Data Model, taken from concept to production.", replacement: "standardized real-world clinical data from hospital records, claims and wearables into one OMOP Common Data Model, taken from MVP to V1.", reason: "the project-card lead on the same page; the count is cut, and 'MVP to V1' is the deck's own arc (slides 24, 27), matching this page's new header lead"}`

**Sweep accounting** (`grep -rn -i "rwd\|freenome\|cerner\|real-world data\|real-world-data\|common
data model\|early cancer\|cancer detection" src/ public/llms.txt .agents/ scripts/ docs/`, excluding
`work/rwd-pipeline/` and this dossier), every hit: `src/app/sitemap.ts:68` → the route, correct;
`home/content.ts:51` → a comment ("the Freenome pipeline" as an out-of-New-York project), correct;
`:189-190` → the home grid tile's cover and alt, correct; `work/content.ts:250-259` → the
`PORTFOLIO_PROJECTS` entry: `location: "Product · 0-to-1"` matches this page's header (Unverifiable
1), alt correct, no delta; `about/content.ts:11, :22, :126` → comments on the Freenome attribution
ruling, correct; `:135` → **delta 2**; `:155, :174` → the small media slot with the cover, correct;
`services/applied-ai-strategy/content.ts:179` → the cover in a media block, `:238` → **delta 3**,
`:312-317, :357` → the project card and its placement, correct; `services/applied-ai-models/
content.ts:177, :282-287, :324` → cover, card, placement, correct (no "dozens"); `services/
data-intelligence/content.ts:7, :14` → comments on the attribution, correct; `:89` → cover; `:108` →
**delta 4**; `:148` → **delta 5**; `:149` → the ETL card's cover with alt "The real-world clinical
data pipeline", correct; `:212` → **delta 6**; `:299-304, :350` → card and placement, correct;
`services/applied-ai/content.ts:149-154, :192` → card and placement, correct; `process/
content.ts:210` → the slider image, correct; `public/llms.txt:34` → **delta 1**;
`.agents/product-marketing.md:21, 66, 171` → the project listed among the ten, in segment 2, and in
the "read its own dossier" list, correct; `scripts/check-assets.mjs:202` → the frozen-cover
exemption, correct; `docs/research/case-studies/packship.md:442-443` and `hasina-hijama-cupping.md:
435` → other tasks' sweeps citing this page's old line numbers and the `llms.txt` line (delta 1
notes the composition), historical, not edited; `docs/superpowers/{specs,plans}/…` → this task's own
rows. No page prints a duration, a price, a headcount or a patient figure for this project
(`grep -rn -i "freenome\|rwd" src/ public/ | grep -iE "month|week|patients|cohort|team of"` → the
only hits are this page's own slide-30 sentence and the `/about/` biography, neither of which
prints a duration). "Cerner" occurs nowhere in `src/`, `public/` or `.agents/` (`grep -rn -i cerner
src/ public/ .agents/` → 0).

**Notes for the user (no anchor, nothing to apply):**

- **Header year** (Unverifiable 1): this is the one case study without `2026 ·` in its header and
  its `/work/` tile. The deck gives no date; only the user can.
- **The 60% vs month→week pair** (Unverifiable 4): the slide disagrees with itself; the page prints
  60%.
- **The data vendor's name** (Unverifiable 6): withheld on the page; one sentence to change if the
  user wants it named.
- **The frozen cover's invented specifics** (Unverifiable 9): five formats and four stage names that
  are not the deck's. It is a schematic and its alts call it a schematic; left alone.
- **Service filters.** The `PORTFOLIO_PROJECTS` entry lists `data-intelligence` only, while the
  cover and a project card also sit on `/services/applied-ai/`, `/services/applied-ai/strategy/`
  and `/services/applied-ai/models/`. Slide 25's "ML powered anomaly detection" and "NLP extraction
  from patient reports" and slide 9's ML consumers are what the deck offers as applied-AI evidence;
  whether that earns the filter is a `services`/`topServices` call for the orchestrator (Task 18's
  taxonomy list), not this task's.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `6971bb2` on 2026-09-11 with `grep -cF -- "<anchor>" <file>` and `grep -nF` for the line:

| Delta | File | Line | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `public/llms.txt` | 34 | substring `grep -cF` | 1 | yes |
| 2 | `src/components/site/about/content.ts` | 135 | substring `grep -cF` | 1 | yes |
| 3 | `src/components/site/services/applied-ai-strategy/content.ts` | 238 | substring `grep -cF` | 1 | yes |
| 4 | `src/components/site/services/data-intelligence/content.ts` | 108 | substring `grep -cF` | 1 | yes |
| 5 | `src/components/site/services/data-intelligence/content.ts` | 148 | substring `grep -cF` | 1 | yes |
| 6 | `src/components/site/services/data-intelligence/content.ts` | 212 | substring `grep -cF` | 1 | yes |

Re-run the same check before applying if the file has moved on.
