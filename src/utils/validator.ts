export const isValidURL = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const isValidHTTPURL = (string: string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    console.log(e);
    return false;
  }
};
