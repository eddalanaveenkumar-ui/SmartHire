const { OpenAI } = require('openai');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const AIRecommendation = require('../models/AIRecommendation');
const { AppError } = require('../utils/AppError');

let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const getAIResponse = async (systemPrompt, userPrompt) => {
  if (!openai) {
    return simulateAIResponse(systemPrompt, userPrompt);
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return simulateAIResponse(systemPrompt, userPrompt);
  }
};

const simulateAIResponse = (systemPrompt, userPrompt) => {
  if (systemPrompt.includes('job recommendations')) {
    return {
      recommendations: [
        { jobId: null, title: 'Senior React Developer', company: 'TechCorp', matchPercentage: 92, reasons: ['React expertise', '5+ years experience', 'Leadership skills'] },
        { jobId: null, title: 'Full Stack Engineer', company: 'StartupXYZ', matchPercentage: 85, reasons: ['MERN stack experience', 'Full stack capability'] },
        { jobId: null, title: 'Frontend Lead', company: 'DesignHub', matchPercentage: 78, reasons: ['UI/UX skills', 'Team management'] }
      ]
    };
  }
  if (systemPrompt.includes('resume analysis')) {
    return {
      score: 82,
      strengths: ['Strong technical skills', 'Clear career progression', 'Relevant certifications'],
      gaps: ['Missing leadership experience', 'Could add more quantifiable achievements'],
      suggestions: ['Add more metrics to experience section', 'Include a summary/profile section'],
      matchPercentage: 85
    };
  }
  if (systemPrompt.includes('career advice')) {
    return {
      suggestions: ['Consider upskilling in cloud technologies', 'Build a strong portfolio with real projects', 'Network with industry professionals'],
      recommendedRoles: ['Senior Developer', 'Tech Lead', 'Solutions Architect'],
      learningPath: ['Advanced System Design', 'Cloud Architecture (AWS/Azure)', 'Microservices']
    };
  }
  if (systemPrompt.includes('skill match')) {
    return {
      matchingSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      missingSkills: ['TypeScript', 'AWS', 'Docker'],
      overallMatch: 75,
      recommendation: 'Focus on learning TypeScript and cloud deployment'
    };
  }
  if (systemPrompt.includes('applicant ranking')) {
    return {
      rankedApplicants: [],
      topCandidate: { name: '', score: 0, strengths: [] },
      summary: 'AI-powered ranking completed successfully'
    };
  }
  return { message: 'AI analysis completed' };
};

const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('User not found', 404);

    const cached = await AIRecommendation.findOne({
      user: req.userId,
      type: 'job_recommendation',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    const jobs = await Job.find({ status: 'active' }).limit(50).populate('recruiter', 'name');
    
    const userSkills = user.skills || [];
    const userExperience = user.experience || [];
    const userEducation = user.education || [];

    const systemPrompt = `You are an AI job recommendation engine. Analyze the candidate's profile and available jobs to provide personalized recommendations. Respond in JSON format.`;

    const userPrompt = JSON.stringify({
      candidate: {
        skills: userSkills,
        experience: userExperience,
        education: userEducation,
        headline: user.headline,
        location: user.location
      },
      availableJobs: jobs.map(j => ({
        _id: j._id,
        title: j.title,
        company: j.company,
        location: j.location,
        type: j.type,
        skills: j.skills,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        recruiter: j.recruiter?.name
      }))
    });

    const aiResponse = await getAIResponse(systemPrompt, userPrompt);

    const recommendation = await AIRecommendation.create({
      user: req.userId,
      type: 'job_recommendation',
      recommendations: (aiResponse.recommendations || []).map(r => ({
        ...r,
        jobId: jobs.find(j => j.title === r.title)?._id || null
      })),
      rawResponse: aiResponse
    });

    res.json({
      success: true,
      data: recommendation,
      cached: false
    });
  } catch (error) {
    next(error);
  }
};

const analyzeResume = async (req, res, next) => {
  try {
    const { jobId, skills, experience } = req.body;
    const user = await User.findById(req.userId);

    const systemPrompt = `You are an AI resume analyzer. Analyze the candidate's profile against job requirements and provide detailed feedback. Respond in JSON format.`;

    let jobDetails = null;
    if (jobId) {
      jobDetails = await Job.findById(jobId);
    }

    const userPrompt = JSON.stringify({
      candidate: {
        skills: skills || user.skills,
        experience: experience || user.experience,
        education: user.education
      },
      job: jobDetails ? {
        title: jobDetails.title,
        skills: jobDetails.skills,
        requirements: jobDetails.requirements,
        experienceLevel: jobDetails.experienceLevel
      } : null
    });

    const aiResponse = await getAIResponse(systemPrompt, userPrompt);

    const analysis = await AIRecommendation.create({
      user: req.userId,
      type: 'resume_analysis',
      analysis: {
        score: aiResponse.score || 75,
        strengths: aiResponse.strengths || [],
        gaps: aiResponse.gaps || [],
        suggestions: aiResponse.suggestions || []
      },
      rawResponse: aiResponse
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

const getCareerAdvice = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    const systemPrompt = `You are an AI career coach. Analyze the candidate's profile and provide personalized career advice. Respond in JSON format.`;

    const userPrompt = JSON.stringify({
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      headline: user.headline
    });

    const aiResponse = await getAIResponse(systemPrompt, userPrompt);

    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

const rankApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) throw new AppError('Job not found', 404);

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email skills experience education');

    const systemPrompt = `You are an AI recruitment assistant. Rank applicants based on their fit for the job requirements. Respond in JSON format with ranked applicants array, scores, and reasoning.`;

    const userPrompt = JSON.stringify({
      job: {
        title: job.title,
        skills: job.skills,
        requirements: job.requirements,
        experienceLevel: job.experienceLevel
      },
      applicants: applications.map(app => ({
        id: app._id,
        name: app.applicant.name,
        skills: app.applicant.skills,
        experience: app.applicant.experience,
        education: app.applicant.education,
        aiScore: app.aiScore
      }))
    });

    const aiResponse = await getAIResponse(systemPrompt, userPrompt);

    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  analyzeResume,
  getCareerAdvice,
  rankApplicants
};
