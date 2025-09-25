import { useCallback, useEffect, useState } from "react";
import { getProductQuestions } from "../../../api/products";
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

type Props = {
  productId: number;
};

export default function QASection({ productId }: Props) {
  const [list, setList] = useState<QA[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(
    async (reset = false, pageOverride?: number) => {
      try {
        setLoading(true);
        setError(null);

        const nextPage = pageOverride ?? (reset ? 1 : page);
        const data = await getProductQuestions(productId, {
          page: nextPage,
          size: 10,
        });

        const mapped: QA[] = data.questions.map((q) => ({
          id: String(q.id),
          status: q.status === "ANSWERED" ? "답변완료" : "답변대기",
          author: q.author,
          date: q.questionDate,
          question: q.question,
          answer: q.answer
            ? { date: q.answer.answerDate, content: q.answer.content }
            : undefined,
        }));

        if (reset || nextPage === 1) {
          setList(mapped);
        } else {
          setList((prev) => [...prev, ...mapped]);
        }

        setPage(nextPage);
      } catch {
        setError("문의 목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    },
    [productId, page],
  );

  useEffect(() => {
    fetchQuestions(true, 1);
  }, [fetchQuestions]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>상품 문의 ({list.length})</h3>
        <Button variant="active" className={styles.askButton}>
          문의하기
        </Button>
      </div>

      {loading && <p className={styles.loading}>불러오는 중…</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && list.length === 0 && (
        <p className={styles.empty}>등록된 문의가 없습니다.</p>
      )}

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
