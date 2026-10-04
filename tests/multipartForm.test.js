import { Buffer } from 'node:buffer';
import { describe, expect, it } from '@jest/globals';
import { parseMultipartForm } from '../scripts/multipart-form.js';

describe('analizador multipart para solicitudes', () => {
  it('preserva los bytes binarios del adjunto y campos de texto', () => {
    const boundary = 'qa-boundary';
    const binary = Buffer.from([0, 255, 13, 10, 1, 2, 128]);
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="payload"\r\n\r\n{"description":"pieza"}\r\n--${boundary}\r\nContent-Disposition: form-data; name="attachments"; filename="pieza.png"\r\nContent-Type: image/png\r\n\r\n`),
      binary,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);
    const parsed = parseMultipartForm(body, `multipart/form-data; boundary=${boundary}`);
    expect(parsed.fields.payload).toBe('{"description":"pieza"}');
    expect(parsed.files[0].filename).toBe('pieza.png');
    expect(parsed.files[0].contentType).toBe('image/png');
    expect(parsed.files[0].data).toEqual(binary);
  });

  it('rechaza un cuerpo sin delimitador multipart', () => {
    expect(parseMultipartForm(Buffer.from('bad'), 'multipart/form-data')).toEqual({ error: 'INVALID_MULTIPART' });
  });
});
