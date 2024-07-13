import { Test, TestingModule } from '@nestjs/testing';
import { GameInteractionService } from '@/app/services/game-interaction.service';
import { GameInteractionRepository } from '@/infra/repositories/game-interaction.repository';
import { GameService } from '@/app/services/game.service';
import { ActivityService } from '@/app/services/activity.service';
import { UserService } from '@/app/services/user.service';
import { createMockGameInteraction } from '../utils/mock-game-interaction';
import { createMockGame } from '../utils/mock-game';
import { createMockActivity } from '../utils/mock-activity';
import { GameInteraction } from '@/domain/entities/game-interaction.entity';

describe('GameInteractionService', () => {
  let service: GameInteractionService;
  let interactionRepository: GameInteractionRepository;
  let gameService: GameService;
  let activityService: ActivityService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameInteractionService,
        {
          provide: GameInteractionRepository,
          useValue: {
            findByUserIdAndGameId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: GameService,
          useValue: {
            findOrCreateGame: jest.fn(),
          },
        },
        {
          provide: ActivityService,
          useValue: {
            recordActivity: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            addGameInteraction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameInteractionService>(GameInteractionService);
    interactionRepository = module.get<GameInteractionRepository>(
      GameInteractionRepository,
    );
    gameService = module.get<GameService>(GameService);
    activityService = module.get<ActivityService>(ActivityService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInteraction', () => {
    it('should create a new interaction', async () => {
      const userId = 'user-id';
      const gameId = 'game-id';
      const liked = true;
      const played = false;
      const mockGameInteraction = createMockGameInteraction({ userId, gameId });
      const mockGame = createMockGame({ gameId });

      jest
        .spyOn(interactionRepository, 'findByUserIdAndGameId')
        .mockResolvedValue(null);
      jest.spyOn(gameService, 'findOrCreateGame').mockResolvedValue(mockGame);
      jest
        .spyOn(interactionRepository, 'create')
        .mockResolvedValue(mockGameInteraction);
      jest.spyOn(userService, 'addGameInteraction').mockResolvedValue();
      jest
        .spyOn(activityService, 'recordActivity')
        .mockResolvedValue(createMockActivity());

      const result = await service.createInteraction(
        userId,
        gameId,
        liked,
        played,
      );

      expect(result).toEqual(mockGameInteraction);
      expect(interactionRepository.findByUserIdAndGameId).toHaveBeenCalledWith(
        userId,
        gameId,
      );
      expect(gameService.findOrCreateGame).toHaveBeenCalledWith(gameId);
      expect(interactionRepository.create).toHaveBeenCalledWith(
        expect.any(GameInteraction),
      );
      expect(userService.addGameInteraction).toHaveBeenCalledWith(
        userId,
        mockGameInteraction.id,
      );
      expect(activityService.recordActivity).toHaveBeenCalled();
    });

    it('should update an existing interaction', async () => {
      const userId = 'user-id';
      const gameId = 'game-id';
      const liked = false;
      const played = true;
      const existingInteraction = createMockGameInteraction({ userId, gameId });

      jest
        .spyOn(interactionRepository, 'findByUserIdAndGameId')
        .mockResolvedValue(existingInteraction);
      jest
        .spyOn(interactionRepository, 'update')
        .mockResolvedValue(existingInteraction);
      jest
        .spyOn(activityService, 'recordActivity')
        .mockResolvedValue(createMockActivity());

      const result = await service.createInteraction(
        userId,
        gameId,
        liked,
        played,
      );

      expect(result).toEqual(existingInteraction);
      expect(interactionRepository.findByUserIdAndGameId).toHaveBeenCalledWith(
        userId,
        gameId,
      );
      expect(interactionRepository.update).toHaveBeenCalledWith(
        existingInteraction,
      );
      expect(activityService.recordActivity).toHaveBeenCalled();
    });
  });

  describe('getInteraction', () => {
    it('should return an interaction', async () => {
      const userId = 'user-id';
      const gameId = 'game-id';
      const mockGameInteraction = createMockGameInteraction({ userId, gameId });

      jest
        .spyOn(interactionRepository, 'findByUserIdAndGameId')
        .mockResolvedValue(mockGameInteraction);

      const result = await service.getInteraction(userId, gameId);

      expect(result).toEqual(mockGameInteraction);
      expect(interactionRepository.findByUserIdAndGameId).toHaveBeenCalledWith(
        userId,
        gameId,
      );
    });
  });

  describe('getUserInteractions', () => {
    it('should return user interactions', async () => {
      const userId = 'user-id';
      const mockGameInteractions = [createMockGameInteraction({ userId })];

      jest
        .spyOn(interactionRepository, 'findByUserId')
        .mockResolvedValue(mockGameInteractions);

      const result = await service.getUserInteractions(userId);

      expect(result).toEqual(mockGameInteractions);
      expect(interactionRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
