
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');

  // 로컬 파트 마스킹 (앞 두 글자까지 보이고 나머지는 ***)
  const maskedLocalPart = localPart.length > 2
    ? `${localPart.slice(0, 2)}${'*'.repeat(Math.min(localPart.length - 2, 3))}`
    : localPart;

  return `${maskedLocalPart}@${domain}`;
};

export const maskEmailDomain = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');
  const domainParts = domain.split('.');

  if (domainParts.length >= 2) {
    const firstPart = domainParts[0];
    const maskedFirstPart = firstPart.length > 1
      ? `${firstPart[0]}${'*'.repeat(Math.min(firstPart.length - 1, 3))}`
      : firstPart;

    const maskedDomain = [maskedFirstPart, ...domainParts.slice(1)].join('.');
    return `${localPart}@${maskedDomain}`;
  }

  return email;
}; 