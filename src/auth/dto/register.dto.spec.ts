import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';
describe('RegisterDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new RegisterDto();
    dto.username = 'user';
    dto.password = 'abc123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
