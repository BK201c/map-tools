import { XYZ } from "@/core/ol";

interface Source {}

export class XYZSource {
  private source = {};
  constructor(opt: any) {
    this.source = new XYZ(...opt);
  }
}
