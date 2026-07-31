const CSRF_COOKIE_NAME = 'csrf-token';

export function isValidSignedCsrfToken(
  token: string | null | undefined
): token is string {
  return Boolean(token && token.split('.').length === 3);
}

export function readCsrfTokenFromDocumentCookie(): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const prefix = `${CSRF_COOKIE_NAME}=`;
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
}

export function resolveClientCsrfToken(
  serverToken?: string | null
): string | undefined {
  if (isValidSignedCsrfToken(serverToken)) {
    return serverToken;
  }

  const cookieToken = readCsrfTokenFromDocumentCookie();

  if (isValidSignedCsrfToken(cookieToken)) {
    return cookieToken;
  }

  return undefined;
}
