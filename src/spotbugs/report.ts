interface SpotbugsReport {

    categories: Map<string, string>;
    bugs: SpotbugsBug[];
}

interface SpotbugsBug {

    filePath: string;
    startLine: number;
    endLine: number;
    category: string;
    priority: number;
    shortMessage: string;
    longMessage: string;
}

export {
    SpotbugsBug
};
export default SpotbugsReport;
