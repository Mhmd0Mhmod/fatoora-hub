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
