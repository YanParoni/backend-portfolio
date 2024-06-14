export class Game {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly rating: number,
    public readonly released: Date,
    public readonly backgroundImage: string,
    public readonly tba: boolean,
    public readonly addedByStatus: Record<string, number>,
    public readonly publisher: string,
    public readonly stores: {
      id: number;
      url: string;
      store: {
        id: number;
        name: string;
        slug: string;
        domain: string;
        gamesCount: number;
        imageBackground: string;
      };
    }[],
  ) {}
}
