export interface RamenEntry {
  id: string;
  shopName: string;
  ramenName: string;
  imageFile: string;
  date: string;
  location?: string;
  rating?: number;
  memo?: string;
  ramenType?: string;
  noodleThickness?: string;
  toppings?: string;
  highlights?: string;
  createdAt: number;
}
