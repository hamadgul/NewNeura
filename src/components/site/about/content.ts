/**
 * Content for `/about/`.
 *
 * Copy is adapted from the NeuraGul source site — the `about_lead` / `about_1..4`
 * keys of the HOME dict in `pages/content.py`, which is what the source's
 * `#about` section renders.
 *
 * VOICE — the source is written in the first person singular because it was
 * written by one person. It is a team, so this page says "we". Hamad Gul is
 * named twice and only twice: at the "who you'd be working with" beat, where a
 * person rather than a company is the point, and in the Freenome paragraph,
 * which is his own history and therefore stays in the third person attributed
 * to him. Nothing here claims a headcount, a capacity or a team size — the page
 * stands on what is checkable instead: you always know who is on your project,
 * and the same people are still reachable six months after launch.
 *
 * The source's other voice rules still hold: no "X, not Y" antithesis, at most
 * three em dashes, a checkable number wherever one exists.
 *
 * The five paragraphs are split across three blocks rather than dumped into one:
 * the header carries the one-line introduction, `BlockIntroDouble` carries the
 * lead plus the Freenome paragraph, and `BlockWysiwyg` carries the remaining
 * three. That is the same distribution the source uses (`ng-lead`, then a
 * three-paragraph `ng-prose`, then a closing `ng-margin` line), only mapped onto
 * this layout's blocks.
 *
 * Image paths are the real screenshots under `/site/images`; `width`/`height`
 * are the assets' true pixel sizes, because `next/image` sets the reserved
 * aspect ratio from them. Every asset here is landscape; the header and the
 * media block both crop with `object-cover`, so the shape holds.
 *
 * ── What is deliberately absent ─────────────────────────────────────────────
 * The team grid. The layout this page is adapted from closed with a 38-face
 * `CollectionTeam`. There are no photographs of the people here to put in it,
 * and a grid padded out to fill the row would be decoration standing in for
 * content, so that block is gone from the route and from the repo. The honest
 * compensation is the fuller `BlockWysiwyg` body below.
 */
import type { BlockHeaderGeneralProps } from "@/components/site/shared/blocks/BlockHeaderGeneral";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";

const IMG = "/site/images";

export const META = {
  /**
   * Plain stem: the root layout's "%s — NeuraGul" template adds the suffix.
   *
   * The bare word "About" ranked for nothing and told a searcher nothing. This
   * stem names the category and the city, which is what an "about" page is
   * actually competing on, and still reads as the page it labels. 55 characters
   * with the suffix.
   */
  title: "About Our New York Software Development Team",
  canonical: "/about/",
  description:
    "Meet the New York developers, designers and engineers behind NeuraGul. Hamad Gul is your point of contact and one of the developers who writes your code.",
} as const;

/**
 * Header.
 *
 * `intro` is the source's own second lede line, minus its "That's the job."
 * lead-in and re-voiced for a team — the sentence that says who is behind the
 * site, which is exactly what this row is for. The source's version of it
 * ("I keep a handful of projects going at a time") ended on a capacity claim
 * and that half is dropped rather than restated with a bigger number.
 *
 * The right column is cropped with `object-cover` into a ~715×720 box at
 * 1280+, so a 16:9 frame loses its sides — pick images whose subject survives
 * a centre crop to near-square. The notched highlight is a real project
 * screenshot and its caption is the label the source prints over this section.
 *
 * No `buttonHref`: the circle is a scroll affordance with no destination, the
 * same as every other instance of this block.
 */
export const ABOUT_HEADER: BlockHeaderGeneralProps = {
  title: "About",
  intro:
    "We're a team of developers, designers and engineers, we work out of New York, and we build the software our clients run their day on.",
  // Was `packship.jpg` captioned "Who you'd be working with" — a phone
  // screenshot answering a question about a person. The routing platform is
  // the closest this site has to a picture of the work itself, and the caption
  // now says what the image actually shows.
  //
  // The full `delivery-routing.jpg` dashboard does not survive this slot: the
  // block renders it 193px wide, and at that size a white-chrome screenshot on
  // the header's #ececec ground has no visible edge and no legible content —
  // it read as a blank rectangle floating in the grey. `-map.jpg` is the map
  // panel of that same capture, cropped 1.6:1, so the six colour-coded driver
  // routes are the whole image and the caption describes what you can see.
  highlightImage: {
    src: `${IMG}/delivery-routing-map.jpg`,
    alt: "",
    width: 1008,
    height: 630,
  },
  highlightCaption: "Six vans, planned every morning",
  // Was `hero-poster.jpg` — stock "futuristic data centre" material: neon
  // tubes, a blurred figure, and overlaid glyphs that are not real text. It is
  // the loudest thing above the fold on a page about who we are, it looks
  // nothing like the photography on /process/ or /contact/, and it makes a
  // claim about a room that does not exist. This is frame 180 of `office.mp4`
  // — the same building /process/ and /contact/ already show, a different
  // shot of it (stairwell and window wall, no people), so the two pages read
  // as one place without repeating a frame.
  image: {
    src: `${IMG}/about-studio.jpg`,
    alt: "",
    width: 1920,
    height: 1080,
  },
};

