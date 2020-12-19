interface PmdReport {

    violations: PmdViolation[];
}

interface PmdViolation {

    filePath: string;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
    ruleset: string;
    rule: string;
    priority: string;
    message: string;
}

export {
    PmdViolation
};
export default PmdReport;
