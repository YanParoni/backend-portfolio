export class Comment {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly authorId: string,
    public readonly authorUsername: string,
    public readonly authorProfileImage: string,
    public readonly targetId: string,
    public readonly targetType: 'list' | 'review',
    public isBlocked: boolean,
  ) {}
  block(): void {
    this.isBlocked = true;
  }

  unblock(): void {
    this.isBlocked = false;
  }
}
