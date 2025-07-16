import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Client } from '../clients/entities/client.entity';
import { Repository } from 'typeorm';
import { FakestoreService } from '../external-api/fakestore/fakestore.service';
describe('FavoritesService', () => {
  let service: FavoritesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: getRepositoryToken(Favorite), useClass: Repository },
        { provide: getRepositoryToken(Client), useClass: Repository },
        { provide: FakestoreService, useValue: {} },
      ],
    }).compile();
    service = module.get<FavoritesService>(FavoritesService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // Adicione mocks e testes para todos os métodos
});
