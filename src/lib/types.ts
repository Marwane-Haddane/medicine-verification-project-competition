export type VerificationStatus = 'consistent' | 'suspicious' | 'expired';

export interface MedicineRecord {
  gtin: string; // 14-digit GS1 identifier (e.g. 06111234567890)
  name: string; // e.g. "Azole 400 mg"
  brand: string; // e.g. "Azole"
  activeIngredient: string; // International Nonproprietary Name (DCI), e.g. "Albendazole"
  dosage: string; // e.g. "400 mg"
  form: string; // e.g. "Comprimé à croquer", "Gélule", "Sirop"
  packaging: string; // e.g. "Boîte de 1 comprimé"
  manufacturer: string; // e.g. "Laboratoires Promopharm"
  country: 'Morocco' | 'France';
  registry: 'AMMPS' | 'BDPM'; // AMMPS (Morocco) or BDPM (France)
  registrationNumber: string; // e.g. "AMM 920 342 1"
  atcCode: string; // e.g. "P02CA03"
  price: string; // e.g. "24.50 MAD" or "4.15 €"
  isReimbursable: boolean;
  marketingDate: string; // e.g. "12/2014"
  description: string;
  indications: string[];
  defaultBatch: string;
  defaultSerial: string;
  defaultExpiry: string;
  knownBatches: {
    batchNumber: string;
    expiryDate: string;
    validSerials: string[];
    status: 'active' | 'recalled' | 'expired';
  }[];
}

export interface SignalCheck {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  status: 'passed' | 'warning' | 'failed';
  code: string;
  latencyMs: number;
}

export interface VerificationResult {
  status: VerificationStatus;
  statusLabel: string;
  statusMessage: string;
  overallScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  product: MedicineRecord;
  scannedGtin: string;
  scannedBatch: string;
  scannedSerial: string;
  scannedExpiry: string;
  signals: SignalCheck[];
  aiVisualInspection: {
    passed: boolean;
    confidence: number;
    microFontFidelity: number;
    tamperSealIntegrity: number;
    colorSpectrumMatch: number;
    findings: string[];
  };
  telemetry: {
    scannedAt: string;
    nodeRegistry: string;
    gs1RawString: string;
    sha256Hash: string;
    ecdsaSignature: string;
    responseTimeMs: number;
  };
}

export interface AnomalyReport {
  id: string;
  gtin: string;
  medicineName: string;
  batchNumber: string;
  serialNumber: string;
  pharmacyName: string;
  city: string;
  purchaseDate: string;
  flags: string[];
  comments: string;
  reporterRole: string;
  createdAt: string;
  ticketId: string;
}
