import { Buffer } from 'node:buffer';

export function multipartBufferMiddleware(limit = 25 * 1024 * 1024) {
  return (req, res, next) => {
    if (req.method !== 'POST' || !/^multipart\/form-data\s*;/i.test(req.headers['content-type'] || '')) { next?.(); return; }
    const chunks = [];
    let size = 0;
    let rejected = false;
    req.on('data', chunk => {
      if (rejected) return;
      size += chunk.length;
      if (size > limit) {
        rejected = true;
        chunks.length = 0;
        res.status(413).json({ code: 'UPLOAD_TOO_LARGE' });
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (rejected) return;
      req.body = Buffer.concat(chunks);
      next?.();
    });
    req.on('error', () => {
      if (!res.headersSent) res.status(400).json({ code: 'INVALID_MULTIPART' });
    });
  };
}

export function parseMultipartForm(buffer, contentType) {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || '');
  if (!boundaryMatch || !Buffer.isBuffer(buffer)) return { error: 'INVALID_MULTIPART' };
  const boundary = Buffer.from(`--${(boundaryMatch[1] || boundaryMatch[2]).trim()}`);
  const fields = {};
  const files = [];
  let cursor = buffer.indexOf(boundary);
  while (cursor >= 0) {
    cursor += boundary.length;
    if (buffer.subarray(cursor, cursor + 2).toString() === '--') break;
    if (buffer.subarray(cursor, cursor + 2).toString() === '\r\n') cursor += 2;
    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), cursor);
    if (headerEnd < 0) return { error: 'INVALID_MULTIPART' };
    const nextBoundary = buffer.indexOf(boundary, headerEnd + 4);
    if (nextBoundary < 0) return { error: 'INVALID_MULTIPART' };
    const headers = buffer.subarray(cursor, headerEnd).toString('utf8');
    const disposition = /^content-disposition:\s*form-data;([^\r\n]+)/im.exec(headers)?.[1];
    const name = disposition && /(?:^|;)\s*name="([^"]+)"/i.exec(disposition)?.[1];
    const filename = disposition && /(?:^|;)\s*filename="([^"]*)"/i.exec(disposition)?.[1];
    if (!name) return { error: 'INVALID_MULTIPART' };
    const valueEnd = nextBoundary >= 2 && buffer.subarray(nextBoundary - 2, nextBoundary).toString() === '\r\n' ? nextBoundary - 2 : nextBoundary;
    const value = buffer.subarray(headerEnd + 4, valueEnd);
    if (filename !== undefined) {
      const type = /^content-type:\s*([^\r\n]+)/im.exec(headers)?.[1]?.trim().toLowerCase() || 'application/octet-stream';
      files.push({ field: name, filename, contentType: type, data: value });
    } else {
      fields[name] = value.toString('utf8');
    }
    cursor = nextBoundary;
  }
  return { fields, files };
}
