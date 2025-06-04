import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: String,
    level: Number
});

const contentSchema = new mongoose.Schema({
    hero: {
        title: String,
        subtitle: String,
        description: String,
        profileImage: String
    },
    stats: {
        yearsExperience: Number,
        projectsCompleted: Number,
        satisfiedClients: Number
    },
    skills: {
        programming: [skillSchema],
        visualization: [skillSchema],
        databases: [skillSchema],
        cloudAndTools: [skillSchema]
    }
}, {
    timestamps: true
});

export const Content = mongoose.model('Content', contentSchema); 