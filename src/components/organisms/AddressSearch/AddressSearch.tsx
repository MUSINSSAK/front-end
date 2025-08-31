import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { searchAddress } from "../../../api/addressSearch";
import { useModal } from "../../../contexts/ModalContext";
import type { AddressSearchItemType } from "../../../types/address";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import { AddressSearchItem } from "../../molecules";
import styles from "./AddressSearch.module.css";

type Props = {
  initialQuery?: string;
  onClose: (result?: AddressSearchItemType) => void;
};

export default function AddressSearch({ initialQuery = "", onClose }: Props) {
  const { close } = useModal();

  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<AddressSearchItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  const runSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    try {
      const { items } = await searchAddress(query.trim());
      setItems(items);
    } catch (e: unknown) {
      setItems([]);
      setError(e instanceof Error ? e.message : "검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.close} onClick={close}>
        <X size={20} />
      </button>
      <div className={styles.headRow}>
        <Input
          id="addr-search-input"
          type="text"
          value={query}
          placeholder="도로명, 건물명, 지번 등으로 검색"
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
        />
        <Button
          className={styles.button}
          onClick={runSearch}
          variant={canSearch ? "active" : "disabled"}
        >
          검색
        </Button>
      </div>

      <div className={styles.listWrap}>
        {loading && <div className={styles.loading}>검색 중…</div>}
        {!loading && error && <div className={styles.error}>{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className={styles.empty}>검색 결과가 없습니다.</div>
        )}
        <div className={styles.items}>
          {items.map((it, idx) => (
            <AddressSearchItem
              key={`${it.roadAddress}-${idx}`}
              item={it}
              onSelect={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
