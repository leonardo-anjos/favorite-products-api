import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'create a new client' })
  async create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'list all clients with optional filters' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    return this.clientsService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      sort,
      order,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'get a client by ID' })
  async findOne(@Param('id') id: string) {
    const client = await this.clientsService.findOne(id);
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update a client by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a client by ID' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
