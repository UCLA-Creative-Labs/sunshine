export interface ILink {
  url: string;
  displayText: string;
}

export function openWindow(url: string): void{
  const win = window.open(url, '_blank');
  if (win != null) win.focus();
}

export class _DOMRect {
  public readonly x: number;
  public readonly y: number;
  public readonly top: number;
  public readonly right: number;
  public readonly bottom: number;
  public readonly left: number;
  public readonly width: number;
  public readonly height: number;

  public constructor(){
    this.x = 0;
    this.y = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
  }

  public toJSON(): string  {
    return JSON.stringify(this);
  }
}