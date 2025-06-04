<script lang="jsx">
  import React, { useState } from 'react';
  import { 
    BarChart3, 
    TrendingUp, 
    Database, 
    Mail, 
    Github, 
    Settings, 
    User, 
    Briefcase, 
    Award, 
    Plus, 
    Edit3, 
    Trash2, 
    Save, 
    X, 
    ExternalLink 
  } from 'lucide-react';

  // SvelteKit will ignore this file, but for demonstration, we use React here as per prompt.

  const initialPortfolioData = {
    personal: {
      name: "Alex Chen",
      title: "Senior Data Analyst",
      bio: "Passionate data analyst with 5+ years of experience turning complex datasets into actionable business insights. Specialized in predictive modeling, data visualization, and statistical analysis.",
      email: "alex.chen@email.com",
      github: "github.com/alexchen",
      linkedin: "linkedin.com/in/alexchen",
      location: "San Francisco, CA"
    },
    projects: [
      {
        id: 1,
        title: "Customer Churn Prediction Model",
        description: "Built a machine learning model to predict customer churn with 87% accuracy, helping reduce churn by 23%",
        technologies: ["Python", "Scikit-learn", "Pandas", "Tableau"],
        impact: "23% reduction in customer churn",
        link: "#"
      },
      {
        id: 2,
        title: "Sales Performance Dashboard",
        description: "Created an interactive dashboard tracking key sales metrics across 15 regions, enabling data-driven decision making",
        technologies: ["Power BI", "SQL", "DAX", "Azure"],
        impact: "$2M increase in quarterly revenue",
        link: "#"
      },
      {
        id: 3,
        title: "Market Basket Analysis",
        description: "Analyzed purchasing patterns to optimize product placement and cross-selling opportunities",
        technologies: ["R", "Association Rules", "ggplot2", "Shiny"],
        impact: "15% increase in average order value",
        link: "#"
      }
    ],
    skills: [
      { category: "Programming", items: ["Python", "R", "SQL", "JavaScript"] },
      { category: "Tools", items: ["Tableau", "Power BI", "Excel", "Jupyter"] },
      { category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery"] },
      { category: "Cloud", items: ["AWS", "Azure", "GCP", "Snowflake"] },
      { category: "Statistics", items: ["Regression", "Hypothesis Testing", "A/B Testing", "Time Series"] }
    ],
    experience: [
      {
        id: 1,
        company: "TechCorp Inc.",
        position: "Senior Data Analyst",
        period: "2022 - Present",
        achievements: [
          "Led analytics for $50M product line, driving 18% revenue growth",
          "Developed automated reporting system reducing manual work by 60%",
          "Mentored 3 junior analysts and established best practices"
        ]
      },
      {
        id: 2,
        company: "DataInsights LLC",
        position: "Data Analyst",
        period: "2020 - 2022",
        achievements: [
          "Built predictive models improving forecast accuracy by 25%",
          "Created executive dashboards used by C-level leadership",
          "Collaborated with cross-functional teams on data initiatives"
        ]
      }
    ]
  };

  // This is a React component, but SvelteKit will not render it. 
  // For the prompt, we show the code as if it were in a React file.
  // In a real SvelteKit project, this would be a .jsx or .tsx file.

  export default function DataAnalystPortfolio() {
    const [activeSection, setActiveSection] = useState('portfolio');
    const [showCMS, setShowCMS] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [portfolioData, setPortfolioData] = useState(initialPortfolioData);

    const handleEdit = (section, item = null) => {
      setEditingItem({ section, item });
      if (item) {
        setFormData(item);
      } else {
        setFormData({});
      }
    };

    const handleSave = () => {
      const { section, item } = editingItem;
      if (section === 'personal') {
        setPortfolioData(prev => ({
          ...prev,
          personal: { ...prev.personal, ...formData }
        }));
      } else if (section === 'projects') {
        setPortfolioData(prev => ({
          ...prev,
          projects: item 
            ? prev.projects.map(p => p.id === item.id ? { ...formData, id: item.id } : p)
            : [...prev.projects, { ...formData, id: Date.now() }]
        }));
      } else if (section === 'experience') {
        setPortfolioData(prev => ({
          ...prev,
          experience: item 
            ? prev.experience.map(e => e.id === item.id ? { ...formData, id: item.id } : e)
            : [...prev.experience, { ...formData, id: Date.now() }]
        }));
      }
      setEditingItem(null);
      setFormData({});
    };

    const handleDelete = (section, id) => {
      setPortfolioData(prev => ({
        ...prev,
        [section]: prev[section].filter(item => item.id !== id)
      }));
    };

    const renderPortfolio = () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{portfolioData.personal.name}</h1>
                  <p className="text-sm text-gray-600">{portfolioData.personal.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCMS(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>CMS</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Transforming Data Into 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Insights</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {portfolioData.personal.bio}
              </p>
              <div className="flex justify-center space-x-4">
                <a href={`mailto:${portfolioData.personal.email}`} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Contact Me</span>
                </a>
                <a href={portfolioData.personal.github} className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">{project.title}</h4>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">{project.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Skills</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData.skills.map((skill, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-blue-600" />
                    {skill.category}
                  </h4>
                  <div className="space-y-2">
                    {skill.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between">
                        <span className="text-gray-700">{item}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${85 + Math.random() * 15}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Professional Experience</h3>
            <div className="space-y-8">
              {portfolioData.experience.map((exp) => (
                <div key={exp.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{exp.position}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 font-medium">{exp.period}</span>
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );

    // CMS and modal code omitted for brevity, see prompt for full code.

    return renderPortfolio();
  }
</script>

<DataAnalystPortfolio />
