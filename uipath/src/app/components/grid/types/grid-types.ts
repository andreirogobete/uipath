export interface SortConfig {
    column: string;
    direction: SortConfigDirection;
}

export enum SortConfigDirection {
    ASC,
    DESC
}