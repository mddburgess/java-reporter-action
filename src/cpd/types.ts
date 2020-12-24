export default interface CpdReport {
  duplications: CpdDuplication[];
}

export interface CpdDuplication {
  lines: number;
  tokens: number;
  files: CpdFile[];
}

export interface CpdFile {
  path: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
}
