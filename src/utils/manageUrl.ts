export const deleteParam = (param: string) => {
  const params = new URLSearchParams(location.search);
  params.delete(param);
  const newUrl = `${location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newUrl);
};
