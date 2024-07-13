import { Test, TestingModule } from '@nestjs/testing';
import { GameInteractionController } from '@/presentation/controllers/game-interaction.controller';
import { GameInteractionService } from '@/app/services/game-interaction.service';
import { AuthenticatedRequest } from '@/presentation/interfaces/authenticated-request.interface';
import { createMockGameInteraction } from '../utils/mock-game-interaction';
import { createMockUser } from '../utils/mock-user';

describe('GameInteractionController', () => {
  let controller: GameInteractionController;
  let service: GameInteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameInteractionController],
      providers: [
        {
          provide: GameInteractionService,
          useValue: {
            createInteraction: jest.fn(),
            getInteraction: jest.fn(),
            getUserInteractions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GameInteractionController>(
      GameInteractionController,
    );
    service = module.get<GameInteractionService>(GameInteractionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInteraction', () => {
    it('should create a new interaction', async () => {
      const gameId = 'game-id';
      const liked = true;
      const played = false;
      const mockInteraction = createMockGameInteraction({ gameId });

      const req = {
        user: createMockUser(),
        headers: {},
      } as unknown as AuthenticatedRequest;

      jest
        .spyOn(service, 'createInteraction')
        .mockResolvedValue(mockInteraction);

      const result = await controller.createInteraction(
        gameId,
        liked,
        played,
        req,
      );

      expect(result).toEqual(mockInteraction);
      expect(service.createInteraction).toHaveBeenCalledWith(
        req.user.sub,
        gameId,
        liked,
        played,
      );
    });
  });

  describe('getInteraction', () => {
    it('should return an interaction', async () => {
      const gameId = 'game-id';
      const userId = 'user-id';
      const mockInteraction = createMockGameInteraction({ gameId, userId });

      jest.spyOn(service, 'getInteraction').mockResolvedValue(mockInteraction);

      const result = await controller.getInteraction(gameId, userId);

      expect(result).toEqual(mockInteraction);
      expect(service.getInteraction).toHaveBeenCalledWith(userId, gameId);
    });
  });

  describe('getUserInteractions', () => {
    it('should return user interactions', async () => {
      const userId = 'user-id';
      const mockInteractions = [createMockGameInteraction({ userId })];

      jest
        .spyOn(service, 'getUserInteractions')
        .mockResolvedValue(mockInteractions);

      const result = await controller.getUserInteractions(userId);

      expect(result).toEqual(mockInteractions);
      expect(service.getUserInteractions).toHaveBeenCalledWith(userId);
    });
  });
});
