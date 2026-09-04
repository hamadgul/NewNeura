/**
 * "Selected work" — the two mirrored project-tile rows on the homepage. Holds
 * no state of its own (the scroll reveal and hover live in `ImageCard`), so
 * this stays a server component.
 */
import { ButtonArrow } from "@/components/site/shared/buttons";
import {
  PORTFOLIO_FILTERS,
  PROJECTS_ROW_ONE,
  PROJECTS_ROW_TWO,
} from "./content";
import { StickyCompanion } from "@/components/site/shared/StickyCompanion";
import { ImageCard } from "./ImageCard";

export function BlockProjectsHighlight() {
  return (
    <section className="blockProjectsHighlight ng-grid my-[100px] text-[#111111]">
      <header className="blockProjectsHighlight__header col-start-2 col-end-[-2] mb-[25px] grid grid-cols-subgrid border-b border-[rgb(214,214,214)] pb-[10px] md:pb-[17.5px]">
        {/* `1 / -4` only holds from 768 up, where four columns are left over
            for the button. Below that the title takes the full width and the
            button drops to its own row under it, with the rule the source
            draws between them. */}
        <h2 className="font-L col-span-full row-start-1 text-[#111111] md:col-start-1 md:col-end-[-4]">
          Selected work
        </h2>
        <div className="highlightedButton col-span-full row-start-2 mt-[15px] mb-[10px] flex items-center self-end border-b border-[rgb(214,214,214)] pb-[20px] md:col-auto md:row-start-1 md:mt-0 md:mb-0 md:border-b-0 md:pb-0 md:justify-self-end">
          <ButtonArrow title="All projects" href="/work/" />
        </div>

        <div className="portfolioFilter col-span-full row-start-3 flex flex-col items-start gap-[10px] md:row-start-2 md:mt-[25px] md:flex-row md:items-center md:justify-end md:gap-[30px]">
          <div className="portfolioFilter__title whitespace-nowrap text-[#111111]">
            Filter by what we built
          </div>
          {/*
            Below 768px this stays a horizontal scroller, which is the source's
            behaviour and the right affordance on a phone: the label sits on its
            own line above it and the five pills swipe. Two things make it read
            as one. It is full-bled (`50% - 50vw` out, the same distance back in
            as padding) so the row runs off the screen edge instead of being
            cut 25px short of it — a label chopped inside the gutter reads as
            broken text, the same label chopped at the edge reads as "there is
            more over there". And the bar is hidden, as it is on every other
            scroller here (CollectionProjects, BlockImageSlider,
            BlockProcessCardSlider): platforms with classic scrollbars were
            drawing a 15px track across the row and shoving the header rule
            down with it.

            From 768px it must WRAP instead. The row needs 797px of content —
            our service names are long ("Cloud & Infrastructure", "Data
            Intelligence") where the layout was measured against one-word
            markets — and between 768px and ~1100px the wrapper only gets
            535-767px after the 143px label. It was clipping "Data
            Intelligence" mid-word behind a scrollbar, which at a 30px overflow
            reads as a broken row rather than as something you can scroll.
            `min-w-0` stays: it is what lets the wrapper shrink to the space
            available so the inner row knows where to break.
          */}
          <div className="portfolioFilter__wrapperOverflow mx-[calc(50%-50vw)] w-screen min-w-0 overflow-x-auto px-[calc(50vw-50%)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:w-auto md:overflow-x-visible md:px-0">
            {/* A scroller's padding-right is not part of its scrollable width, so
              at the end of the swipe "Data Intelligence" sat flush against the
              screen edge. This spacer rides inside the scrolled row, where its
              width does count. */}
            <div className="portfolioFilter__itemWrapper flex gap-x-[30px] gap-y-[10px] after:block after:w-[25px] after:shrink-0 after:content-[''] md:flex-wrap md:justify-end md:after:hidden">
              {PORTFOLIO_FILTERS.map((filter) => (
                <a
                  key={filter.label}
                  href={filter.href}
                  className="portfolioFilter__item group relative flex shrink-0 items-baseline gap-[4px] whitespace-nowrap text-[#111111]"
                >
                  <span className="relative">
                    {filter.label}
                    {/* Underline wipe: two stacked bars relayed the same way as ButtonArrow/ButtonLine. */}
                    <span className="pointer-events-none absolute inset-x-0 -bottom-[2px] h-px overflow-hidden">
                      <span className="absolute h-px w-full bg-[#111111] transition-transform duration-300 group-hover:translate-x-[105%]" />
                      <span className="absolute h-px w-full -translate-x-[105%] bg-[#111111] transition-transform delay-300 duration-300 group-hover:translate-x-0" />
                    </span>
                  </span>
                  <span className="font-XS text-[rgb(116,116,116)]">
                    {filter.count}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="blockProjectsHighlight__layout blockProjectsHighlight__layoutOne col-start-2 col-end-[-2] grid grid-cols-subgrid gap-y-[10px] pb-[50px] md:gap-y-[20px]">
        <ImageCard
          project={PROJECTS_ROW_ONE[0]}
          className="col-span-full md:col-span-10"
        />
        <div className="blockProjectsHighlight__smallImagesWrapper col-span-full flex flex-col gap-[50px] md:col-span-10 md:flex-row md:gap-[10px]">
          {/* The lag that makes this column slide against the large card as
              the row goes by — the same pin the /work grid uses. See
              StickyCompanion. */}
          <StickyCompanion>
            <ImageCard project={PROJECTS_ROW_ONE[1]} />
          </StickyCompanion>
          <StickyCompanion>
            <ImageCard project={PROJECTS_ROW_ONE[2]} />
          </StickyCompanion>
        </div>
      </div>

      {/* Row two mirrors row one: small-card wrapper first, large card second. */}
      <div className="blockProjectsHighlight__layout blockProjectsHighlight__layoutTwo col-start-2 col-end-[-2] grid grid-cols-subgrid gap-y-[10px] md:gap-y-[20px]">
        <div className="blockProjectsHighlight__smallImagesWrapper col-span-full order-2 flex flex-col gap-[50px] md:order-1 md:col-span-10 md:flex-row md:gap-[10px]">
          <StickyCompanion>
            <ImageCard project={PROJECTS_ROW_TWO[0]} />
          </StickyCompanion>
          <StickyCompanion>
            <ImageCard project={PROJECTS_ROW_TWO[1]} />
          </StickyCompanion>
        </div>
        <ImageCard
          project={PROJECTS_ROW_TWO[2]}
          className="col-span-full order-1 md:order-2 md:col-span-10"
        />
      </div>
    </section>
  );
}
