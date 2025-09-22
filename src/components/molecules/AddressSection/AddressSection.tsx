import { useCallback, useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../../api/addresses"; // 배송지 목록 조회 API, 함수(런타임)
import { useModal } from "../../../contexts/ModalContext";
import type { Address, AddressSearchItemType } from "../../../types/address";
import { formatPhoneInput } from "../../../utils/format"; // 휴대폰 하이픈 공통 포맷
import { Button, Checkbox, Input, Tag } from "../../atoms";
import { AddressSearch } from "../../organisms";
import styles from "./AddressSection.module.css";

/* 빈 값도 서버 타입 구조에 맞게 초기화
  type -> label
  zipCode -> postalCode
  그리고 id 타입도 string → number
*/
const emptyAddress: Address = {
  id: 0,
  label: "",
  isDefault: false,
  recipient: "",
  phone: "",
  address: "",
  detailAddress: "",
  postalCode: "",
};

export default function AddressSection() {
  // 서버 타입 Address 그대로 사용
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Address>(emptyAddress);
  const [addNew, setAddNew] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false); // 저장 중 여부 (중복 클릭 방지)
  const { openComponent } = useModal(); // 모달 오픈 핸들러 추가

  // 추가 폼 저장 버튼 활성화 규칙(팀 규칙 사용), addNew일 때만 필수값 모두 채워져야 활성화
  const isFormValid =
    !addNew ||
    Boolean(
      form.label &&
        form.recipient &&
        form.phone &&
        form.address &&
        form.detailAddress &&
        form.postalCode,
    );

  // 공통 재조회 유틸
  const refresh = useCallback(async () => {
    const serverList = await getAddresses();
    setAddresses(serverList); // 매핑 불필요
  }, []);

  // 초기 마운트 시 목록 조회
  useEffect(() => {
    refresh().catch((err) => console.error("배송지 목록 조회 실패:", err));
  }, [refresh]); // refresh 의존성 추가

  const onEdit = (address: Address) => {
    setForm(address);
    setAddNew(false);
    setIsEditing(true);
  };

  // 배송지 삭제
  const onDelete = async (addr: Address) => {
    if (!confirm("정말 이 배송지를 삭제할까요?")) return;
    try {
      await deleteAddress(addr.id);
      await refresh();
      window.alert("배송지가 삭제되었습니다.");
    } catch (e) {
      console.error("배송지 삭제 실패:", e);
      window.alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => prev && { ...prev, [field]: e.target.value });

  // 휴대폰 번호 입력 시 자동 하이픈 포맷
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhoneInput(e.target.value);
    setForm((prev) => ({ ...prev, phone: value }));
  };

  /* 저장: 수정 + 기본설정(isDefault)까지 한 번에 처리
  - id는 URL path, 나머지 필드는 body로 전송
  - 성공 후 목록 재조회로 UI 동기화
  - isSaving으로 중복 저장 방지 */
  const onSave = async () => {
    if (isSaving) return; // 중복 클릭 차단
    // 추가 폼 미완성 시 차단
    if (addNew && !isFormValid) {
      window.alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        // 배송지 수정
        const { id, ...rest } = form;
        const body: Parameters<typeof updateAddress>[1] = rest; // UpdateAddressRequest 타입 강제
        await updateAddress(id, body);
        await refresh();
        window.alert("배송지가 수정되었습니다.");
      } else if (addNew) {
        // 배송지 추가
        const { id: _unused, ...rest } = form;
        const payload: Parameters<typeof createAddress>[0] = rest;
        await createAddress(payload);
        await refresh();
        window.alert("배송지가 추가되었습니다.");
      }
    } catch (e) {
      console.error("배송지 저장 실패:", e);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
      setAddNew(false);
    }
  };

  const onAdd = () => {
    setForm(emptyAddress);
    setIsEditing(false);
    setAddNew(true);
  };

  // 주소검색 모달 열고, 선택된 값으로 폼 채우기
  const openAddressSearch = async () => {
    const selected = await openComponent<
      AddressSearchItemType,
      {
        onClose: (v?: AddressSearchItemType) => void;
        initialQuery?: string;
      }
    >(AddressSearch, {
      initialQuery: form.address,
      size: "lg",
      align: "top",
    });

    if (selected) {
      setForm((prev) => ({
        ...prev,
        address: selected.roadAddress,
        postalCode: selected.zipCode, // 서버는 zipCode → 폼은 postalCode
        detailAddress: "", // 사용자가 이어서 입력하도록 초기화
      }));
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h3>배송지 관리</h3>
        <Button onClick={onAdd} className={styles.addButton}>
          배송지 추가
        </Button>
      </div>
      <div className={styles.list}>
        {/* 하드코딩 → 서버 state */}
        {addresses.map((address) => (
          <div className={styles.wrapper} key={address.id}>
            {isEditing && form?.id === address.id ? (
              <>
                <div className={styles.header}>
                  <div className={styles.labelInputGroup}>
                    {form.isDefault && <Tag>기본</Tag>}
                    <Input
                      id="label-input"
                      type="text"
                      value={form.label}
                      onChange={handleChange("label")}
                      placeholder="배송지 이름"
                      className={styles.field}
                    />
                    <Checkbox
                      id="default-checkbox"
                      checked={form.isDefault}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isDefault: e.target.checked,
                        }))
                      }
                      label="기본 배송지로 설정"
                    />
                  </div>
                </div>
                <div className={styles.grid2}>
                  <div className={styles.field}>
                    <label htmlFor="recipient-input">수취인</label>
                    <Input
                      id="recipient-input"
                      type="text"
                      value={form.recipient}
                      onChange={handleChange("recipient")}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="phone-input">연락처</label>
                    <Input
                      id="phone-input"
                      type="tel"
                      value={form.phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  {/* 수정 */}
                  <label htmlFor="address-line">주소</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input
                      id="address-line"
                      type="text"
                      value={form.address}
                      onChange={handleChange("address")}
                      disabled
                    />
                    <Button onClick={openAddressSearch} variant="active">
                      주소검색
                    </Button>
                  </div>
                  <Input
                    id="detail-address-line"
                    type="text"
                    value={form.detailAddress}
                    onChange={handleChange("detailAddress")}
                  />
                  <Input
                    id="postal-code"
                    type="text"
                    value={form.postalCode}
                    onChange={handleChange("postalCode")}
                  />
                </div>
                <div className={styles.actions}>
                  <Button onClick={onSave} variant="active" disabled={isSaving}>
                    저장
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>취소</Button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.header}>
                  <div className={styles.labelInputGroup}>
                    {address.isDefault && <Tag>기본</Tag>}
                    <span className={styles.type}>{address.label}</span>
                  </div>
                  <div className={styles.actions}>
                    <Button onClick={() => onEdit(address)}>수정</Button>
                    <Button onClick={() => onDelete(address)}>삭제</Button>
                  </div>
                </div>
                <div className={styles.details}>
                  <p>
                    {address.recipient} | {address.phone}
                  </p>
                  <p>{address.address}</p>
                  <p>{address.detailAddress}</p>
                  <p>({address.postalCode})</p>
                </div>
              </>
            )}
          </div>
        ))}
        {addNew && (
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div className={styles.labelInputGroup}>
                <Input
                  id="type-input"
                  type="text"
                  value={form.label}
                  onChange={handleChange("label")}
                  placeholder="배송지 이름"
                  className={styles.field}
                />
                <Checkbox
                  id="default-checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  label="기본 배송지로 설정"
                />
              </div>
            </div>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="recipient-input">수취인</label>
                <Input
                  id="recipient-input"
                  type="text"
                  value={form.recipient}
                  onChange={handleChange("recipient")}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="phone-input">연락처</label>
                <Input
                  id="phone-input"
                  type="tel"
                  value={form.phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>
            <div className={styles.field}>
              {/* 추가 */}
              <label htmlFor="address-line-new">주소</label>
              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  id="address-line-new"
                  type="text"
                  value={form.address}
                  onChange={handleChange("address")}
                  disabled
                />
                <Button onClick={openAddressSearch}>주소검색</Button>
              </div>
              <Input
                id="detail-address-line-new"
                type="text"
                value={form.detailAddress}
                onChange={handleChange("detailAddress")}
              />
              <Input
                id="postal-code-new"
                type="text"
                value={form.postalCode}
                onChange={handleChange("postalCode")}
              />
            </div>
            <div className={styles.actions}>
              {/* disabled={isSaving} : 사용자가 "저장" 버튼을 연타 막는것, variant 적용 + 저장 중 비활성화 */}
              <Button
                onClick={onSave}
                variant={isFormValid ? "active" : "disabled"}
                disabled={isSaving || !isFormValid}
              >
                저장
              </Button>
              <Button onClick={() => setAddNew(false)}>취소</Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
