export interface Skill {
    name: string;
    level: number;
}

export interface Hero {
    title: string;
    subtitle: string;
    description: string;
    profileImage: string;
}

export interface Stats {
    yearsExperience: number;
    projectsCompleted: number;
    satisfiedClients: number;
}

export interface Skills {
    programming: Skill[];
    visualization: Skill[];
    databases: Skill[];
    cloudAndTools: Skill[];
}

export interface Content {
    hero: Hero;
    stats: Stats;
    skills: Skills;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
} 