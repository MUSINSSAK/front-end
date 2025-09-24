import { AddressSearchModal } from "../../../molecules";
import styles from "../OrderPage.module.css";

type DeliveryInfo = {
  name: string;
  recipient: string;
  phone: string;
  address: string;
  detailAddress: string;
  deliveryRequest: string;
};

type AddressModalProps = {
  isOpen: boolean;
  keyword: string;
  results: Array<{ id: number; address: string; detail: string }>;
  isSearching: boolean;
  hasSearched: boolean;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onSelect: (address: string) => void;
  onClose: () => void;
  onOpen: () => void;
  searchInputId: string;
};

type DeliveryInfoSectionProps = {
  info: DeliveryInfo;
  onChange: (field: keyof DeliveryInfo, value: string) => void;
  requestOptions: string[];
  ids: {
    name: string;
    recipient: string;
    phone: string;
    address: string;
    detail: string;
    request: string;
  };
  addressModal: AddressModalProps;
};

export default function DeliveryInfoSection({
  info,
  onChange,
  requestOptions,
  ids,
  addressModal,
}: DeliveryInfoSectionProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>배송지 정보</h2>

      <div className={styles.formStack}>
        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.name}>
            배송지명
          </label>
          <input
            id={ids.name}
            className={styles.input}
            value={info.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="예) 우리 집"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.recipient}>
            수령인 <span className={styles.req}>*</span>
          </label>
          <input
            id={ids.recipient}
            className={styles.input}
            value={info.recipient}
            onChange={(event) => onChange("recipient", event.target.value)}
            placeholder="받으실 분의 이름"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.phone}>
            연락처 <span className={styles.req}>*</span>
          </label>
          <input
            id={ids.phone}
            className={styles.input}
            value={info.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            placeholder="010-0000-0000"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.address}>
            주소 <span className={styles.req}>*</span>
          </label>
          <div className={styles.row}>
            <input
              id={ids.address}
              className={styles.input}
              value={info.address}
              onChange={(event) => onChange("address", event.target.value)}
              placeholder="주소를 검색해주세요"
            />
            <button
              type="button"
              onClick={addressModal.onOpen}
              className={styles.btnGhost}
            >
              주소검색
            </button>
          </div>
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.detail}>
            상세주소
          </label>
          <input
            id={ids.detail}
            className={styles.input}
            value={info.detailAddress}
            onChange={(event) => onChange("detailAddress", event.target.value)}
            placeholder="상세주소"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.request}>
            배송 요청사항
          </label>
          <div className={styles.selectWrap}>
            <select
              id={ids.request}
              className={styles.select}
              value={info.deliveryRequest}
              onChange={(event) =>
                onChange("deliveryRequest", event.target.value)
              }
            >
              {requestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className={styles.chevDownSmall} aria-hidden />
          </div>
        </div>
      </div>

      <AddressSearchModal
        isOpen={addressModal.isOpen}
        keyword={addressModal.keyword}
        results={addressModal.results}
        isSearching={addressModal.isSearching}
        hasSearched={addressModal.hasSearched}
        onKeywordChange={addressModal.onKeywordChange}
        onSearch={addressModal.onSearch}
        onSelect={addressModal.onSelect}
        onClose={addressModal.onClose}
        searchInputId={addressModal.searchInputId}
      />
    </section>
  );
}
