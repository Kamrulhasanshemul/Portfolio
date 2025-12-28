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

export interface About {
	description: string;
	technicalExpertise: string[];
	industryFocus: string[];
}

export interface Service {
	title: string;
	description: string;
	icon: string; // Icon name from lucide
}

export interface Project {
	title: string;
	description: string;
	technologies: string[];
	impact: string;
	link: string;
	image: string;
}

export interface Experience {
	company: string;
	position: string;
	period: string;
	location: string;
	description: string;
	achievements: string[];
}

export interface Contact {
	email: string;
	phone: string;
	location: string;
	github: string;
	linkedin: string;
}

export interface Content {
	hero: Hero;
	stats: Stats;
	about: About;
	services: Service[];
	projects: Project[];
	skills: Skills;
	experience: Experience[];
	contact: Contact;
	_id?: string;
	createdAt?: string;
	updatedAt?: string;
}
