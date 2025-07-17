import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: jest.Mocked<ClientsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: {
            create: jest.fn(async () => undefined),
            findAll: jest.fn(async () => undefined),
            findOne: jest.fn(async () => undefined),
            update: jest.fn(async () => undefined),
            remove: jest.fn(async () => undefined),
          },
        },
      ],
    }).compile();
    controller = module.get<ClientsController>(ClientsController);
    service = module.get(ClientsService);
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateClientDto = { name: 'A', email: 'a@a.com' };
      const client = { id: '1', ...dto, favorites: [] };
      service.create.mockResolvedValue(client);
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(client);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with parsed params and return result', async () => {
      const resultMock = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        lastPage: 0,
      };
      service.findAll.mockResolvedValue(resultMock);
      const result = await controller.findAll('1', '10', 'A', 'name', 'asc');
      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'A',
        sort: 'name',
        order: 'asc',
      });
      expect(result).toEqual(resultMock);
    });
  });

  describe('findOne', () => {
    it('should return client if found', async () => {
      const client = { id: '1', name: 'A', email: 'a@a.com', favorites: [] };
      service.findOne.mockResolvedValue(client);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(client);
    });
    it('should throw NotFoundException if not found', async () => {
      service.findOne.mockResolvedValue(null);
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call service.update and return result', async () => {
      const dto: UpdateClientDto = { name: 'B' };
      const client = { id: '1', name: 'B', email: 'a@a.com', favorites: [] };
      service.update.mockResolvedValue(client);
      const result = await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(client);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return result', async () => {
      const client = { id: '1', name: 'A', email: 'a@a.com', favorites: [] };
      service.remove.mockResolvedValue(client);
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(client);
    });
  });
});
