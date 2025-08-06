export enum AccessLevel {
    OWNER = "Administrador",
    HYBRID = "Administrador",
    ADMIN = "Administrador",
    PROFESSIONAL = "Profissional",
    PATIENT = "Paciente",
}

const accessLevelMapper: Record<string, string> = {
    OWNER: AccessLevel.OWNER,
    HYBRID: AccessLevel.HYBRID,
    ADMIN: AccessLevel.ADMIN,
    PROFESSIONAL: AccessLevel.PROFESSIONAL,
    PATIENTS: AccessLevel.PATIENT
};

export function mapAccessLevel(level: string): string | undefined {
    return accessLevelMapper[level];
}