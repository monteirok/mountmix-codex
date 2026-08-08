export const phoneCountryCodes = [
  { id: "CA", value: "+1", country: "Canada", flag: "🇨🇦" },
  { id: "US", value: "+1", country: "United States", flag: "🇺🇸" },
  { id: "GB", value: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { id: "AU", value: "+61", country: "Australia", flag: "🇦🇺" },
  { id: "NZ", value: "+64", country: "New Zealand", flag: "🇳🇿" },
  { id: "MX", value: "+52", country: "Mexico", flag: "🇲🇽" },
  { id: "FR", value: "+33", country: "France", flag: "🇫🇷" },
  { id: "DE", value: "+49", country: "Germany", flag: "🇩🇪" },
  { id: "IE", value: "+353", country: "Ireland", flag: "🇮🇪" },
  { id: "IN", value: "+91", country: "India", flag: "🇮🇳" },
] as const;

export const defaultPhoneCountryId = "CA";
export const defaultPhoneCountryCode = "+1";

export function isSupportedPhoneCountryCode(value: string) {
  return phoneCountryCodes.some((countryCode) => countryCode.value === value);
}

export function phoneContainsOnlyAllowedCharacters(value: string) {
  return /^[+\d().\-\s]*$/.test(value);
}

function getCountryCodeDigits(countryCode: string) {
  return countryCode.replace(/\D/g, "");
}

function getMaxLocalDigits(countryCode: string) {
  const countryCodeDigits = getCountryCodeDigits(countryCode);
  return Math.max(6, 15 - countryCodeDigits.length);
}

export function normalizePhoneDigits(value: string, countryCode: string) {
  const trimmed = value.trim();
  const countryCodeDigits = getCountryCodeDigits(countryCode);
  let digits = value.replace(/\D/g, "");

  if (trimmed.startsWith("+") && digits.startsWith(countryCodeDigits)) {
    digits = digits.slice(countryCodeDigits.length);
  } else if (trimmed.startsWith("00") && digits.startsWith(`00${countryCodeDigits}`)) {
    digits = digits.slice(countryCodeDigits.length + 2);
  } else if (countryCode === "+1" && digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, getMaxLocalDigits(countryCode));
}

function formatNorthAmericanNumber(digits: string) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function formatInternationalLocalNumber(digits: string) {
  const groups: string[] = [];
  let remaining = digits;

  while (remaining.length > 4) {
    groups.push(remaining.slice(0, 3));
    remaining = remaining.slice(3);
  }

  if (remaining) groups.push(remaining);
  return groups.join(" ");
}

export function formatPhoneNumber(value: string, countryCode: string) {
  const digits = normalizePhoneDigits(value, countryCode);
  if (countryCode === "+1") return formatNorthAmericanNumber(digits);
  return formatInternationalLocalNumber(digits);
}

export function getPhoneValidationError(localPhone: string, countryCode: string) {
  if (!localPhone.trim()) return "";
  if (!isSupportedPhoneCountryCode(countryCode)) return "Choose a valid country code.";

  const digits = normalizePhoneDigits(localPhone, countryCode);
  if (countryCode === "+1") {
    return digits.length === 10 ? "" : "Enter a 10-digit phone number.";
  }

  return digits.length >= 6 && digits.length <= getMaxLocalDigits(countryCode)
    ? ""
    : "Enter a valid phone number for the selected country code.";
}

export function formatPhoneForDisplay(localPhone: string, countryCode: string) {
  const formattedLocalPhone = formatPhoneNumber(localPhone, countryCode);
  return formattedLocalPhone ? `${countryCode} ${formattedLocalPhone}` : "";
}
