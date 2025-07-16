import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async create(dto: CreateClientDto) {
    const exists = await this.clientRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('E-mail already registered');
    }

    const client = this.clientRepo.create(dto);
    return this.clientRepo.save(client);
  }

  async findAll({
    page = 1,
    limit = 10,
    search,
    sort,
    order,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: string;
  }) {
    const query = this.clientRepo.createQueryBuilder('client');
    if (search) {
      query.andWhere(
        'client.name ILIKE :search OR client.email ILIKE :search',
        { search: `%${search}%` },
      );
    }
    if (sort) {
      query.orderBy(
        `client.${sort}`,
        order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    } else {
      query.orderBy('client.id', 'ASC');
    }
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.clientRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateClientDto) {
    if (dto.email) {
      const exists = await this.clientRepo.findOne({
        where: { email: dto.email },
      });
      if (exists && exists.id !== id) {
        throw new ConflictException('E-mail already registered');
      }
    }
    const client = await this.clientRepo.preload({ id, ...dto });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.clientRepo.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    if (!client) throw new NotFoundException('Client not found');
    return this.clientRepo.remove(client);
  }
}
