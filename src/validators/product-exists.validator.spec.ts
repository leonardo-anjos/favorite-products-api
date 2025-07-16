import { ProductExists } from './product-exists.validator';
describe('ProductExists', () => {
  it('should validate product existence', async () => {
    const fakeService = { exists: jest.fn().mockResolvedValue(true) };
    const validator = new ProductExists(fakeService as any);
    expect(await validator.validate('1', {} as any)).toBe(true);
  });
});
