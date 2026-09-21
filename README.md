# MediVerify - Digital Medicine Verification & Traceability Platform

MediVerify is a cybersecurity-grade pharmaceutical verification platform designed for patients, pharmacists, and health authorities. It validates medicine packaging identifiers (GS1 2D DataMatrix, EAN-13, batch/lot, unique serial number, expiration date) against authoritative pharmaceutical reference databases (**AMMPS Morocco DMP** and **BDPM France ANSM**) combined with AI-assisted computer vision packaging forensics.

---

## 🌟 Key Architecture & Features

### 1. Global Visual Identity & High-Tech HUD
- **Canvas Dark Palette**: Deep Obsidian Navy (`#0A192F` / `#0B132B`) with Medical Security Teal accents (`#0D9488` / `#14B8A6`).
- **Status Indicators**:
  - **Verified / Consistent**: Emerald (`#10B981`)
  - **Suspicious / Anomaly**: Amber (`#F59E0B`)
  - **Failed / Expired**: Crimson (`#EF4444`)
- **Typography**: Plus Jakarta Sans for UI and JetBrains Mono for GTIN, serial numbers, and cryptographic SHA-256 seals.
- **Glassmorphism & HUD Elements**: Reticle crosshairs, laser beam scan sweeps, and floating live validation pills.

### 2. Multi-Signal Verification Pipeline
- **Layer 1 - Deterministic Catalog**: Resolves GTIN against official AMMPS and BDPM drug registries.
- **Layer 2 - Serialization Manifest (GS1 AI 21)**: Verifies unique serial number existence in manufacturer cryptographic manifests.
- **Layer 3 - Temporal Expiry (GS1 AI 17)**: Mathematically assesses shelf life to block expired lots.
- **Layer 4 - AI Packaging Forensics**: Inspects typography kerning, colorimetric density, and tamper-evident blister seals.
- **Layer 5 - Evidence Audit Scorecard**: Produces a transparent scorecard with SHA-256 integrity seal and printable certificate.

---

## 🧭 Page Routes & Interfaces

| Route | Interface | Purpose & Features |
|---|---|---|
| `/` | **Home & Hub** | Interactive 3D tilt pharmaceutical box with floating validation pills, credibility metrics strip, problem bento grid, 5-step interactive stepper, and 1-click test sandbox. |
| `/verify` | **Scanner Interface** | Live camera viewfinder with laser sweep, device camera switcher, drag-and-drop photo OCR upload, and manual GS1 entry form with quick-fill presets. |
| `/result` | **Evidence Scorecard** | Dynamic multi-signal scorecard with 1-click state switcher (`Consistent`, `Suspicious`, `Expired`), official AMMPS/BDPM dossier, telemetry breakdown, and audit certificate generator. |
| `/database` | **Public Drug Registry** | Searchable catalog indexing official medications from AMMPS (Morocco) and BDPM (France) with filters by dosage form and registry. |
| `/report` | **Anomaly Report** | Crowdsourced regulatory reporting form with pre-filled identifiers, anomaly checkboxes, photo evidence upload, and tracking ticket dispatch. |

---

## 🧪 Built-in Prototype Presets

MediVerify includes instant presets to demonstrate all verification states out of the box:

1. **Azole 400 mg** (*Laboratoires Promopharm / Laprophan* - AMMPS)
   - **Status**: `CONSISTENT` (Green)
   - **Result**: All cryptographic & physical packaging signals validated.
2. **Doliprane 1000 mg** (*Sanofi Winthrop* - BDPM)
   - **Status**: `SUSPICIOUS` (Amber)
   - **Result**: Legitimate catalog match, but unrecorded/cloned serial number.
3. **Amoxicilline 500 mg** (*Laboratoires Laprophan* - AMMPS)
   - **Status**: `EXPIRED` (Red)
   - **Result**: Authentic lot, but expiration date has elapsed. Prohibited from dispensing.

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Marwane-Haddane/medicine-verification-project-competition.git
cd medicine-verification-project-competition

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## 🛡️ Regulatory Disclaimer
MediVerify assists healthcare professionals and consumers by analyzing GS1 packaging identifiers and official public registry datasets. This platform is an assistive verification technology and does not replace the professional advice or clinical diagnosis of a licensed pharmacist or physician.
