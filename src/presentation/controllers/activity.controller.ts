import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ActivityService } from '@/app/services/activity.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(JwtAuthGuard)
  @Get('timeline')
  async getTimeline(@Req() req: AuthenticatedRequest) {
    return this.activityService.getTimeline(req.user.sub);
  }
}
