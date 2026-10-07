import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { GamePrice } from "@/components/games/Price";
import { QuickAdd } from "@/components/games/QuickAdd";
import { ButtonLink } from "@/components/ui/Button";
import { Corners, Diamond } from "@/components/ui/Ornaments";
import { genreLabel, platformShort, SITE_NAME } from "@/lib/catalog";
import { formatRating } from "@/lib/format";
import { getHeroGames } from "@/lib/games";
import { getI18n } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/localized-text";
import { gameOffers } from "@/lib/offers";
import { purchaseOptions } from "@/lib/purchase";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

/** The first sentence of a description (at most ~190 characters), for the hero's short text. */
function lead(text: string | undefined): string | null {
  const first = text?.split("\n").find((p) => p.trim())?.trim();
  if (!first) return null;
  const sentence = first.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? first;
  return sentence.length <= 190 ? sentence : `${sentence.slice(0, 187).replace(/\s+\S*$/, "")}…`;
}

/**
 * The home page's first screen: the store's featured games (marked "Featured" in the admin), one at a
 * time, each with its artwork, rating, genres, platforms, price, "Buy now" (the same cart line as
 * anywhere else, then the cart) and a link to the game. The vault's frame, crest and emblem stay around
 * it. Rendered here on the server; HeroCarousel only switches slides.
 */
export async function Hero() {
  const [{ locale, t }, games] = await Promise.all([getI18n(), getHeroGames()]);
  const h = t.hero;
  const slides: HeroSlide[] = games.map((game, i) => {
    const offers = gameOffers(game);
    const art = game.cardImage ?? game.screenshots[0] ?? game.coverImage;
    const text = lead(pickLocalized(game.description, locale)?.text);
    const platforms = [...new Set(offers.map((o) => platformShort(o.platform)))];
    return {
      key: game.slug,
      art: (
        // Phones: the artwork is a band across the top (its logo whole, not cropped by a tall narrow
        // frame) fading into the dark ground the copy sits on, so the label never lands on the logo.
        <div key="art" aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[19rem] sm:inset-0 sm:h-auto">
          <Image src={art} alt="" fill priority={i === 0} sizes="(min-width: 1536px) 1500px, 100vw" className="object-cover object-[50%_35%] saturate-[0.9] sm:object-[70%_30%]" />
          {/* Legibility, not decoration: the copy side darkens (bottom on phones and tablets, left from lg). */}
          <div
            className="absolute inset-0 bg-[linear-gradient(0deg,rgb(10_9_7)_0%,rgb(10_9_7/0.88)_40%,rgb(10_9_7/0.45)_68%,rgb(10_9_7/0.08)_100%)] sm:bg-[linear-gradient(0deg,rgb(10_9_7/0.96)_0%,rgb(10_9_7/0.82)_45%,rgb(10_9_7/0.25)_100%)] lg:bg-[linear-gradient(90deg,rgb(10_9_7/0.94)_0%,rgb(10_9_7/0.8)_38%,rgb(10_9_7/0.2)_72%,rgb(10_9_7/0.05)_100%)]"
          />
        </div>
      ),
      content: (
        <div key="content" className="relative flex h-full flex-col justify-end px-6 pt-12 pb-24 sm:px-10 lg:justify-center lg:px-16 lg:pb-20">
          <div className="max-w-xl">
            <p className="flex items-center gap-2.5 font-display-ui text-[0.62rem] tracking-[0.3em] text-gold-light">
              <Diamond className="size-1.5 bg-gold-light" />
              {/* Phones: the label alone (the store's name is in the header right above). */}
              <span className="hidden whitespace-nowrap sm:inline">{SITE_NAME}</span>
              <span aria-hidden className="hidden h-px w-6 bg-gold-dark sm:inline-block" />
              <span className="whitespace-nowrap">{h.featured}</span>
            </p>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.05] font-semibold tracking-[0.06em] text-parchment uppercase sm:text-5xl lg:text-[3.4rem]">{game.title}</h2>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-parchment-muted sm:text-base">
              {game.rating !== null && (
                <span className="flex items-center gap-1.5 text-gold-light">
                  <Star aria-hidden className="size-4 fill-current" />
                  <span className="sr-only">{t.game.ratingPrefix}</span>
                  {formatRating(game.rating)}
                </span>
              )}
              <span>{game.genres.map((g) => genreLabel(t.genres, g)).join(" / ")}</span>
              <span aria-hidden className="hidden text-bronze sm:inline">
                ◆
              </span>
              <span className="basis-full tracking-[0.08em] sm:basis-auto">
                <span className="sr-only">{t.game.platforms}: </span>
                {platforms.join(" · ")}
              </span>
            </p>
            {text && <p className="mt-4 line-clamp-2 max-w-lg sm:line-clamp-3 text-base leading-relaxed text-parchment/90 sm:text-lg">{text}</p>}
            <div className="mt-6">
              <GamePrice game={game} showPercent className="gap-1.5 font-display text-3xl sm:text-4xl" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="sm:w-56">
                <QuickAdd game={{ slug: game.slug, title: game.title, coverImage: game.coverImage }} offers={purchaseOptions(game)} buyNow variant="primary" size="md" />
              </div>
              <ButtonLink href={`/produse/${game.slug}`} variant="glass" className="sm:w-56">
                {h.viewGame}
                <ArrowRight aria-hidden className="size-3.5" />
              </ButtonLink>
            </div>
          </div>
        </div>
      ),
    };
  });

  return (
    <section aria-labelledby="hero-title" className="relative isolate h-[44rem] border border-gold-dark bg-[#0a0907] glow-gold-strong sm:h-[40rem] lg:h-[38rem] 2xl:h-[42rem]">
      {/* The page's heading: the store and its motto (each game below has its own). */}
      <h1 id="hero-title" className="sr-only">
        {SITE_NAME}: {t.hero.title.join(" ")}
      </h1>
      <div className="absolute inset-0 overflow-hidden">
        <HeroCarousel slides={slides} />
      </div>

      {/* Double frame: the gold outer edge plus a fainter inner line set 6px inside it. */}
      <span aria-hidden className="pointer-events-none absolute inset-1.5 z-[3] border border-gold-light/35" />
      <Corners size="lg" />

      {/* Top-centre crest: a diamond with flourishes riding the frame. */}
      <span aria-hidden className="absolute -top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        <span className="h-px w-10 bg-gold-light" />
        <Diamond className="size-1.5 bg-gold-light" />
        <Diamond className="size-3.5 border border-gold-light bg-base" />
        <Diamond className="size-1.5 bg-gold-light" />
        <span className="h-px w-10 bg-gold-light" />
      </span>
      {/* Mid-left stud on the frame. */}
      <Diamond className="absolute top-1/2 -left-[6px] z-10 hidden size-2.5 -translate-y-1/2 border border-gold-light bg-base sm:block" />
      {/* Bottom-centre clasp: the brand emblem set into the frame. */}
      <span aria-hidden className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2">
        <Image src="/images/logo-tv.png" alt="" width={262} height={320} unoptimized className="h-10 w-auto" />
      </span>
    </section>
  );
}
