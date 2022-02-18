type version = "v2" | "v3";

interface CTStyle {
  isCompatibleEngine: true;
  projection: string;
  layers: {};
  scenes: {
    default: [];
  };
  kmapServerUrl: "";
}

interface KgisStyle {
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
  layers: any[];
  constructor(layers: []) {
    this.layers = layers;
  }
  buildStyle(): CTStyle;
  buildStyle(): KgisStyle;
  buildStyle(): any {}

  setMapProxy(ip?: string, mapName?: string) {
    this.layers.map((l) => {
      const url = new URL(l.url);
      l.url = `${ip}${url.pathname}${url.search}`;
    });
  }
}

// abstract class AdaptationStyle {
//   layers: [];
//   constructor(layers: []) {
//     this.layers = layers;
//   }

//   abstract buildStyle(): any;

//   abstract setMapProxy(): any;
// }

// export class AdaptationStyleV2 extends AdaptationStyle {
//   static defaultPath: "@kedacom.com/kmap-server/local_map/";
//   setMapProxy(): CTStyle {
//     throw new Error("Method not implemented.");
//   }
//   buildStyle(): CTStyle {
//     throw new Error("Method not implemented.");
//   }
//   buildScenes(): CTStyle {
//     throw new Error("Method not implemented.");
//   }
// }

// export class AdaptationStyleV3 extends AdaptationStyle {
//   static defaultPath: "@kedacom.com/kmap-server-engine/local_map/";
//   setMapProxy(): KgisStyle {
//     throw new Error("Method not implemented.");
//   }
//   buildStyle(): KgisStyle {
//     throw new Error("Method not implemented.");
//   }
// }
