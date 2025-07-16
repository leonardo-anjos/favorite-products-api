import { validate } from 'class-validator';
import { CreateClientDto } from './create-client.dto';
describe('CreateClientDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateClientDto();
    dto.name = 'John Doe';
    dto.email = 'john@gmail.com'; // Corrigido para domínio não temporário
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
