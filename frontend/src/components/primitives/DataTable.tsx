import type { Key, ReactNode } from "react";

export type DataTableColumn<Row extends object> = {
  header: ReactNode;
  key: keyof Row & string;
  render?: (row: Row) => ReactNode;
  sortIndicator?: "ascending" | "descending";
};

type DataTableProps<Row extends object> = {
  columns: DataTableColumn<Row>[];
  getRowKey: (row: Row, index: number) => Key;
  rows: Row[];
};

const sortMetadata = {
  ascending: { ariaValue: "ascending", symbol: "↑" },
  descending: { ariaValue: "descending", symbol: "↓" },
} as const;

export function DataTable<Row extends object>({ columns, getRowKey, rows }: DataTableProps<Row>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-vt-border">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-vt-panel text-vt-muted">
          <tr>
            {columns.map((column) => {
              const sort = column.sortIndicator ? sortMetadata[column.sortIndicator] : undefined;

              return (
                <th
                  aria-sort={sort?.ariaValue}
                  className="px-4 py-3 font-semibold"
                  key={column.key}
                  scope="col"
                >
                  {column.header}{sort ? ` ${sort.symbol}` : ""}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-vt-border bg-vt-raised text-vt-text">
          {rows.map((row, index) => (
            <tr className="hover:bg-vt-surface" key={getRowKey(row, index)}>
              {columns.map((column) => (
                <td className="px-4 py-3" key={column.key}>
                  {column.render ? column.render(row) : row[column.key] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
