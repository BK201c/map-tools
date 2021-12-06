export interface LayerSource {
  layer: string;
  url: string;
  serviceType: string;
  projection: string;
  tileGrid?: {
    resolutions?: number[];
    matrixIds?: number[];
    origin?: number[];
  };
}

export interface Form {
  url: string;
  center: number[];
  projection: string;
  serviceType: string;
}
