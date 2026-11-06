import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATARS_DIR = path.resolve(__dirname, '../public/avatars');

// Sicherstellen, dass das Verzeichnis existiert
async function ensureDir() {
  await fs.mkdir(AVATARS_DIR, { recursive: true });
}

/**
 * Zieht ein neues KI-generiertes Bild von ThisPersonDoesNotExist.com
 */
export async function fetchThisPersonDoesNotExist() {
  const timestamp = Date.now();
  const url = `https://thispersondoesnotexist.com/random-person.jpeg?t=${timestamp}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/jpeg,image/avif,image/webp,*/*'
    }
  });

  if (!response.ok) {
    throw new Error(`ThisPersonDoesNotExist API-Fehler (Status ${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}


/**
 * Speichert ein Base64-Bild lokal unter /public/avatars/{profileId}.jpg
 */
export async function saveAvatar(profileId, base64Data) {
  if (!base64Data || !profileId) return null;

  // Wenn es bereits eine gespeicherte relative URL ist, nichts tun
  if (base64Data.startsWith('/avatars/')) {
    return base64Data;
  }

  await ensureDir();
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');
  const filename = `${profileId}.jpg`;
  const filePath = path.join(AVATARS_DIR, filename);

  await fs.writeFile(filePath, buffer);
  return `/avatars/${filename}?v=${Date.now()}`;
}

/**
 * Löscht das Avatar-Bild eines Profils, falls vorhanden
 */
export async function deleteAvatar(profileId) {
  if (!profileId) return;
  try {
    const filename = `${profileId}.jpg`;
    const filePath = path.join(AVATARS_DIR, filename);
    await fs.unlink(filePath);
  } catch (err) {
    // Falls Datei nicht existiert, ignorieren
  }
}
