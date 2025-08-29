import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2>새로운 스타일을 발견하세요</h2>
        <p>MUSINSSAK에서 만나는 트렌디한 패션 아이템</p>
      </div>
    </section>
  );
}
