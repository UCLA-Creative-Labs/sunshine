export interface Sheet {
  notification?: string,
  invite?: string,
}

export function openWindow(url: string): void{
  const win = window.open(url, '_blank');
  if (win != null) win.focus();
}