export class Review {
  constructor(
    public readonly id: string,
    public readonly gameTitle: string,
    public readonly gameReleaseDate: string,
    public readonly gameImage: string,
    public readonly reviewDate: string,
    public readonly content: string,
    public readonly rating: number,
    public likesCount: number,
    public readonly userName: string,
    public readonly userProfileImage: string,
    public readonly userId: string,
  ) {}

  addLike(): void {
    this.likesCount++;
  }

  removeLike(): void {
    if (this.likesCount > 0) {
      this.likesCount--;
    }
  }
}
