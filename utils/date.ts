// Set June to be the cut off day for the start of a new year
export const getCurrentYear = (): number => {
  return Math.floor(new Date().getFullYear() + ((new Date().getMonth() - 5 ) / 12));
}