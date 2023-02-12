import { SortConfigDirection } from "../types/grid-types";

export const sortData = (data: any[], propertyName: string, direction: SortConfigDirection) => {
    const dataClone = Array.from(data);

    if (direction === SortConfigDirection.ASC) {
        dataClone.sort((left: any, right: any) => ascDirectionSort(left, right, propertyName));
    } else {
        dataClone.sort((left: any, right: any) => descDirectionSort(left, right, propertyName));
    }

    return dataClone;
}

const ascDirectionSort = (left: any, right: any, propertyName: string) => {
    const leftPropertyValue = left[propertyName];
    const rightPropertyValue = right[propertyName];

    if (leftPropertyValue > rightPropertyValue) {
        return 1;
    }

    if (leftPropertyValue < rightPropertyValue) {
        return -1;
    }

    return 0;
};

const descDirectionSort = (left: any, right: any, propertyName: string) => {
    const leftPropertyValue = left[propertyName];
    const rightPropertyValue = right[propertyName];

    if (leftPropertyValue < rightPropertyValue) {
        return 1;
    }

    if (leftPropertyValue > rightPropertyValue) {
        return -1;
    }

    return 0;
};
