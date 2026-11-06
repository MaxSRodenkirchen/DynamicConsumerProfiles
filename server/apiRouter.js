import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fetchThisPersonDoesNotExist,
  saveAvatar,
  deleteAvatar
} from './avatarService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILES_PATH = path.resolve(__dirname, '../profiles.json');
const STIMULI_PATH = path.resolve(__dirname, '../stimuli.json');

export const apiRouter = Router();

async function readStimuli() {
  try {
    const data = await fs.readFile(STIMULI_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function readProfiles() {
  try {
    const data = await fs.readFile(PROFILES_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.map(p => ({
      ...p,
      dataType: p.dataType === 'real' ? 'real' : 'fiktiv',
      avatarUrl: p.avatarUrl || null,
      livingEnvironment: p.livingEnvironment || '',
      primaryMotivations: Array.isArray(p.primaryMotivations) ? p.primaryMotivations : [],
      acceptance: p.acceptance || '',
      contextAnswers: p.contextAnswers && typeof p.contextAnswers === 'object' ? p.contextAnswers : {},
      stimulusEvaluations: Array.isArray(p.stimulusEvaluations) ? p.stimulusEvaluations : []
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(PROFILES_PATH, '[]', 'utf-8');
      return [];
    }
    throw error;
  }
}

async function writeProfiles(profiles) {
  await fs.writeFile(PROFILES_PATH, JSON.stringify(profiles, null, 2), 'utf-8');
}

function generateNextId(profiles) {
  const numbers = profiles
    .map(p => {
      const match = String(p.id).match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter(n => !isNaN(n));
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `P-${String(max + 1).padStart(3, '0')}`;
}

// GET Zufälliges Porträt von ThisPersonDoesNotExist.com
apiRouter.get('/avatar/random-tpde', async (req, res) => {
  try {
    const dataUrl = await fetchThisPersonDoesNotExist();
    res.json({ dataUrl, source: 'thispersondoesnotexist.com' });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden von thispersondoesnotexist.com', details: err.message });
  }
});


// GET all stimuli
apiRouter.get('/stimuli', async (req, res) => {
  try {
    const stimuli = await readStimuli();
    res.json(stimuli);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Lesen der Reize', details: err.message });
  }
});

// GET all profiles
apiRouter.get('/profiles', async (req, res) => {
  try {
    const profiles = await readProfiles();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Lesen der Profile', details: err.message });
  }
});

// GET single profile
apiRouter.get('/profiles/:id', async (req, res) => {
  try {
    const profiles = await readProfiles();
    const profile = profiles.find(p => String(p.id) === String(req.params.id));
    if (!profile) {
      return res.status(404).json({ error: 'Profil nicht gefunden' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Abrufen des Profils', details: err.message });
  }
});

// POST create profile
apiRouter.post('/profiles', async (req, res) => {
  try {
    const profiles = await readProfiles();
    const id = req.body.id?.trim() || generateNextId(profiles);

    if (profiles.some(p => String(p.id) === String(id))) {
      return res.status(400).json({ error: `Profil mit ID ${id} existiert bereits.` });
    }

    let avatarUrl = req.body.avatarUrl || null;
    if (req.body.avatarData) {
      avatarUrl = await saveAvatar(id, req.body.avatarData);
    }

    const newProfile = {
      id,
      dataType: req.body.dataType === 'real' ? 'real' : 'fiktiv',
      avatarUrl,
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      gender: req.body.gender || '',
      age: req.body.age !== undefined && req.body.age !== '' ? Number(req.body.age) : null,
      nationality: req.body.nationality || '',
      religion: req.body.religion || '',
      maritalStatus: req.body.maritalStatus || '',
      countryOfResidence: req.body.countryOfResidence || '',
      livingSituation: req.body.livingSituation || '',
      livingEnvironment: req.body.livingEnvironment || '',
      dietaryHabits: req.body.dietaryHabits || '',
      primaryMotivations: Array.isArray(req.body.primaryMotivations) ? req.body.primaryMotivations : [],
      acceptance: req.body.acceptance || '',
      contextAnswers: req.body.contextAnswers && typeof req.body.contextAnswers === 'object' ? req.body.contextAnswers : {},
      stimulusEvaluations: Array.isArray(req.body.stimulusEvaluations) ? req.body.stimulusEvaluations : []
    };

    profiles.push(newProfile);
    await writeProfiles(profiles);
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Speichern des Profils', details: err.message });
  }
});

// PUT update profile
apiRouter.put('/profiles/:id', async (req, res) => {
  try {
    const profiles = await readProfiles();
    const index = profiles.findIndex(p => String(p.id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Profil nicht gefunden' });
    }

    const targetId = profiles[index].id;
    let avatarUrl = profiles[index].avatarUrl || null;

    if (req.body.avatarData) {
      avatarUrl = await saveAvatar(targetId, req.body.avatarData);
    } else if (req.body.avatarUrl === null) {
      await deleteAvatar(targetId);
      avatarUrl = null;
    }

    const updatedProfile = {
      ...profiles[index],
      ...req.body,
      id: targetId, // ID remains immutable on update
      avatarUrl,
      dataType: req.body.dataType ? (req.body.dataType === 'real' ? 'real' : 'fiktiv') : (profiles[index].dataType || 'fiktiv'),
      age: req.body.age !== undefined && req.body.age !== '' ? (req.body.age === null ? null : Number(req.body.age)) : profiles[index].age,
      primaryMotivations: Array.isArray(req.body.primaryMotivations)
        ? req.body.primaryMotivations
        : (profiles[index].primaryMotivations || []),
      acceptance: req.body.acceptance !== undefined ? req.body.acceptance : (profiles[index].acceptance || ''),
      contextAnswers: req.body.contextAnswers && typeof req.body.contextAnswers === 'object'
        ? req.body.contextAnswers
        : (profiles[index].contextAnswers || {}),
      stimulusEvaluations: Array.isArray(req.body.stimulusEvaluations)
        ? req.body.stimulusEvaluations
        : (profiles[index].stimulusEvaluations || [])
    };

    delete updatedProfile.avatarData; // Don't persist raw base64 in json

    profiles[index] = updatedProfile;
    await writeProfiles(profiles);
    res.json(updatedProfile);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Profils', details: err.message });
  }
});

// DELETE profile
apiRouter.delete('/profiles/:id', async (req, res) => {
  try {
    const profiles = await readProfiles();
    const index = profiles.findIndex(p => String(p.id) === String(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Profil nicht gefunden' });
    }

    const removed = profiles.splice(index, 1)[0];
    await deleteAvatar(removed.id);
    await writeProfiles(profiles);
    res.json({ message: 'Profil gelöscht', deleted: removed });
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Löschen des Profils', details: err.message });
  }
});
