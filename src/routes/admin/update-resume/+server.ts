
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ContentService } from '$lib/supabase';
import type { Content } from '$lib/types/content';

export const GET: RequestHandler = async ({ locals }) => {
    // Ensure user is authenticated (admin)
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Fetch current content to preserve ID and other fields if needed, 
        //, though we will largely overwrite with resume data.
        const currentContent = await ContentService.getContent();

        // 2. Define the new content from Resume
        const resumeData: Partial<Content> = {
            hero: {
                name: "Kamrul Hasan Shemul",
                role: "Product Manager & Data Analyst",
                headline: "Turning Data into Actionable Insights",
                subheadline: "4+ Years of Experience in Product Management & Data Analysis",
                title: "Product Manager & Data Analyst",
                subtitle: "Specializing in Growth, Operations, and Analytics",
                description: "Project Manager and Data Analyst with 4 years of experience in owning products and leading teams to deliver projects successfully on time. Experienced in data analysis, data visualization (including Looker Studio), budget forecasting, and growth analysis.",
                profileImage: currentContent?.hero?.profileImage || ""
            },
            contact: {
                email: "Kamrulhasanshemul@gmail.com",
                phone: "+61-0480757607",
                location: "2/52 Durham Street, St Lucia QLD 4067",
                github: "https://github.com/Kamrulhasanshemul",
                linkedin: "https://linkedin.com/in/kamrulhasanshemul",
                // Re-added website from resume if valid, or keep existing
            } as any,
            experience: [
                {
                    company: "Ajke - C/o Ajke Tech Limited",
                    position: "Product Manager & COO",
                    period: "Dec 2024 - Present",
                    location: "Dhaka, Bangladesh",
                    description: "Co-founded and launched Ajke.app, a quick commerce platform.",
                    achievements: [
                        "Generated 1L+ BDT monthly revenue with 60% repeat customers.",
                        "Integrated vendor products and optimized operations for ultra-fast delivery.",
                        "Selected for NSU Startup Next incubator."
                    ]
                },
                {
                    company: "DeliveryHobe - C/o Shimahin Limited",
                    position: "Project Manager (Technical)",
                    period: "June 2023 - Feb 2025",
                    location: "Dhaka, Bangladesh",
                    description: "Led end-to-end planning, research, and deployment of new tech-driven projects.",
                    achievements: [
                        "Engineered a 5x increase in weekly GMV within 2 months through data-driven insights.",
                        "Managed scaling process, serving 80,000+ customers in under 6 months.",
                        "Secured pre-seed funding from Dekko Isho Venture Capital.",
                        "Achieved a consistent 19% MoM growth rate by optimizing customer acquisition.",
                        "Enhanced customer retention by 2x through targeted UX improvements.",
                        "Forecasted budgets and set KPIs aligned with strategic goals."
                    ]
                },
                {
                    company: "DeliveryHobe - C/o Shimahin Limited",
                    position: "Project Manager Associate (Technical)",
                    period: "Feb 2021 - May 2023",
                    location: "Dhaka, Bangladesh",
                    description: "Developed and maintained reporting systems and operational workflows.",
                    achievements: [
                        "Reduced delivery times from 2–3 hours to 45 minutes via route optimization algorithms.",
                        "Increased delivery success rate from 68% to 92% using ML models.",
                        "Designed departmental workflows and SOPs to streamline operations.",
                        "Led post-project evaluations and milestone reviews."
                    ]
                }
            ],
            education: [
                {
                    institution: "James Cook University, Brisbane",
                    degree: "Master's in Data Science (Professional)",
                    period: "March 2025 - Present",
                    description: "In Progress"
                },
                {
                    institution: "Daffodil International University",
                    degree: "Bachelor of Science in Computer Science and Engineering",
                    period: "Jan 2016 - Jan 2020",
                    description: "CGPA: 3.13"
                }
            ],
            projects: [
                {
                    title: "Executive Excellence Dashboard",
                    description: "Executive-level analytics dashboard integrated with PostgreSQL as the single source of truth.",
                    technologies: ["Looker Studio", "PostgreSQL"],
                    impact: "Improved decision-making efficiency by 40% through real-time data insights.",
                    link: "#",
                    image: ""
                },
                {
                    title: "Operations Excellence Dashboard",
                    description: "Performance monitoring dashboard to enhance operational efficiency.",
                    technologies: ["Looker Studio", "PostgreSQL"],
                    impact: "Helped reduce delivery delays by 25% through weekly performance analysis.",
                    link: "#",
                    image: ""
                }
            ],
            skills: {
                programming: [
                    { name: "SQL", level: 90 },
                    { name: "Python", level: 80 }
                ],
                visualization: [
                    { name: "Tableau", level: 90 },
                    { name: "Google Data Studio (Looker)", level: 95 },
                    { name: "Microsoft Power BI", level: 90 }
                ],
                databases: [
                    { name: "PostgreSQL", level: 85 }
                ],
                cloudAndTools: [
                    { name: "Git & GitHub", level: 90 },
                    { name: "Jira & Confluence", level: 95 },
                    { name: "Notion", level: 90 },
                    { name: "Asana", level: 85 },
                    { name: "Microsoft Office Suite", level: 95 }
                ]
            },
            stats: {
                yearsExperience: 4,
                projectsCompleted: 15,
                satisfiedClients: 50
            },
            // Preserve other fields if they exist, or provide defaults
            services: currentContent?.services || [],
            about: currentContent?.about || {
                description: "Project Manager and Data Analyst with 4 years of experience...",
                technicalExpertise: ["Data Analysis", "Product Management", "Operations"],
                industryFocus: ["E-commerce", "Logistics", "Quick Commerce"]
            }
        };

        // Correct contact info specifically
        resumeData.contact = {
            email: "Kamrulhasanshemul@gmail.com",
            phone: "+61-0480757607",
            location: "2/52 Durham Street, St Lucia QLD 4067",
            github: "https://github.com/Kamrulhasanshemul",
            linkedin: "https://linkedin.com/in/kamrulhasanshemul"
        };

        // Merge and Save
        const finalContent = { ...currentContent, ...resumeData } as Content;

        const result = await ContentService.saveContent(finalContent);

        if (result.success) {
            return json({ success: true, message: "Resume updated successfully", content: result.data });
        } else {
            return json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (error) {
        return json({ success: false, error: String(error) }, { status: 500 });
    }
};
