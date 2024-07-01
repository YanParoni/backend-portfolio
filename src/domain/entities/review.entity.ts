export class Review {
  constructor(
    public readonly id: string,
    public readonly gameTitle: string,
    public readonly gameReleaseDate: string,
    public readonly gameImage: string,
    public readonly reviewDate: string,
    public readonly content: string,
    public readonly rating: number,
    public likes: string[],
    public readonly userName: string,
    public readonly userProfileImage: string,
    public readonly userId: string,
  ) {}

  addLike(likeId: string): void {
    if (!this.likes.includes(likeId)) {
      this.likes.push(likeId);
    }
  }

  removeLike(likeId: string): void {
    this.likes = this.likes.filter((id) => id !== likeId);
  }
}
