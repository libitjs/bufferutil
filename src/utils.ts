import {EMPTY_BUFFER} from "./constants";

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} [totalLength] The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
export function concat(list: Buffer[], totalLength?: number): Buffer {
  if (list.length === 0) return EMPTY_BUFFER;
  if (list.length === 1) return list[0];

  totalLength = totalLength ?? list.reduce((l, b) => l + b.byteLength, 0);

  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }

  if (offset < totalLength) {
    return target.slice(0, offset);
  }

  return target;
}

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function mask(source: Buffer, mask: Buffer, output: Buffer, offset: number, length: number) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
}

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
export function unmask(buffer: Buffer, mask: Buffer) {
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} buf The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 * @public
 */
export function toArrayBuffer(buf: Buffer): ArrayBuffer {
  if (buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
 * Converts `data` to a `Buffer`.
 *
 * @param {*} data The data to convert
 * @param {BufferEncoding} [enc] The data to convert
 * @return {Buffer} The buffer
 * @throws {TypeError}
 * @public
 */
export function toBuffer(data: any, enc?: BufferEncoding): Buffer {
  return toBufferEx(data, enc)[0];
}

/**
 * Converts `data` to a `Buffer` with readOnly flag.
 *
 * @param {*} data The data to convert
 * @param {BufferEncoding} [enc] The data to convert
 * @return {[Buffer, boolean]} The buffer
 * @throws {TypeError}
 * @public
 */
export function toBufferEx(data: any, enc?: BufferEncoding): [Buffer, boolean] {
  let readOnly = true;

  if (Buffer.isBuffer(data)) return [data, readOnly];

  let buf;

  if (data instanceof ArrayBuffer) {
    buf = Buffer.from(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  } else if (typeof data === 'string') {
    buf = Buffer.from(data, enc);
  } else {
    buf = Buffer.from(data);
    readOnly = false;
  }

  return [buf, readOnly];
}
