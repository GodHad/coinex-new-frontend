export type Exchange = {
  _id: string;
  name: string;
  logo: string;
  description: string;
  pros: string[];
  cons: string[];
  rating: number;
  currentPromo?: {
    title: string;
    description: string;
    expiry: string;
  };
  affiliateLink: string;
  enabled: boolean;
  tradingFee: string;
  leverage: string;
  minDeposit: string;
  assets: string;
};