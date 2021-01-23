export default interface SpotbugsReport {
  categories: Map<string, string>;
  bugs: SpotbugsBug[];
}

export interface SpotbugsBug {
  filePath: string;
  startLine: number;
  endLine: number;
  category: string;
  priority: number;
  shortMessage: string;
  longMessage: string;
}
