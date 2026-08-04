import crypto from 'crypto';

const SECRET =
  process.env.CAPTCHA_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'albahar-contact-captcha-v1';

/** Avoid ambiguous characters: 0/O, 1/I/l */
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function createCode(length = 5): string {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += CAPTCHA_CHARS[randomInt(0, CAPTCHA_CHARS.length - 1)];
  }
  return code;
}

function createToken(answer: string): string {
  const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${answer.toUpperCase()}.${exp}`;
  return Buffer.from(`${payload}.${sign(payload)}`).toString('base64url');
}

/** Distorted text image CAPTCHA as SVG data URI */
function renderCaptchaSvg(code: string): string {
  const width = 180;
  const height = 56;
  const chars = code.split('');

  const noiseLines = Array.from({ length: 6 }, () => {
    const x1 = randomInt(0, width);
    const y1 = randomInt(0, height);
    const x2 = randomInt(0, width);
    const y2 = randomInt(0, height);
    const color = `rgb(${randomInt(120, 180)},${randomInt(120, 180)},${randomInt(120, 180)})`;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.2"/>`;
  }).join('');

  const dots = Array.from({ length: 28 }, () => {
    const cx = randomInt(2, width - 2);
    const cy = randomInt(2, height - 2);
    const color = `rgb(${randomInt(100, 170)},${randomInt(100, 170)},${randomInt(100, 170)})`;
    return `<circle cx="${cx}" cy="${cy}" r="${randomInt(1, 2)}" fill="${color}"/>`;
  }).join('');

  const letters = chars
    .map((ch, i) => {
      const x = 22 + i * 30 + randomInt(-2, 2);
      const y = 34 + randomInt(-4, 4);
      const rotate = randomInt(-28, 28);
      const fontSize = randomInt(24, 30);
      const color = `rgb(${randomInt(20, 70)},${randomInt(20, 70)},${randomInt(20, 70)})`;
      return `<text x="${x}" y="${y}" fill="${color}" font-size="${fontSize}" font-family="Arial, Helvetica, sans-serif" font-weight="700" transform="rotate(${rotate} ${x} ${y})">${ch}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#eef1f4"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#c5ccd4" stroke-width="1"/>
  ${noiseLines}
  ${dots}
  ${letters}
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function createImageCaptcha(): {
  image: string;
  token: string;
} {
  const code = createCode(5);
  return {
    image: renderCaptchaSvg(code),
    token: createToken(code),
  };
}

/** @deprecated use createImageCaptcha */
export function createMathCaptcha(): { question: string; token: string; image?: string } {
  const captcha = createImageCaptcha();
  return {
    question: '',
    token: captcha.token,
    image: captcha.image,
  };
}

export function verifyCaptcha(token: string, answer: string): boolean {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const parts = raw.split('.');
    if (parts.length !== 3) return false;

    const [expectedAnswer, expStr, sig] = parts;
    const exp = Number(expStr);
    if (!expectedAnswer || !Number.isFinite(exp) || !sig) return false;
    if (Date.now() > exp) return false;

    const payload = `${expectedAnswer}.${expStr}`;
    const expectedSig = sign(payload);
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;

    return String(answer || '').trim().toUpperCase() === expectedAnswer.toUpperCase();
  } catch {
    return false;
  }
}

/** @deprecated use verifyCaptcha */
export function verifyMathCaptcha(token: string, answer: string): boolean {
  return verifyCaptcha(token, answer);
}
