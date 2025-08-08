import type React from "react";
import styles from "./Table.module.css";

type TableProps<T extends { [key: string]: unknown }> = {
  columns: { key: string; label: string }[];
  data: T[];
  renderRow: (item: T) => React.ReactNode[];
  rowClassName?: (item: T) => string;
  className?: string;
};

export default function Table<T extends { [key: string]: unknown }>({
  columns,
  data,
  renderRow,
  rowClassName,
  className = "",
}: TableProps<T>) {
  return (
    <table className={`${styles.table} ${className}`}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr
            key={String(item[columns[0].key as keyof T] ?? rowIndex)}
            className={rowClassName ? rowClassName(item) : ""}
          >
            {renderRow(item).map((cell, cellIndex) => (
              <td
                key={`${item[columns[0].key] ?? rowIndex}-${columns[cellIndex]?.key ?? cellIndex}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
