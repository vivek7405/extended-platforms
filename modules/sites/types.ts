export type PlanProps = "free" | "pro" | "enterprise";

export interface SiteProps {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  usage: number;
  usageLimit: number;
  plan: PlanProps;
  stripeId?: string;
  billingCycleStart?: number;
  createdAt?: Date;

  domains?: {
    slug: string;
  }[];
  users?: {
    role: string;
  }[];
}
