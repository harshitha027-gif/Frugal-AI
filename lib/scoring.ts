export interface ScoringInput {
    min_ram: string
    storage_footprint: string
    is_offline_capable: boolean
    supported_hardware: string[]
    deployment_context: string[]
    has_weights: boolean
    license_ok: boolean
}

export interface FrugalScores {
    total: number
    footprint: number
    hardware: number
    energy: number
    tco: number
    data: number
}

export function calculateFrugalScore(input: ScoringInput): FrugalScores {
    // 1. Model Footprint (30%)
    // Logic: Lower RAM and Storage = Higher Score
    let score_footprint = 0;

    // RAM Check
    if (input.min_ram.includes('< 1GB')) score_footprint += 15;
    else if (input.min_ram.includes('4GB')) score_footprint += 12;
    else if (input.min_ram.includes('8GB')) score_footprint += 8;
    else score_footprint += 4;

    // Storage Check (Parse simple string like "2GB" or "500MB")
    // Fallback logic for now
    if (input.storage_footprint) {
        const val = parseFloat(input.storage_footprint);
        if (input.storage_footprint.toLowerCase().includes('mb')) score_footprint += 15;
        else if (val < 2) score_footprint += 12; // < 2GB
        else if (val < 5) score_footprint += 8;
        else score_footprint += 4;
    } else {
        score_footprint += 5; // Default neutral
    }
    // Cap at 30
    score_footprint = Math.min(30, score_footprint);


    // 2. Hardware Agnosticism (20%)
    // Logic: CPU/Edge support = Good. GPU only = Lower.
    let score_hardware = 0;
    const hw = input.supported_hardware || [];
    if (hw.includes('CPU')) score_hardware += 8;
    if (hw.includes('Edge/NPU') || hw.includes('Apple Silicon')) score_hardware += 8;
    if (hw.includes('GPU')) score_hardware += 4;
    // Cap at 20
    score_hardware = Math.min(20, score_hardware);


    // 3. Energy Efficiency (25%)
    // Logic: Offline capable + Edge/CPU implies better control over energy than massive clusters
    let score_energy = 0;
    if (input.is_offline_capable) score_energy += 10;
    if (hw.includes('Edge/NPU')) score_energy += 10;
    if (hw.includes('CPU')) score_energy += 5;
    score_energy = Math.min(25, score_energy);


    // 4. Operational TCO (15%)
    // Logic: Open license + on-prem/edge deploy = Low TCO (no API costs)
    let score_tco = 0;
    if (input.license_ok) score_tco += 10; // Free to use
    if (input.deployment_context?.includes('On-prem / Sovereign')) score_tco += 5;
    score_tco = Math.min(15, score_tco);


    // 5. Data Frugality (10%)
    // Logic: Offline capable = Data stays local = Frugal/Privacy preserving
    let score_data = 0;
    if (input.is_offline_capable) score_data += 10;
    else score_data += 5; // Partial credit
    score_data = Math.min(10, score_data);


    // Total
    const total = score_footprint + score_hardware + score_energy + score_tco + score_data;

    return {
        total,
        footprint: score_footprint,
        hardware: score_hardware,
        energy: score_energy,
        tco: score_tco,
        data: score_data
    };
}
