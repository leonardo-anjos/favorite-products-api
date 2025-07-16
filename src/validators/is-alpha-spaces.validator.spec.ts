import { IsAlphaSpaces } from './is-alpha-spaces.validator';
describe('IsAlphaSpaces', () => {
  const validator = new IsAlphaSpaces();
  it('should validate alpha spaces', () => {
    expect(validator.validate('John Doe', {} as any)).toBe(true);
    expect(validator.validate('John123', {} as any)).toBe(false);
  });
});
