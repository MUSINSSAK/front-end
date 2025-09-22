import type { AddressSearchItemType } from "../../../types/address";

type Props = {
  item: AddressSearchItemType;
  onSelect: (item: AddressSearchItemType) => void;
};

export default function AddressSearchItem({ item, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "12px 14px",
        borderRadius: 8,
        border: "1px solid #eee",
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 600 }}>{item.roadAddress}</div>
      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        {item.jibunAddress ? `(${item.jibunAddress})` : ""}
        {item.buildingName ? `, ${item.buildingName}` : ""}
        {` · ${item.zipCode}`}
      </div>
    </button>
  );
}
