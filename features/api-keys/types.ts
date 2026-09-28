export interface APIKey {
  id: string;
  prefix: string;
  deviceName: string;
  deviceId: string;
  taxpayerName: string;
  environment: "Simulation" | "Production";
  status: "Active" | "Suspended";
  createdAtUtc: string | null;
  lastUsedAtUtc: string | null;
  expiresAtUtc: string | null;
}

export interface ApiKeyCreated {
  id: string;
  clearTextApiKey: string;
  prefix: string;
  deviceName: string;
  deviceId: string;
  taxpayerName: string;
  environment: "Simulation" | "Production";
  createdAtUtc: string;
  expiresAtUtc: string;
}
