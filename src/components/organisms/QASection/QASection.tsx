import { Button, Tag } from "../../atoms";
import styles from "./QASection.module.css";

type QA = {
  id: string;
  status: "답변완료" | "답변대기";
  author: string;
  date: string;
  question: string;
  answer?: { date: string; content: string };
};

type Props = { list: QA[] };

export default function QASection({ list }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>상품 문의 ({list.length})</h3>
        <Button variant="active" className={styles.askButton}>
          문의하기
        </Button>
      </div>

      <div className={styles.list}>
        {list.map((q) => (
          <div key={q.id} className={styles.item}>
            <div className={styles.question}>
              <div className={styles.questionHeader}>
                <div className={styles.meta}>
                  <Tag
                    variant={q.status === "답변완료" ? "done" : "processing"}
                  >
                    {q.status}
                  </Tag>
                  <span className={styles.author}>{q.author}</span>
                </div>
                <span className={styles.date}>{q.date}</span>
              </div>
              <p className={styles.questionText}>{q.question}</p>
            </div>

            {q.answer && (
              <div className={styles.answer}>
                <div className={styles.answerHeader}>
                  <span className={styles.answerAuthor}>판매자</span>
                  <span className={styles.date}>{q.answer.date}</span>
                </div>
                <p className={styles.answerText}>{q.answer.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
