const {
  makeNameIdObject,
  isValidUri,
  isValidUsername,
  isValidId
} = require('../utilities/utilities');

describe('makeNameIdObject()', () => {
  test('should return an empty object when input array is empty', () => {
    const articleArr = [];
    const result = makeNameIdObject(articleArr);
    expect(result).toEqual({});
  });
  test('returns an object with article name as key and id as value', () => {
    const articleArr = [{ article_id: 2, title: 'abc' }];
    expect(makeNameIdObject(articleArr)).toEqual({ abc: 2 });
  });
  test('returns an object with 2 elemnts each with article name as key and id as value', () => {
    const articleArr = [
      { article_id: 2, title: 'abc' },
      { article_id: 3, title: 'xyz' }
    ];
    expect(makeNameIdObject(articleArr)).toEqual({ abc: 2, xyz: 3 });
  });
  test('input has not been altered', () => {
    const articleArr = [{ article_id: 2, title: 'abc' }];
    makeNameIdObject(articleArr);
    expect(articleArr[0]).toEqual({
      article_id: 2,
      title: 'abc'
    });
  });
  test('should return an empty object if input is invalid ', () => {
    const articleArr = [{ id: 2, name: 'abc' }];
    const result = makeNameIdObject(articleArr);
    expect(result).toEqual({});
  });
  test('should return an empty object if input is invalid ', () => {
    const articleArr = [{ article_id: 2, name: 'abc' }];
    const result = makeNameIdObject(articleArr);
    expect(result).toEqual({});
  });
  test('should return an empty object if input is invalid ', () => {
    const articleArr = [{ num: 2, title: 'abc' }];
    const result = makeNameIdObject(articleArr);
    expect(result).toEqual({});
  });
});

describe('isValidUserName', () => {
  test('should return a boolean', () => {
    const result = isValidUsername('');
    expect(result).toBe(false);
  });
  test('should return true when username is valid', () => {
    const result = isValidUsername('abc_jhkj');
    expect(result).toBe(true);
  });
  test('should return false when username is abc_ ', () => {
    const result = isValidUsername('abc_');
    expect(result).toBe(false);
  });
  test('should return false when username is _', () => {
    const result = isValidUsername('_');
    expect(result).toBe(false);
  });
  test('should return false when username is _kljlk', () => {
    const result = isValidUsername('_kljlk');
    expect(result).toBe(false);
  });
  test('should return false when username is ajf_$%&*', () => {
    const result = isValidUsername('ajf_$%&*');
    expect(result).toBe(false);
  });
  test('should return false when username is $%&*', () => {
    const result = isValidUsername('$%&*');
    expect(result).toBe(false);
  });
  test('should return false when username is $%&*_ahdskj', () => {
    const result = isValidUsername('$%&*_ahdskj');
    expect(result).toBe(false);
  });
  test('should return false when username is assd$_kajfk', () => {
    const result = isValidUsername('assd$_kajfk');
    expect(result).toBe(false);
  });
  test('should return false when username is undefined', () => {
    const result = isValidUsername();
    expect(result).toBe(false);
  });
});

const { isValidName } = require('./utilities');

describe('isValidName', () => {
  test('should return true when name is valid', () => {
    const result = isValidName('abc');
    expect(result).toBe(true);
  });
  test('should return a false for empty string', () => {
    const result = isValidName('');
    expect(result).toBe(false);
  });
  test('should return false when name is abc_ ', () => {
    const result = isValidName('abc_');
    expect(result).toBe(false);
  });
  test('should return false when name is _', () => {
    const result = isValidName('_');
    expect(result).toBe(false);
  });
  test('should return false when name is _kljlk', () => {
    const result = isValidName('_kljlk');
    expect(result).toBe(false);
  });
  test('should return false when name is ajf_$%&*', () => {
    const result = isValidName('ajf_$%&*');
    expect(result).toBe(false);
  });
  test('should return false when name is $%&*', () => {
    const result = isValidName('$%&*');
    expect(result).toBe(false);
  });
  test('should return false when name is 123', () => {
    const result = isValidName('123');
    expect(result).toBe(false);
  });
  test('should return false when name is assd$_kajfk', () => {
    const result = isValidName('assd$_kajfk');
    expect(result).toBe(false);
  });
  test('should return false when name is undefined', () => {
    const result = isValidName();
    expect(result).toBe(false);
  });
});

describe('isValidUri', () => {
  test('should return false for invalid uri', () => {
    const result = isValidUri();
    expect(result).toBe(false);
  });
  test('should return false for invalid uri', () => {
    const uri = '';
    const result = isValidUri(uri);
    expect(result).toBe(false);
  });
  test('should return true for valid uri', () => {
    const uri = 'https://robohash.org/honey?set=set1';
    const result = isValidUri(uri);
    expect(result).toBe(true);
  });
  test('should return false for invalid uri', () => {
    const uri = '123';
    const result = isValidUri(uri);
    expect(result).toBe(false);
  });
  test('should return true for valid uri', () => {
    const uri = 'http://';
    const result = isValidUri(uri);
    expect(result).toBe(true);
  });
  test('should return false for invalid uri', () => {
    const uri = 'http';
    const result = isValidUri(uri);
    expect(result).toBe(false);
  });
});
