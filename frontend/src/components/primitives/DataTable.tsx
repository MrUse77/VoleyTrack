import type { Key, ReactNode } from "react";
import { numClasses } from "./Num";

export type DataTableColumn<Row extends object> = {
  header: ReactNode;
  key: keyof Row & string;
  /**
   * Overrides the numeric treatment for a column, in both directions.
   *
   * Omit it and the primitive decides: a measurement column after the row's primary
   * column, whose values are all numbers, gets the treatment the design gives `.num`.
   * Declare it when the value type cannot express the design's intent - `true` for a
   * formatted measurement or a text column the design marks `.num`, `false` for a numeric
   * column the design leaves aligned left.
   */
  numeric?: boolean;
  render?: (row: Row) => ReactNode;
  sortIndicator?: "ascending" | "descending";
};

type DataTableProps<Row extends object> = {
  columns: DataTableColumn<Row>[];
  getRowKey: (row: Row, index: number) => Key;
  rows: Row[];
  /**
   * Classes for the table's own box (`overflow-x-auto rounded-2xl border border-vt-border`).
   *
   * The design flattens that box whenever the table already sits inside a card: its
   * standings panel renders `.table-wrap` with `style="border:0;border-radius:0;
   * background:transparent"` inside the tournament card
   * (frontend/design/html/voleytrack-torneos.html), so the card's own border is the only
   * one painted. Appended after the defaults, so a caller can flatten without a fork.
   */
  wrapperClassName?: string;
};

const sortMetadata = {
  ascending: { ariaValue: "ascending", symbol: "↑" },
  descending: { ariaValue: "descending", symbol: "↓" },
} as const;

/**
 * Decides whether a column carries the design's `.num` treatment.
 *
 * The design decides this per column (`class="num"`), and its tables always use the first
 * column for the row's identity - `#`, Equipo, Jugador in all seven design tables that use
 * `.num` - which is never marked numeric and stays left, while the measurement columns
 * after it are marked `.num`. In the app those identity cells are `#`, Equipo, Jugador and
 * Estado, so the primitive reads the same intent from the data and from that position:
 * a column is numeric when it is not the row's primary column and every row's value for
 * its key is a `number`. A `render` column projects markup rather than the row value, so
 * its output type proves nothing and it must opt in explicitly. An explicit `numeric`
 * always wins in both directions, which is what a later screen slice needs for a formatted
 * measurement (`"16-6"`), for a text column the design marks `.num` (`Torneo`,
 * design/html/voleytrack-admin-ver-copa.html:97) or for a table that does lead with a
 * measurement.
 */
function isNumericColumn<Row extends object>(
  column: DataTableColumn<Row>,
  rows: Row[],
  index: number,
): boolean {
  if (column.numeric !== undefined) return column.numeric;
  if (index === 0) return false;
  if (column.render) return false;
  return rows.length > 0 && rows.every((row) => typeof row[column.key] === "number");
}

export function DataTable<Row extends object>({ columns, getRowKey, rows, wrapperClassName = "" }: DataTableProps<Row>) {
  const numericColumns = columns.map((column, index) => isNumericColumn(column, rows, index));

  return (
    <div className={`overflow-x-auto rounded-2xl border border-vt-border ${wrapperClassName}`.trim()}>
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-vt-panel text-vt-muted">
          <tr>
            {columns.map((column, index) => {
              const sort = column.sortIndicator ? sortMetadata[column.sortIndicator] : undefined;
              // Design source: voleytrack.css:96 gives every `th` `text-align:left`, and
              // the design right-aligns numeric headers explicitly with `.num`
              // (voleytrack-admin-jugadores.html:54).
              return (
                <th
                  aria-sort={sort?.ariaValue}
                  className={`px-4 py-3 font-semibold${numericColumns[index] ? ` ${numClasses}` : ""}`}
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
          {rows.map((row, rowIndex) => (
            <tr className="hover:bg-vt-surface" key={getRowKey(row, rowIndex)}>
              {columns.map((column, index) => (
                <td
                  className={`px-4 py-3${numericColumns[index] ? ` ${numClasses}` : ""}`}
                  key={column.key}
                >
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
