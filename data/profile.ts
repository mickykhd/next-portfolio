export const siteConfig = {
  baseUrl: "https://ashrumochan.com",
  authorHandle: "ashrumochan",
};

export const profile = {
  personal: {
    name: "Ashrumochan Badajena",
    email: "ashrumochan7@gmail.com",
    location: "Khordha, Odisha, India",
    roles: ["Software Developer", "React JS Developer", "Frontend Engineer"],
    tagline:
      "MERN Stack Developer specializing in scalable React architectures and modern frontend systems.",
  },
  about:
    "I am a MERN Stack developer focused on building scalable, performant, and user-centric web applications. With strong expertise in React, TypeScript, Redux Toolkit, and modern routing patterns, I design maintainable frontend architectures that integrate seamlessly with Node.js backends. I am passionate about clean code, UI performance, and continuous learning.",
  skills: {
    frontend: [
      "ReactJS",
      "TypeScript",
      "JavaScript",
      "Redux Toolkit",
      "Redux.js",
      "React Router (v6+)",
      "Material UI",
      "HTML5",
      "CSS3",
    ],
    backend: ["Node.js", "Express.js", "MongoDB", "Mongoose", "MySQL"],
    tools: ["Git", "Microsoft SharePoint"],
  },
  experience: [
    {
      company: "Soffront CRM, Kolkata, India",
      role: "Frontend Developer",
      duration: "May 2024 - Present",
      highlights: [
        "Designed and enhanced UI using React JS and Material UI.",
        "Integrated Moneris payment provider.",
        "Improved UX and performance across core modules.",
        "Managed complex state with Redux.",
      ],
      url: "https://soffront.com/",
    },
    {
      company: "2ND Venture LLC",
      role: "Software Developer",
      duration: "Feb 2020 - Feb 2024",
      highlights: [
        "Developed scalable React applications using TypeScript.",
        "Implemented Redux Toolkit for structured state management.",
        "Architected routing using React Router v6.",
        "Built reusable and modular UI components.",
      ],
    },
  ],
  projects: [
    {
      name: "The Movie Database",
      description: "Movie browsing application using TMDB API integration.",
      tech: ["React", "API Integration"],
      liveUrl: "https://moviedatabase-aa258.web.app/",
    },
    {
      name: "Quiz App",
      description: "Dynamic quiz platform with interactive question rendering.",
      tech: ["React", "State Management"],
      liveUrl: "https://quizecloneapp.web.app/",
    },
    {
      name: "Country Code Application",
      description: "Country lookup and dialing code search application.",
      tech: ["React", "API Integration"],
      liveUrl: "https://country-b73b0.web.app/",
    },
    {
      name: "Notes Application",
      description: "Full-stack MERN notes management platform.",
      tech: ["MongoDB", "Express", "React", "Node.js"],
      liveUrl: "https://notes-app-u468.onrender.com/",
    },
  ],
  education: [
    {
      institution: "Sophitorium Engineering College",
      degree: "B.Tech in Electrical Engineering",
      cgpa: "7.9",
    },
    {
      institution: "Gandhi Institute of Technology and Management, Bhubaneswar",
      degree: "MBA (Marketing & HR)",
      cgpa: "7.6",
    },
  ],
  certifications: [
    "JavaScript Tutorial and Projects – Udemy (John Smilga)",
    "React Tutorial and Projects – Udemy (John Smilga)",
    "NodeJS Tutorial and Projects – Udemy (John Smilga)",
  ],
  languages: [
    { language: "English", fluency: "Fluent" },
    { language: "Hindi", fluency: "Fluent" },
    { language: "Odia", fluency: "Native" },
  ],
  profiles: {
    github: { username: "mickykhd", url: "https://github.com/mickykhd" },
    linkedin: {
      url: "https://www.linkedin.com/in/ashrumochan-badajena-5a8185255/",
    },
  },
};

export type Profile = typeof profile;
