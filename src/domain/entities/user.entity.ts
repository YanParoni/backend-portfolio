export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public password: string,
    public profileImage: string,
    public bio: string,
    public isPrivate: boolean,
    public followers: string[],
    public following: string[],
    public blockedUsers: string[],
    public favorites: string[],
    public reviews: string[],
    public likes: string[],
  ) {}

  addFollower(followerId: string): void {
    if (!this.followers.includes(followerId)) {
      this.followers.push(followerId);
    }
  }

  removeFollower(followerId: string): void {
    this.followers = this.followers.filter((id) => id !== followerId);
  }

  follow(userId: string): void {
    if (!this.following.includes(userId)) {
      this.following.push(userId);
    }
  }

  unfollow(userId: string): void {
    this.following = this.following.filter((id) => id !== userId);
  }

  blockUser(userId: string): void {
    if (!this.blockedUsers.includes(userId)) {
      this.blockedUsers.push(userId);
    }
    this.removeFollower(userId);
    this.unfollow(userId);
  }

  unblockUser(userId: string): void {
    this.blockedUsers = this.blockedUsers.filter((id) => id !== userId);
  }

  addFavorite(gameId: string): void {
    if (!this.favorites.includes(gameId)) {
      this.favorites.push(gameId);
    }
  }

  removeFavorite(gameId: string): void {
    this.favorites = this.favorites.filter((id) => id !== gameId);
  }

  addLike(reviewId: string): void {
    if (!this.likes.includes(reviewId)) {
      this.likes.push(reviewId);
    }
  }

  removeLike(reviewId: string): void {
    this.likes = this.likes.filter((id) => id !== reviewId);
  }

  updateProfileImage(newProfileImage: string): void {
    this.profileImage = newProfileImage;
  }

  updateBio(newBio: string): void {
    this.bio = newBio;
  }

  isBlocked(userId: string): boolean {
    return this.blockedUsers.includes(userId);
  }

  hasBlocked(userId: string): boolean {
    return this.blockedUsers.includes(userId);
  }
}
