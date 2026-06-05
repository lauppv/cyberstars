// Shapes of the static almanac JSON served from /almanac/* (generated from the
// authoring data; see public/almanac/). Consumed by the client only.

export interface AlmanacArticle {
  slug: string;
  cat: string;
  tag: string;
  title: string;
  excerpt: string;
  fullText: string;
  author: string;
  readTime: string;
  emoji: string;
  grad?: string;
  year?: string;
  catLabel?: string;
  authorEm?: string;
  authorEmoji?: string;
  date?: string;
  isHero?: boolean;
}

// A card in index.json — everything an article has except the heavy body.
export type AlmanacCard = Omit<AlmanacArticle, 'fullText'>;

interface FunFact {
  em: string;
  text: string;
  src: string;
}

interface Quote {
  text: string;
  author: string;
  context?: string;
}

interface TimelineItem {
  emoji: string;
  year: string;
  title: string;
  text: string;
  tag: string;
}

export interface AlmanacExtras {
  funFacts: FunFact[];
  quotes: Quote[];
  timeline: TimelineItem[];
}
