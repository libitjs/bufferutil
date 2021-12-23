# @libit/bufferutil

> A buffer utils

## Installation

```shell
npm i @libit/bufferutil
```

## API

### concat(list: Buffer[], totalLength?: number): Buffer
Merges an array of buffers into a new buffer.

### toBuffer(data: any, enc?: BufferEncoding): Buffer
Converts `data` to a `Buffer`.

### toArrayBuffer(buf: Buffer): ArrayBuffer
Converts a buffer to an `ArrayBuffer`.

### mask(source: Buffer, mask: Buffer, output: Buffer, offset: number, length: number)
Masks a buffer using the given mask.

### unmask(buffer: Buffer, mask: Buffer)
Unmasks a buffer using the given mask.
