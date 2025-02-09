export const lsHandler = {
  name: 'thisAppStorage',
  setValue(str: string) {
    localStorage.setItem(this.name, str);
  },
  getValue() {
    return localStorage.getItem(this.name);
  },
};
