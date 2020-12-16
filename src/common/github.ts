export interface Annotation {
    path: string,
    start_line: number,
    end_line: number,
    start_column?: number,
    end_column?: number,
    annotation_level: AnnotationLevel,
    title?: string,
    message: string,
    raw_details?: string
}

export type AnnotationLevel =
    | 'notice'
    | 'warning'
    | 'failure';
