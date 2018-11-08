function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
// Generate a pseudo-GUID by concatenating random hexadecimal.
function GUID() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
export { GUID}