/**
 * 휴대폰 번호 입력 시 자동으로 "-" 추가
 * - 숫자만 남기고 010-1234-5678 형태로 포맷
 * - 최대 11자리까지만 허용
 */
export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}
