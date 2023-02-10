export interface SortChange {
    column: string;
    direction: SortChangeDirection;
}

export enum SortChangeDirection {
    ASC,
    DESC
}