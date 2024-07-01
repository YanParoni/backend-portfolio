export class GameInteraction {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly gameId: string,
    public liked: boolean,
    public played: boolean,
  ) {}
}
