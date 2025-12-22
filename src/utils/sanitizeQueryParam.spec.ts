import {
  sanitizeQueryParamValue,
  sanitizeQueryParamValueInPath,
} from './sanitizeQueryParam';

describe('sanitizeQueryParamValue', () => {
  it('encodes reserved characters that break parsing (#, &, +, space)', () => {
    expect(sanitizeQueryParamValue('Widget #2')).toBe('Widget%20%232');
    expect(sanitizeQueryParamValue('AT&T')).toBe('AT%26T');
    expect(sanitizeQueryParamValue('plus+sign')).toBe('plus%2Bsign');
    expect(sanitizeQueryParamValue('has space')).toBe('has%20space');
  });

  it('preserves valid percent-escapes but encodes stray %', () => {
    expect(sanitizeQueryParamValue('already%23encoded')).toBe(
      'already%23encoded'
    );
    expect(sanitizeQueryParamValue('100% legit')).toBe('100%25%20legit');
  });
});

describe('sanitizeQueryParamValueInPath', () => {
  const origin = 'https://example.com';

  it('keeps full product_name when it contains #', () => {
    const safePath = sanitizeQueryParamValueInPath(
      '/p?product_name=Widget #2',
      'product_name'
    );
    const url = new URL(safePath, origin);

    expect(url.searchParams.get('product_name')).toBe('Widget #2');
    expect(url.hash).toBe('');
  });

  it('keeps full product_name when it contains &', () => {
    const safePath = sanitizeQueryParamValueInPath(
      '/p?product_name=AT&T',
      'product_name'
    );
    const url = new URL(safePath, origin);

    expect(url.searchParams.get('product_name')).toBe('AT&T');
    // Ensure it didn't accidentally create an extra param
    expect(Array.from(url.searchParams.keys())).toEqual(['product_name']);
  });

  it('keeps plus sign as literal + (not space)', () => {
    const safePath = sanitizeQueryParamValueInPath(
      '/p?product_name=plus+sign',
      'product_name'
    );
    const url = new URL(safePath, origin);

    expect(url.searchParams.get('product_name')).toBe('plus+sign');
  });

  it('does not modify other params while sanitizing the target param', () => {
    const safePath = sanitizeQueryParamValueInPath(
      '/p?exchangeToken=abc&product_name=Widget #2',
      'product_name'
    );
    const url = new URL(safePath, origin);

    expect(url.searchParams.get('exchangeToken')).toBe('abc');
    expect(url.searchParams.get('product_name')).toBe('Widget #2');
  });

  it('returns the original path if param is missing', () => {
    expect(sanitizeQueryParamValueInPath('/p?foo=bar', 'product_name')).toBe(
      '/p?foo=bar'
    );
  });
});
