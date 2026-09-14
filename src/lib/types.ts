export type ProjectStatus = "idea" | "wip" | "shipped";
export type PriceBand = 1 | 5 | 9;

export interface IdeaInput {
  idea: string;
  audience?: string;
  status: ProjectStatus;
  priceBand: PriceBand;
}

export interface OfferPack {
  offerName: string;
  promise: string;
  deliverables: string[];
  price: PriceBand;
  priceWhy: string;
  salesBlurb: string;
  twitterPost: string;
  communityPost: string;
  gumroadDescription: string;
  launchChecklist: string[];
  generatedAt: string;
  seed: string;
}

export interface GenerateResult {
  pack: OfferPack;
  unlocked: boolean;
}
