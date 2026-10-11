export const profile = {
  name: "Alejandro Matilla Calvo",
  fullName: "Alejandro Matilla Calvo",
  portrait: null,
  role: "Robotics & Mechanical Engineering Student",
  tagline: "Exploring how robots move, adapt, and interact with the world.",
  description:
    "I study robotics and mechanical engineering at Worcester Polytechnic Institute. My work brings together mechanical design, embedded systems, and robot control—from adaptable robots to smart pneumatic actuators.",
  location: "Greater Boston, Massachusetts",
  email: "alejandromatillacalvo@gmail.com",
  graduation: "May 2028",
  publicationStatus:
    "My research is ongoing, and our team is working toward our first publication.",
};

export const education = [
  {
    institution: "Worcester Polytechnic Institute",
    shortName: "WPI",
    location: "Worcester, Massachusetts",
    degree: "B.S. in Robotics Engineering & B.S. in Mechanical Engineering",
    period: "Expected May 2028",
    description:
      "Studying the mechanics, electronics, and software that make robotic systems possible, with coursework spanning thermodynamics, fluids, embedded systems, and object-oriented design.",
    courses: [
      "Thermodynamics",
      "Fluids",
      "Object-Oriented Design",
      "Embedded Systems",
      "Heat Transfer",
    ],
    honors: "Dean’s List",
  },
];

export const projects = [
  {
    id: "adaptable-morphology",
    title: "Adaptable Morphology Robot",
    category: "research",
    eyebrow: "Undergraduate Robotics Research · WPI",
    period: "August 2026 — Present",
    status: "In progress",
    description:
      "Developing a robot that can adapt its physical form to operate across different environments.",
    details: [
      "Build and assemble mechanical components while iterating on the robot’s physical design.",
      "Contribute to reinforcement learning methods for robot control and adaptation.",
      "Work as part of a WPI undergraduate research team exploring adaptable morphology.",
    ],
    tags: ["Mechanical Design", "Assembly", "Reinforcement Learning"],
    featured: true,
    art: "adaptive",
  },
  {
    id: "pneumatic-actuators",
    title: "Smart Pneumatic Valve",
    category: "research",
    eyebrow: "Undergraduate Mechanical Engineering Research · WPI Gateway Labs",
    period: "September 2025 — May 2026",
    status: "Completed research work",
    description:
      "Designing a valve for a smart material actuator, with control over individual pneumatic cells.",
    details: [
      "Designed a valve for a smart material actuator.",
      "Iterated on mechanical designs in Autodesk Fusion to manufacture a part with high thermal expansion.",
      "Collaborated with a mechanical engineering PhD student to implement the valve and actuate each cell individually.",
    ],
    tags: ["Autodesk Fusion", "CAD", "Pneumatic Actuation", "EAGLE"],
    featured: true,
    art: "pneumatic",
  },
  {
    id: "variable-contact-sole",
    title: "Variable Contact-Area Humanoid Sole",
    category: "research",
    eyebrow: "Humanoid Foot Design Research",
    period: null,
    status: "Research project",
    description:
      "A humanoid foot sole designed to change its effective contact area as the foot rolls during walking.",
    details: [],
    tags: ["Humanoid Robotics", "Foot Design", "Contact Area"],
    featured: false,
    art: "sole",
  },
  {
    id: "nan-011",
    title: "Nan-011",
    category: "personal",
    eyebrow: "Personal Quadruped Robotics Project",
    period: "June 2026 — Present",
    status: "In progress",
    description:
      "Designing a quadruped robot, from its physical form and compact electronics to future autonomous behavior.",
    details: [
      "Designed the main shape of the quadruped robot.",
      "Work toward reinforcement learning for autonomous navigation and decision-making.",
      "Design an electronic architecture compact enough to integrate the robot’s required capabilities.",
    ],
    tags: ["CAD", "Python", "Isaac Sim", "Reinforcement Learning"],
    featured: false,
    art: "humanoid",
  },
  {
    id: "cnc-plotter",
    title: "Multicolor CNC Plotter",
    category: "personal",
    eyebrow: "Club Engineering Project",
    period: "September 2025 — May 2026",
    status: "Completed",
    description:
      "A Wi-Fi-controlled CNC plotter with a multicolor barrel and hardware designed around available club materials.",
    details: [
      "Developed a plotter that holds several colors in a barrel and receives commands from a device connected to the ESP’s Wi-Fi.",
      "Designed a custom clip compatible with both imperial and metric T-slots.",
      "Worked on actuation using coordinates provided by an algorithm.",
    ],
    tags: ["CAD", "Python", "Simulation", "Wi-Fi Control"],
    featured: false,
    art: "plotter",
  },
  {
    id: "rbe-2001",
    title: "RBE 2001 — Parallel Manipulator",
    category: "coursework",
    eyebrow: "RBE 2001 · WPI",
    period: null,
    status: "Coursework project",
    description:
      "A two-servo parallel manipulator mounted on a Romi robot to move cubes between shelves.",
    details: [],
    sections: [
      {
        heading: "Overview",
        body: "Designed a parallel manipulator driven by two servos and mounted on a Romi robot. The mechanism had to reach three positions on a shelf and transport cubes from one shelf to another.",
      },
      {
        heading: "Approach",
        body: "Used inverse kinematics to determine the servo positions needed to reach the shelf targets and transfer the cubes.",
      },
    ],
    tags: [
      "Parallel Manipulators",
      "Inverse Kinematics",
      "Romi",
      "Servo Control",
    ],
    featured: false,
    art: "rbe2001",
  },
  {
    id: "rbe-3001",
    title: "RBE 3001 — Vision-Guided Ball Sorting",
    category: "coursework",
    eyebrow: "RBE 3001 · WPI",
    period: null,
    status: "Coursework project",
    description:
      "A robotic arm that uses camera-based detection and kinematics to sort colored balls.",
    details: [
      "Worked with a small team to integrate computer vision, robot kinematics, and trajectory planning, sharing progress updates each week.",
    ],
    sections: [
      {
        heading: "Overview",
        body: "Used a camera to detect colored balls arranged on a checkered surface. Combined computer vision, forward and inverse kinematics, and trajectory planning to guide a robotic arm through the sorting task.",
      },
      {
        heading: "Outcome",
        body: "Compiled the final results into a detailed demo video showing the integrated system.",
      },
    ],
    tags: [
      "Computer Vision",
      "Forward & Inverse Kinematics",
      "Trajectory Planning",
    ],
    featured: false,
    art: "rbe3001",
  },
  {
    id: "rbe-3002",
    title: "RBE 3002 — Autonomous Navigation",
    category: "coursework",
    eyebrow: "RBE 3002 · WPI",
    period: null,
    status: "Coursework project",
    description:
      "A lidar-equipped TurtleBot that maps an unknown space and plans a safe route through it.",
    details: [
      "Collaborated using Git and developed the robot’s programming and control with ROS (Robot Operating System).",
    ],
    sections: [
      {
        heading: "Overview",
        body: "Programmed a lidar-equipped TurtleBot to map an unknown space using SLAM (Simultaneous Localization and Mapping), then plan and follow a route through that environment.",
      },
      {
        heading: "Approach",
        body: "Developed A* search to find a path while avoiding obstacles and keeping the robot near the center of hallways, away from walls. Used pure pursuit control to reliably follow the planned path.",
      },
      {
        heading: "Outcome",
        body: "Achieved autonomous exploration of an unknown map without collisions, identifying a start position and safely navigating to a drop-off location.",
      },
    ],
    tags: ["ROS", "SLAM", "A* Search", "Pure Pursuit", "Git"],
    featured: false,
    art: "rbe3002",
  },
];

