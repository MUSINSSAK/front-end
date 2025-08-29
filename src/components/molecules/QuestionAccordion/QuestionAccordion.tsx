import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import styles from "./QuestionAccordion.module.css";

type Question = { question: string; answer: string };

type QuestionAccordionProps = {
  item: Question;
};

export default function QuestionAccordion({ item }: QuestionAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{item.question}</span>
        <span className={styles.icon}>
          {open ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>
      {open && <div className={styles.content}>{item.answer}</div>}
    </div>
  );
}
