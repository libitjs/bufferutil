import * as bu from '../utils';
import {EMPTY_BUFFER} from '../constants';

describe('utils', () => {
  describe('concat', () => {
    const b1 = Buffer.from([1, 2]);
    const b2 = Buffer.from([3, 4]);

    it('empty list', function () {
      expect(bu.concat([])).toEqual(EMPTY_BUFFER);
    });

    it('one element', function () {
      expect(bu.concat([b1])).toEqual(b1);
    });

    it('never returns uninitialized data', () => {
      const buf = bu.concat([b1, b2], 6);
      expect(buf).toEqual(Buffer.from([1, 2, 3, 4]));
    });

    it('same size with totalLength', () => {
      const buf = bu.concat([b1, b2], 4);
      expect(buf).toEqual(Buffer.from([1, 2, 3, 4]));
    });

    it('without totalLength', function () {
      const buf = bu.concat([b1, b2]);
      expect(buf).toEqual(Buffer.from([1, 2, 3, 4]));
    });

    it('should throw error for small totalLength', () => {
      expect(() => bu.concat([b1, b2], 2)).toThrow('offset is out of bounds');
    });
  });

  describe('toArrayBuffer', function () {
    it('to ArrayBuffer', function () {
      const b1 = new ArrayBuffer(4);
      const b2 = bu.toArrayBuffer(Buffer.from(b1));
      expect(b1.byteLength).toEqual(b2.byteLength);
    });
  });

  describe('toBuffer', () => {
    const s = 'hello';

    it('from string', function () {
      const buf = bu.toBuffer(s);
      expect(buf).toEqual(Buffer.from(s));
    });
  });

  describe('toBufferEx', () => {
    const s = 'hello';

    it('from Buffer', function () {
      const b = Buffer.from(s);
      const [buf, readOnly] = bu.toBufferEx(b);
      expect(buf).toEqual(b);
      expect(readOnly).toBeTruthy();
    });

    it('from ArrayBuffer', function () {
      const b = bu.toArrayBuffer(Buffer.from(s));
      const [buf, readOnly] = bu.toBufferEx(b);
      expect(buf.buffer).toEqual(b);
      expect(readOnly).toBeTruthy();
    });

    it('from DataView', function () {
      const b = bu.toArrayBuffer(Buffer.from(s));
      const view = new DataView(b);
      const [buf, readOnly] = bu.toBufferEx(view);
      expect(buf.buffer).toEqual(b);
      expect(readOnly).toBeTruthy();
    });

    it('from typed array', function () {
      const b = bu.toArrayBuffer(Buffer.from(s));
      const arr = new Uint8Array(b);
      const [buf, readOnly] = bu.toBufferEx(arr);
      expect(buf.buffer).toEqual(b);
      expect(readOnly).toBeTruthy();
    });

    it('from string', function () {
      const [buf, readOnly] = bu.toBufferEx(s);
      expect(buf).toEqual(Buffer.from(s));
      expect(readOnly).toBeTruthy();
    });

    it('from array', function () {
      const arr = [1, 2, 3, 4];
      const [buf, readOnly] = bu.toBufferEx(arr);
      expect(buf).toEqual(Buffer.from(arr));
      expect(readOnly).toBeFalsy();
    });
  });

  describe('mask', function () {
    it('masks a buffer (1/2)', function () {
      const buf = Buffer.from([0x6c, 0x3c, 0x58, 0xd9, 0x3e, 0x21, 0x09, 0x9f]);
      const mask = Buffer.from([0x48, 0x2a, 0xce, 0x24]);

      bu.mask(buf, mask, buf, 0, buf.length);

      expect(buf).toEqual(Buffer.from([0x24, 0x16, 0x96, 0xfd, 0x76, 0x0b, 0xc7, 0xbb]));
    });

    it('masks a buffer (2/2)', function () {
      const src = Buffer.from([0x6c, 0x3c, 0x58, 0xd9, 0x3e, 0x21, 0x09, 0x9f]);
      const mask = Buffer.from([0x48, 0x2a, 0xce, 0x24]);
      const dest = Buffer.alloc(src.length + 2);

      bu.mask(src, mask, dest, 2, src.length);

      expect(dest).toEqual(Buffer.from([0x00, 0x00, 0x24, 0x16, 0x96, 0xfd, 0x76, 0x0b, 0xc7, 0xbb]));
    });
  });

  describe('unmask', function () {
    it('unmasks a buffer', function () {
      const buf = Buffer.from([0x24, 0x16, 0x96, 0xfd, 0x76, 0x0b, 0xc7, 0xbb]);
      const mask = Buffer.from([0x48, 0x2a, 0xce, 0x24]);

      bu.unmask(buf, mask);

      expect(buf).toEqual(Buffer.from([0x6c, 0x3c, 0x58, 0xd9, 0x3e, 0x21, 0x09, 0x9f]));
    });
  });
});
