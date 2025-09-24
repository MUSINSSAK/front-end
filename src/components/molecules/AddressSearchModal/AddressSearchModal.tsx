import styles from "../../organisms/Order/OrderPage.module.css";

type AddressSearchModalProps = {
  isOpen: boolean;
  keyword: string;
  results: Array<{ id: number; address: string; detail: string }>;
  isSearching: boolean;
  hasSearched: boolean;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onSelect: (address: string) => void;
  onClose: () => void;
  searchInputId: string;
};

export default function AddressSearchModal({
  isOpen,
  keyword,
  results,
  isSearching,
  hasSearched,
  onKeywordChange,
  onSearch,
  onSelect,
  onClose,
  searchInputId,
}: AddressSearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>주소 검색</h3>
          <button
            type="button"
            aria-label="닫기"
            className={styles.iconBtn}
            onClick={onClose}
          >
            <span className={styles.iconClose} aria-hidden />
          </button>
        </div>

        <div className={styles.searchRow}>
          <label htmlFor={searchInputId} className="sr-only">
            주소 검색어
          </label>
          <input
            id={searchInputId}
            className={styles.input}
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="도로명이나 동을 입력하세요"
          />
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onSearch}
          >
            검색
          </button>
        </div>

        <div className={styles.resultList}>
          {isSearching ? (
            <div className={styles.centerBox}>
              <div className={styles.spinner} />
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className={styles.centerMuted}>검색 결과가 없습니다</div>
          ) : (
            results.map((result) => (
              <button
                key={result.id}
                type="button"
                className={styles.addrItem}
                onClick={() => onSelect(result.address)}
              >
                <p className={styles.addrLine}>{result.address}</p>
                <p className={styles.addrDetail}>{result.detail}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
