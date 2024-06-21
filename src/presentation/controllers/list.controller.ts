import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ListService } from '@/app/services/list.service';
import { CreateListDto } from '@/app/dto/create-list.dto';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createList(
    @Req() req: AuthenticatedRequest,
    @Body() createListDto: CreateListDto,
  ) {
    req.headers['activity-type'] = 'list';
    req.headers['target-type'] = 'review';
    return this.listService.create(
      createListDto,
      req.user.username,
      req.user._id,
    );
  }

  @Get()
  async findAll() {
    return this.listService.findAll();
  }

  @Get(':listId')
  async findById(@Param('listId') listId: string) {
    return this.listService.findById(listId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':listId')
  async updateList(
    @Param('listId') listId: string,
    @Body() updateData: Partial<CreateListDto>,
  ) {
    return this.listService.updateList(listId, updateData);
  }

  @Get('user/:username')
  async findByUser(@Param('username') username: string) {
    return this.listService.findByUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':listId/games')
  async addGamesToList(
    @Param('listId') listId: string,
    @Body() { gameIds }: { gameIds: string[] },
  ) {
    return this.listService.addGamesToList(listId, gameIds);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':listId/games')
  async removeGamesFromList(
    @Param('listId') listId: string,
    @Body() { gameIds }: { gameIds: string[] },
  ) {
    return this.listService.removeGamesFromList(listId, gameIds);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':listId')
  async deleteList(@Param('listId') listId: string) {
    return this.listService.delete(listId);
  }
}
