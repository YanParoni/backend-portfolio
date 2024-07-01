export class Like {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly targetId: string,
    public readonly targetType: 'review' | 'list',
  ) {}
}
