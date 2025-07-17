import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ClientsService', () => {
  let service: ClientsService;
  let repo: jest.Mocked<Repository<Client>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<ClientsService>(ClientsService);
    repo = module.get(getRepositoryToken(Client));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email already exists', async () => {
      repo.findOne.mockResolvedValue({
        id: '1',
        email: 'a@a.com',
        name: 'A',
      } as Client);
      await expect(
        service.create({ email: 'a@a.com', name: 'A' }),
      ).rejects.toThrow(ConflictException);
    });
    it('should create and save client if email does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({ email: 'a@a.com', name: 'A' } as Client);
      repo.save.mockResolvedValue({
        id: '1',
        email: 'a@a.com',
        name: 'A',
      } as Client);
      const result = await service.create({ email: 'a@a.com', name: 'A' });
      expect(repo.create).toHaveBeenCalledWith({ email: 'a@a.com', name: 'A' });
      expect(repo.save).toHaveBeenCalledWith({ email: 'a@a.com', name: 'A' });
      expect(result).toEqual({ id: '1', email: 'a@a.com', name: 'A' });
    });
  });

  describe('findAll', () => {
    it('should return paginated clients with search and sort', async () => {
      const mockQueryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([[{ id: '1', name: 'A', email: 'a@a.com' }], 1]),
      };
      repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll({
        page: 1,
        limit: 10,
        search: 'A',
        sort: 'name',
        order: 'asc',
      });
      expect(result).toEqual({
        data: [{ id: '1', name: 'A', email: 'a@a.com' }],
        total: 1,
        page: 1,
        limit: 10,
        lastPage: 1,
      });
      expect((mockQueryBuilder as any).andWhere).toHaveBeenCalled();
      expect((mockQueryBuilder as any).orderBy).toHaveBeenCalledWith(
        'client.name',
        'ASC',
      );
    });
    it('should return empty data if no clients', async () => {
      const mockQueryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      repo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        lastPage: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return client by id', async () => {
      repo.findOne.mockResolvedValue({
        id: '1',
        name: 'A',
        email: 'a@a.com',
      } as Client);
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', name: 'A', email: 'a@a.com' });
    });
    it('should return null if client not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findOne('2');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should throw ConflictException if email already exists for another client', async () => {
      repo.findOne.mockResolvedValue({
        id: '2',
        email: 'b@b.com',
        name: 'B',
      } as Client);
      await expect(service.update('1', { email: 'b@b.com' })).rejects.toThrow(
        ConflictException,
      );
    });
    it('should throw NotFoundException if client not found', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.preload.mockResolvedValue(undefined);
      await expect(service.update('1', { name: 'New' })).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should update and save client', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.preload.mockResolvedValue({
        id: '1',
        name: 'New',
        email: 'a@a.com',
      } as Client);
      repo.save.mockResolvedValue({
        id: '1',
        name: 'New',
        email: 'a@a.com',
      } as Client);
      const result = await service.update('1', { name: 'New' });
      expect(repo.preload).toHaveBeenCalledWith({ id: '1', name: 'New' });
      expect(repo.save).toHaveBeenCalledWith({
        id: '1',
        name: 'New',
        email: 'a@a.com',
      });
      expect(result).toEqual({ id: '1', name: 'New', email: 'a@a.com' });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if client not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
    it('should remove client if found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: '1', name: 'A', email: 'a@a.com' } as Client);
      repo.remove.mockResolvedValue({
        id: '1',
        name: 'A',
        email: 'a@a.com',
      } as Client);
      const result = await service.remove('1');
      expect(repo.remove).toHaveBeenCalledWith({
        id: '1',
        name: 'A',
        email: 'a@a.com',
      });
      expect(result).toEqual({ id: '1', name: 'A', email: 'a@a.com' });
    });
  });
});
