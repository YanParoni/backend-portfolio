export class List {
  constructor(
    public readonly id: string,
    public readonly createdAt: string,
    public readonly username: string,
    public readonly userId: string,
    public title: string,
    public description: string,
    public updatedAt: string,
    public likesCount: number,
    public comments: string[],
    public games: string[],
  ) {}

  addGames(gameIds: string[]): void {
    gameIds.forEach((gameId) => {
      if (!this.games.includes(gameId)) {
        this.games.push(gameId);
      }
    });
  }

  removeGames(gameIds: string[]): void {
    this.games = this.games.filter((id) => !gameIds.includes(id));
  }

  addComment(commentId: string): void {
    if (!this.comments.includes(commentId)) {
      this.comments.push(commentId);
    }
  }

  removeComment(commentId: string): void {
    this.comments = this.comments.filter((id) => id !== commentId);
  }

  addLike(): void {
    this.likesCount++;
  }

  removeLike(): void {
    if (this.likesCount > 0) {
      this.likesCount--;
    }
  }
}
