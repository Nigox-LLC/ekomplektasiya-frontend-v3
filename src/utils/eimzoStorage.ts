export const EIMZO_SIGNER_ROLE_KEY = "eImzoSigner";
export const EIMZO_CERT_KEY = "eImzoCert";

export interface SavedEimzoCert {
  disk: string;
  path: string;
  name: string;
  alias: string;
  cn?: string;
  validFrom?: string;
  validTo?: string;
}

export const setSignerRole = (isSigner: boolean) => {
  localStorage.setItem(EIMZO_SIGNER_ROLE_KEY, isSigner ? "1" : "0");
};

export const getSignerRole = () => {
  return localStorage.getItem(EIMZO_SIGNER_ROLE_KEY) === "1";
};

export const saveEimzoCert = (cert: SavedEimzoCert) => {
  localStorage.setItem(EIMZO_CERT_KEY, JSON.stringify(cert));
};

export const getSavedEimzoCert = (): SavedEimzoCert | null => {
  const raw = localStorage.getItem(EIMZO_CERT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedEimzoCert;
  } catch {
    return null;
  }
};

export const clearEimzoStorage = () => {
  localStorage.removeItem(EIMZO_CERT_KEY);
  localStorage.removeItem(EIMZO_SIGNER_ROLE_KEY);
};