export const validateIPFSHash = (hash) => {
  return !(/\W/.test(hash));
}