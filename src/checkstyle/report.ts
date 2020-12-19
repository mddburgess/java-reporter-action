interface CheckstyleReport {

    violations: CheckstyleViolation[];
}

interface CheckstyleViolation {

    filePath: string,
    line: number;
    column: number;
    rule: string;
    severity: CheckstyleSeverity;
    message: string;
}

type CheckstyleSeverity =
    | 'error'
    | 'warning'
    | 'info';

export {
    CheckstyleViolation,
    CheckstyleSeverity
};
export default CheckstyleReport;
