export interface Square {
  x: number;
  y: number;
    color: "light" | "dark";
    PlayerId: 1 | 2 | null;
    selected: boolean;
    isKing: boolean;
    canMove: boolean;
    canBeat: boolean;
    canBePromoted: boolean;
}

export default class SingleSquare implements Square {


    constructor(
    public x: number,
    public y: number,
    public color: "light" | "dark",
    public PlayerId: 1 | 2 | null = null,
    public isKing: boolean = false,
    public selected: boolean = false,
    public canMove: boolean = false,
    public canBeat: boolean = false,
    public canBePromoted: boolean = false
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
  get player(): 1 | 2 | null {
    return this.PlayerId;
  }
    set player(id: 1 | 2 | null) {
    this.PlayerId = id;
    if (id === null) {
      this.isKing = false;
    }
    }   
}
