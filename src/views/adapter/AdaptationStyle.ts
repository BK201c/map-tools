interface V2 {
  isCompatibleEngine: true;
  projection: string;
  layers: {};
  scenes: {
    default: [];
  };
  kmapServerUrl: "";
}

interface V3 {
  configType: "three";
  "3d": {
    content: [];
  };
  "2d": {
    layers: {};
  };
}

export class style {
  static defaultPath: "@kedacom.com/kmap-server/local_map/";
  private layers: any[];
  private version: string;
  constructor(layers: [], version: string) {
    this.layers = layers;
    this.version = version;
  }

  buildStyle(version: string) {
    switch (version) {
      case "v2":
        break;
      case "v3":
        break;
      default:
        break;
    }
  }

  setMapProxy(ip?: string, mapName?: string) {
    this.layers.map((l) => {
      const url = new URL(l.url);
      l.url = `${ip}${url.pathname}${url.search}`;
    });
  }
}
