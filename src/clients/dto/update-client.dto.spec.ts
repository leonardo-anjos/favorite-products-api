import { validate } from 'class-validator';
import { UpdateClientDto } from './update-client.dto';
describe('UpdateClientDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new UpdateClientDto();
    dto.email = 'john@gmail.com';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
