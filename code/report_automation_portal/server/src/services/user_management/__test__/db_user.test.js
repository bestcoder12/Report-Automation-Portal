// eslint-disable-next-line import/no-extraneous-dependencies
import { jest } from '@jest/globals';
import userOps from '../db_user.js';

const db = jest.fn();

const userFunc = await userOps(db);

describe('User operations', () => {
  describe('Password checking', () => {
    test('should return true for right strength', async () => {
      expect(userFunc.chkPassStrngth('test1App', 0)).toBe(true);
      expect(userFunc.chkPassStrngth('test#1App', 0)).toBe(true);
      expect(userFunc.chkPassStrngth('test#1App', 1)).toBe(true);
    });

    test('should return false for incorrect strength', () => {
      expect(userFunc.chkPassStrngth('test', 0)).toBe(false);
      expect(userFunc.chkPassStrngth('test', 1)).toBe(false);
      expect(userFunc.chkPassStrngth('testapp', 0)).toBe(false);
      expect(userFunc.chkPassStrngth('testapp', 1)).toBe(false);
      expect(userFunc.chkPassStrngth('testApp', 0)).toBe(false);
      expect(userFunc.chkPassStrngth('testApp', 1)).toBe(false);
      expect(userFunc.chkPassStrngth('test1App', 1)).toBe(false);
    });
  });
});
