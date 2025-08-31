export type AddressSearchItemType = {
  roadAddress: string;
  jibunAddress?: string;
  zipCode: string; // 서버는 zipCode 필드명 사용
  buildingName?: string;
};

// 배송지 아이템 타입 (백엔드 응답과 1:1 매칭)
export type Address = {
  id: number;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  detailAddress: string;
  postalCode: string;
  isDefault: boolean;
};
