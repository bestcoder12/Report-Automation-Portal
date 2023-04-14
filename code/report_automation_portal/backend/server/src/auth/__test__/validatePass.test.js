import validatePass from '../validatePass';
import testData from './validateTestData';

describe('Password check returns either true or false correctly', () => {
  test('should return true for match of hash and plaintext', async () => {
    const userPass = testData.corrPassArr

    let res = undefined;
    for (const uPass of userPass) {
      res = await validatePass(uPass.corrPass, uPass.corrHash);
      expect(res).toBe(true);
    }
  });

  test('should return false for incorrect plaintext for a hash', async () => {
    const userPass = testData.wrongPassArr

    let res = undefined;
    for (const uPass of userPass) {
      res = await validatePass(uPass.wrongPass, uPass.wrongHash);
      expect(res).toBe(false);
    }
  });

  test("should return false for blank password", async () => {
    const empPass = "";
    const empHash =
      "$2b$12$v83jedjCtVtxNnCGh0TeEebj.2BeTAcuDwIIZP79ScjdffFp58MKa";
    const res = await validatePass(empPass, empHash);
    expect(res).toBe(false);
  });
});
