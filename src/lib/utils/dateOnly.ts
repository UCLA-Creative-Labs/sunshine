


export function parseDateOnly(value: string) {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  
}