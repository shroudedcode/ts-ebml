import _Buffer = require("buffer");

const Buffer: typeof global.Buffer = _Buffer.Buffer;

// Adapted from https://github.com/node-ebml/node-ebml/blob/v2.2.0/lib/ebml/tools.js

export function readVint(buffer: Buffer, start: number) {
  start = start || 0;
  for (var length = 1; length <= 8; length++) {
    if (buffer[start] >= Math.pow(2, 8 - length)) {
      break;
    }
  }
  if (length > 8) {
    throw new Error(
      "Unrepresentable length: " +
        length +
        " " +
        buffer.toString("hex", start, start + length)
    );
  }
  if (start + length > buffer.length) {
    return null;
  }
  var value = buffer[start] & ((1 << (8 - length)) - 1);
  for (var i = 1; i < length; i++) {
    if (i === 7) {
      if (value >= Math.pow(2, 53 - 8) && buffer[start + 7] > 0) {
        return {
          length: length,
          value: -1,
        };
      }
    }
    value *= Math.pow(2, 8);
    value += buffer[start + i];
  }
  return {
    length: length,
    value: value,
  };
}

export function writeVint(value: number) {
  if (value < 0 || value > Math.pow(2, 53)) {
    throw new Error("Unrepresentable value: " + value);
  }
  for (var length = 1; length <= 8; length++) {
    if (value < Math.pow(2, 7 * length) - 1) {
      break;
    }
  }
  var buffer = new Buffer(length);
  for (var i = 1; i <= length; i++) {
    var b = value & 0xff;
    buffer[length - i] = b;
    value -= b;
    value /= Math.pow(2, 8);
  }
  buffer[0] = buffer[0] | (1 << (8 - length));
  return buffer;
}
