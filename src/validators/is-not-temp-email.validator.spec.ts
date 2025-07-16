import { IsNotTempEmail } from './is-not-temp-email.validator';
describe('IsNotTempEmail', () => {
  const validator = new IsNotTempEmail();
  it('should invalidate temp emails', () => {
    expect(validator.validate('test@mailinator.com', {} as any)).toBe(false);
    expect(validator.validate('user@gmail.com', {} as any)).toBe(true);
  });
});
