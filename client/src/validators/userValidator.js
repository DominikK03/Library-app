export function validatePhoneNumber(phoneNumber) {
  // Akceptuje tylko 9 cyfr, bez spacji, myślników itp.
  const regex = /^\d{9}$/;
  return regex.test(phoneNumber);
}

export function validateBirthDate(birthDate) {
  // Oczekuje formatu YYYY-MM-DD
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) return false;
  const year = date.getFullYear();
  return year >= 1925 && year <= 2025;
}

export function validateNameOrSurname(value) {
  // Pierwsza litera duża, reszta małe, tylko litery (polskie znaki dozwolone)
  return /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/.test(value);
}