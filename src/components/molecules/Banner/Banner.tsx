import styles from "./Banner.module.css";

type BannerProps = {
  text: string;
};

export default function Banner({ text }: BannerProps) {
  return <div className={styles.banner}>{text}</div>;
}
