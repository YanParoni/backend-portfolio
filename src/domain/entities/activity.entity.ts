export class Activity {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly userId: string,
    public readonly targetId: string,
    public readonly timestamp: string,
    public readonly targetType: 'list' | 'review' | 'game' | 'comment',
    public readonly details: Record<string, any>,
  ) {}
}
