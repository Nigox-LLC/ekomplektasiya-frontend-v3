export type SavedEimzoCert = {
  disk: string;
  path: string;
  name: string;
  alias: string;
  cn?: string;
  validFrom?: string;
  validTo?: string;
};

// Xohlasang key nomini bitta joyda boshqaramiz
const STORAGE_KEY = "eimzo_remembered_cert";
const SIGNING_DATA_KEY = "eimzo_signing_data";

export function saveEimzoCert(cert: SavedEimzoCert) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cert));
}

export function getSavedEimzoCert(): SavedEimzoCert | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SavedEimzoCert;
  } catch {
    return null;
  }
}

export function clearSavedEimzoCert() {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveEimzoSigningData(data: string) {
  localStorage.setItem(SIGNING_DATA_KEY, data);
}

export function getSavedEimzoSigningData(): string | null {
  return localStorage.getItem(SIGNING_DATA_KEY);
}

export function clearEimzoSigningData() {
  localStorage.removeItem(SIGNING_DATA_KEY);
}