/**
 * Intro. One static caption, not the tabbed variant — hence a single-entry
 * `labels` array, which keeps the block in its muted non-tabbed rendering.
 *
 * `statement` is the `about_lead` slot. The source's line was "NeuraGul is me,
 * plus the people I bring in"; under this label the honest team version of that
 * sentence is the one that answers the label's question, so this is the About
 * page's Hamad beat and the only place on the route his role is spelled out.
 *
 * `body` is `about_1`, moved into the third person and attributed by name: the
 * Freenome pipeline is Hamad's own biography, so it cannot be told as a team
 * "we". One string in the array, so the block renders a single paragraph rather
 * than splitting a run at a sentence boundary the source does not break at.
 */
export const ABOUT_INTRO: BlockIntroDoubleProps = {
  labels: ["Who you'd be working with"],
  statement:
    "Hamad Gul is your primary point of contact and one of the developers on your project.",
  body: [
    "Before NeuraGul, Hamad was a product manager at Freenome, building a 0-to-1 ETL pipeline that pulled messy real-world clinical data from dozens of sources into a single common model. Early cancer detection research ran on top of it.",
  ],
};

/**
 * Media pair.
 *
 * The large slot held `office.mp4` — the same loft footage as the homepage,
 * whose poster frame is a concrete ceiling and a "CYCLOPS 5 TON CRANE" sign.
 * Two problems once the header stopped being stock: the header is now a frame
 * of that same building, so the page showed the loft twice and the work once;
 * and a crane sign says nothing on a page whose next paragraph names three
 * specific projects. It is `vintus.jpg` instead — the wine importer's
 * storefront, which the `BlockWysiwyg` copy directly below names. With the
 * header's routing map and the small slot's pipeline, the page's four images
 * are now one real place and three different real projects, none repeated.
 *
 * That leaves no `<video>` on this route; `office.mp4` still runs on the
 * homepage, which is where the room is worth showing in motion.
 *
 * The small slot is the real-world data pipeline screenshot, which is the
 * project the paragraph directly above it describes.
 *
 * `quote` is a sentence from `about_3`, hoisted into the pull-quote column. It
 * is the site's own copy rather than a testimonial — nobody is being quoted who
 * did not write it. The source's line here was "I stay small on purpose, which
 * is how I'm still the one who picks up the phone"; that is a claim about size,
 * so it is gone and what replaces it is the part that is checkable.
 */
export const ABOUT_MEDIA: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMG}/vintus.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
  small: {
    type: "image",
    src: `${IMG}/rwd-pipeline.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
  quote: "You'll always know who is on your project, and you'll be talking to them directly.",
};

/**
 * Rich-text body — `about_2`, `about_3` and `about_4`, in source order.
 *
 * `about_2` is the source's paragraph with its verbs moved to "we"; every
 * project it names is unchanged. `about_3` was written about a soloist calling
 * in contractors, and that framing does not survive being a team, so it is
 * rewritten as how people are put on a project — the one clause kept from it is
 * "you'll always know who is on it", which is the part that is a promise rather
 * than a description of headcount. `about_4` was two capacity claims back to
 * back ("one person who holds the whole system", "the wrong fit if you need a
 * team of eight starting Monday"). Both are deleted rather than inverted into a
 * boast about being bigger; what stands in their place is the only thing here
 * anyone can hold us to.
 *
 * Three `paragraph` nodes rather than one long string, so the block's `p + p`
 * 15px rhythm reproduces the source's paragraph breaks.
 *
 * `tagline` and `title` were both absent, on the reasoning that the bare shape
 * — empty first grid row, then one wide text column — is what the block ships
 * on an about page. On this route that shape failed: `__content` starts at
 * column 8 (x=455 at 1440), so with no title beside it the closing section was
 * 200px of 16px body copy indented into the right two-thirds with 455px of
 * empty white to its left and no rule above it, arriving straight after the
 * media block's own white. It read as a fragment of a page rather than the end
 * of one. The tagline supplies the top rule the section had no edge without,
 * and the title fills the column the block reserves for it at `md:col-end-[6]`.
 *
 * This is also where the deleted team grid's weight went. The source's `#about`
 * runs to five paragraphs; the header and the intro take two, and the remaining
 * three land here, which is what keeps the route from ending on a stub.
 */
export const ABOUT_WYSIWYG: BlockWysiwygProps = {
  tagline: "In practice",
  title: "What we build, and who builds it.",
  body: [
    {
      type: "paragraph",
      text: "These days we mostly build operational software. The dispatch app that plans those six vans. An ordering portal that lets a pizzeria skip delivery-app commissions. A wine importer's storefront. We also build the marketing sites that sell that kind of work, because most of our clients need both.",
    },
    {
      type: "paragraph",
      text: "A project gets the people the work asks for: a designer, a second engineer, someone who knows the stack it runs on better than the rest of us. You'll always know who is on it. They're the ones you talk to while it's being built.",
    },
    {
      type: "paragraph",
      text: "Whoever writes your scope is one of the people who builds it. Six months after launch, that is still the person who answers when something breaks.",
    },
  ],
};
