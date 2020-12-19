interface CpdReport {

    duplications: CpdDuplication[];
}

interface CpdDuplication {

    lines: number;
    tokens: number;
    files: CpdFile[];
}

interface CpdFile {

    path: string;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
}

export {
    CpdDuplication,
    CpdFile
};
export default CpdReport;
