import { groupBy, join, map, reduce } from "lodash";

interface ColumnOptions<T> {
  header: string;
  justify: "left" | "center" | "right";
  value: (obj: T) => string;
}

interface TableOptions<T> {
  listBy: (obj: T) => string;
  reducer: (acc: T, curr: T) => T;
  columns: ColumnOptions<T>[];
}

enum Justify {
  left = ":-",
  center = ":-:",
  right = "-:",
}

export const configureTable =
  <T>(options: TableOptions<T>) =>
  (objects: T[]): string => {
    const dict = groupBy(objects, options.listBy);
    const dict2 = map(dict, (value) => values(reduce(value, options.reducer), options.columns));
    return join([headers(options.columns), justifiers(options.columns), ...dict2], "\n");
  };

const headers = <T>(columns: ColumnOptions<T>[]) =>
  `|${join(
    columns.map((column) => column.header),
    "|"
  )}|`;

const justifiers = <T>(columns: ColumnOptions<T>[]) =>
  `|${join(
    columns.map((column) => Justify[column.justify]),
    "|"
  )}|`;

const values = <T>(obj: T | undefined, columns: ColumnOptions<T>[]) => {
  if (obj === undefined) {
    return undefined;
  } else {
    return `|${join(
      columns.map((column) => column.value(obj)),
      "|"
    )}|`;
  }
};