export const publications = [];

export const experience = [
  {
    id: "id-tech",
    title: "Robotics Instructor",
    organization: "iD Tech · MIT campus",
    location: "Boston, Massachusetts",
    period: "June 2026 — August 2026",
    description:
      "Teaching robotics through hands-on design, construction, and programming.",
    details: [
      "Taught VEX robotics, including autonomous and driver-controlled operation.",
      "Guided students through mechanical and programming challenges during multi-day projects.",
      "Adapted instruction to different learning styles and experience levels.",
    ],
  },
  {
    id: "stem-tutor",
    title: "STEM Tutor",
    organization: "STEM tutoring",
    location: "Madrid, Spain",
    period: "January 2023 — June 2025",
    description:
      "Helping high-school students build confidence in STEM problem-solving.",
    details: [
      "Tutored physics, mathematics, technical drawing, and chemistry.",
      "Emphasized conceptual understanding, engineering reasoning, and clear problem-solving methods.",
      "Developed tailored explanations for mechanics and mathematics concepts.",
    ],
  },
];

export const skills = [
  {
    label: "Mechanical & Fabrication",
    items: ["SolidWorks", "AutoCAD", "Autodesk Fusion", "Soldering"],
  },
  {
    label: "Programming & Robotics",
    items: ["Java", "C++", "Python", "Embedded Systems Programming"],
  },
  {
    label: "Languages",
    items: [
      "Spanish · Native",
      "English · Proficient",
      "French · Advanced",
      "Italian · Competent",
    ],
  },
];
