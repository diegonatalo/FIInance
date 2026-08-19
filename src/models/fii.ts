export type FiiTipo = "papel" | "tijolo";

export type SegmentoPapel = "IPCA" | "CDI";

export type SegmentoTijolo =
  | "lajes"
  | "logística"
  | "shoppings"
  | "híbrido"
  | "outro";

export type Segmento = SegmentoPapel | SegmentoTijolo;

export type Fii = {
  id: string;
  ticker: string;
  tipo: FiiTipo;
  segmento: Segmento;
  cotas: number;
  precoMedio: number;
};

export const SEGMENTOS_PAPEL: SegmentoPapel[] = ["IPCA", "CDI"];

export const SEGMENTOS_TIJOLO: SegmentoTijolo[] = [
  "lajes",
  "logística",
  "shoppings",
  "híbrido",
  "outro",
];
