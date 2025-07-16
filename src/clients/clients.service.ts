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
      throw new ConflictException('E-mail já cadastrado');
    }

    const client = this.clientRepo.create(dto);
    return this.clientRepo.save(client);
  }

  findAll() {
    return this.clientRepo.find();
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
        throw new ConflictException('E-mail já cadastrado');
      }
    }
    const client = await this.clientRepo.preload({ id, ...dto });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return this.clientRepo.save(client);
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return this.clientRepo.remove(client);
  }
}
