import { validate } from 'class-validator';
import { LoginDto } from './login.dto';
describe('LoginDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new LoginDto();
    dto.username = 'user';
    dto.password = 'abc123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
