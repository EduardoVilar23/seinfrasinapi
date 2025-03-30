import { PrecoItem } from "./PrecoItem";

export type PrecoItemResponse = {
    items: PrecoItem[],
    total: number;
  };