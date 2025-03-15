export function getBaseURL(): string {
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_BASE_URL || '/';
  } else {
    return '/';
  }
}
