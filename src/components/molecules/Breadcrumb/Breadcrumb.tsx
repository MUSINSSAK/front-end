import { ChevronRight } from "lucide-react";
import React from "react";
import styles from "./Breadcrumb.module.css";

type BreadcrumbProps = {
  path: string[];
};

export default function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <nav className={styles.list} aria-label="breadcrumb">
          <a href={`/`} className={styles.link}>
            홈
          </a>
          <ChevronRight size={15} className={styles.icon} />

          {path.map((segment, index) => (
            <React.Fragment key={segment}>
              {index > 0 && <ChevronRight size={15} className={styles.icon} />}
              <a href={`/category/${segment}`} className={styles.link}>
                {segment}
              </a>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}
