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
    title: "Task-Adaptive Humanoid",
    category: "research",
    eyebrow: "Undergraduate Robotics Research · WPI",
    period: "August 2026 — Present",
    status: "In progress",
    description:
      "Developing a humanoid with independently adjustable limb lengths so its morphology can suit the task.",
    details: [
      "Contribute to the humanoid’s mechanical design, manufacturing, and assembly.",
      "Check SolidWorks assemblies for tolerances and range of motion, and use finite element analysis to evaluate parts against a minimum factor of safety of 2.",
      "Iterate on PLA prototypes before producing carbon-fiber-filament parts and assembling them with threaded inserts, machined aluminum extrusion, and motors.",
    ],
    sections: [
      {
        heading: "Task-dependent morphology",
        body: "Prismatic limbs allow each limb length to change independently throughout a continuous range, rather than switching only between fully extended and fully retracted positions. The aim is to choose a useful morphology for the task—for example, shorter arms to reduce lifting torque or longer legs to travel farther per step.",
      },
      {
        heading: "Mechanical development",
        body: "The first phase focuses on mechanical design and fabrication. CAD assemblies help check fit and the desired motion before stress analysis and printing. PLA prototypes reveal where real-world tolerances need adjustment; checked parts are then printed in carbon-fiber filament and assembled. We are currently testing movement on one leg.",
      },
      {
        heading: "Planned control and integration",
        body: "After leg testing, I plan to join the reinforcement learning team to develop a morphology-agnostic walking policy for different limb lengths. Later stages include simulation-to-real transfer, upper-body assembly and teleoperation, and integration of upper- and lower-body control. A longer-term goal is a hierarchy in which a vision-language-action (VLA) agent interprets commands and a locomotion policy produces the joint motions.",
      },
    ],
    tags: ["Mechanical Design", "SolidWorks", "FEA", "Additive Manufacturing"],
    featured: true,
    art: "adaptive",
    image: "/images/projects/humanoid-prismatic-limb-prototype.jpg",
    imageAlt:
      "Prismatic humanoid limb prototype with a motor and vertical linear rails on a workbench.",
    imageCaption: "Prismatic limb prototype during mechanical assembly.",
    gallery: [
      {
        src: "/images/projects/humanoid-support-fea.webp",
        alt: "Finite element analysis view of a humanoid actuator support with a central circular opening.",
        caption: "FEA view of an actuator support.",
      },
      {
        src: "/images/projects/humanoid-mount-fea.webp",
        alt: "Finite element analysis view of a mounting plate with a large circular opening and bolt holes.",
        caption: "FEA view of a mounting plate.",
      },
      {
        src: "/images/projects/humanoid-circular-plate-fea.webp",
        alt: "Finite element analysis view of a circular plate with a central hole and perimeter openings.",
        caption: "FEA view of a circular structural plate.",
      },
      {
        src: "/images/projects/humanoid-simulation-view.webp",
        alt: "Humanoid model shown in a simulation environment.",
        caption: "Humanoid model in a simulation view.",
      },
    ],
  },
  {
    id: "pneumatic-actuators",
    title: "Smart Pneumatic Valve",
    category: "research",
    eyebrow: "Undergraduate Mechanical Engineering Research · WPI Gateway Labs",
    period: "September 2025 — May 2026",
    status: "Research design",
    description:
      "An electrically actuated pneumatic valve concept that uses heated TPE to open an air channel.",
    details: [
      "Designed a pneumatic valve around a TPE element, a PLA housing, and a silicone sealing head.",
      "Iterated on the mechanical design in Autodesk Fusion to use thermal expansion for electrical actuation.",
      "Collaborated with a mechanical engineering PhD student to implement the valve and actuate pneumatic cells individually.",
    ],
    sections: [
      {
        heading: "Valve construction",
        body: "The TPE valve element contains a channel for a 0.1 mm-diameter wire and a sealing head made from silicone gel. A cylindrical PLA housing supports the valve and includes a bottom opening. A TPE top cover uses two bolts for electrical connections while keeping the enclosure airtight.",
      },
      {
        heading: "Actuation concept",
        body: "Power applied through the bolts heats the wire to approximately 60°C. The proposed mechanism uses the resulting expansion of the TPE to bend the valve upward, open the bottom hole, and allow air to flow. With power removed, the wire cools and the valve returns to its sealed position. The design can be controlled by a microcontroller or a simple on/off power source.",
      },
      {
        heading: "Design goals",
        body: "The design focuses on low cost, low weight, a compact enclosure, and reliable pneumatic actuation.",
      },
    ],
    tags: [
      "Autodesk Fusion",
      "Pneumatic Actuation",
      "TPE",
      "Thermal Expansion",
    ],
    featured: true,
    art: "pneumatic",
    image: "/images/projects/pneumatic-valve-top-cover.webp",
    imageAlt:
      "CAD rendering of a valve top cover with two connection bolts beside a central cylinder.",
    imageCaption: "Top cover with two electrical connection bolts.",
    gallery: [
      {
        src: "/images/projects/pneumatic-valve-operation-sketch.webp",
        alt: "Two hand-drawn cross sections showing a valve element seated and deflected above a bottom opening.",
        caption: "Hand-drawn concept for closed and open valve positions.",
      },
      {
        src: "/images/projects/pneumatic-valve-housing.webp",
        alt: "CAD rendering of a cylindrical valve housing with a central port in its base.",
        caption: "Cylindrical valve housing and bottom port.",
      },
      {
        src: "/images/projects/pneumatic-valve-flexible-element.webp",
        alt: "CAD rendering of a four-armed valve element with a raised central section.",
        caption: "Four-armed valve element in CAD.",
      },
    ],
  },
  {
    id: "variable-contact-sole",
    title: "Variable Contact-Area Humanoid Sole",
    category: "research",
    eyebrow: "Humanoid Foot Design Research",
    period: null,
    status: "In progress",
    description:
      "Developing a modular humanoid foot sole with sensing, cushioning, and a tread designed to vary contact area as the foot rolls.",
    details: [
      "Design a modular sole that separates sensing, cushioning, and ground contact into distinct layers.",
      "Explore a tread pattern intended to change the effective contact area during the rolling motion of a step.",
    ],
    sections: [
      {
        heading: "Layered sole design",
        body: "The design separates the sensor layer into sections to isolate each sensor’s sensing area. A cushion layer is intended to protect the sensors and reduce impact on the joints, while a final tread layer provides ground contact. The current, simpler design uses a regular tread pattern.",
      },
      {
        heading: "Planned contact pattern and sensing",
        body: "We are working toward a sinusoidal tread pattern that changes the effective area of contact as the foot rolls, with the aim of increasing friction where it is needed during a step. Planned sensor connections to an ESP controller would provide roll and pitch values.",
      },
    ],
    tags: [
      "Humanoid Robotics",
      "Modular Design",
      "Foot Sensing",
      "Contact Area",
    ],
    featured: false,
    art: "sole",
    image: "/images/projects/humanoid-sole-sinusoidal-model.webp",
    imageAlt:
      "Three-dimensional plot of a sinusoidal surface with contact-point paths shown above it.",
    imageCaption: "Sinusoidal contact-surface model and contact paths.",
    gallery: [
      {
        src: "/images/projects/humanoid-sole-layered-design.jpg",
        alt: "Hand-drawn modular sole design showing cushion, sensor, and tread layers, with side and top views.",
        caption:
          "Modular sole sketch showing the layers and current regular tread pattern.",
      },
    ],
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
    image: "/images/projects/nan-011-quadruped-cad.webp",
    imageAlt:
      "CAD rendering of the Nan-011 quadruped with four legs around a rounded body.",
    imageCaption: "Nan-011 quadruped CAD model.",
    gallery: [
      {
        src: "/images/projects/nan-011-simulation-instances.webp",
        alt: "Simulation interface displaying many yellow Nan-011 quadruped models arranged on a grid.",
        caption: "Multiple quadruped instances in a simulation scene.",
      },
    ],
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
      "A five-bar parallel manipulator mounted on a Romi robot, using two servos and inverse kinematics to move cubes between shelves.",
    details: [
      "Designed a five-bar mechanism driven by two base-mounted servos with a 2:1 gear reduction.",
      "Modeled the mechanism in SolidWorks, checking tolerances, gear meshing, link lengths, and stresses through assembly modeling and finite element analysis.",
      "Iterated on 3D-printed parts to account for real-world tolerances and addressed a mismatch between the Romi expansion plate’s mounting holes and the reference model.",
      "Integrated servo electronics and non-blocking inverse-kinematics control so the end effector could move by direction rather than individual servo commands.",
    ],
    sections: [
      {
        heading: "Overview",
        body: "Designed, manufactured, assembled, and programmed a parallel manipulator for a Romi chassis. The mechanism had to reach three positions on a shelf and transfer cubes between shelves at different heights and positions.",
      },
      {
        heading: "Mechanical design and iteration",
        body: "The design began with a sketched five-bar linkage and two servos at the base. In SolidWorks, I checked gear meshing distances, link lengths for the required horizontal and vertical reach, and assembly fit. Finite element analysis identified the most highly stressed link and helped check the links’ factors of safety. Several printing iterations refined the fit before assembly, where the actual expansion plate’s hole layout required further adaptation.",
      },
      {
        heading: "Electronics and control",
        body: "Connected the Romi’s SDA and SCL lines to a PCA9685 servo controller over I²C, with a buck converter stepping the switched supply down to 6 V. Non-blocking code used a checker-handler structure to update servo positions while accepting console inputs. Inverse kinematics converted up, down, left, and right end-effector commands into the required servo positions.",
      },
    ],
    tags: [
      "Parallel Manipulators",
      "Inverse Kinematics",
      "SolidWorks",
      "FEA",
      "Romi",
      "Embedded Control",
    ],
    featured: false,
    art: "rbe2001",
    image: "/images/projects/rbe-2001-romi-assembly.webp",
    imageAlt:
      "CAD assembly of a two-servo parallel manipulator on a Romi chassis beside a three-level shelf.",
    imageCaption: "Romi-mounted parallel manipulator and target shelf in CAD.",
    gallery: [
      {
        src: "/images/projects/rbe-2001-geared-link-fea.webp",
        alt: "Finite element analysis view of a geared manipulator link, with a color contour and legend.",
        caption: "FEA view of a geared manipulator link.",
      },
      {
        src: "/images/projects/rbe-2001-bracket-fea.webp",
        alt: "Finite element analysis view of a bent structural bracket, with a color contour and legend.",
        caption: "FEA view of a structural bracket.",
      },
    ],
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
    image: "/images/projects/rbe-3001-ball-sorting-workcell.webp",
    imageAlt:
      "Robotic arm positioned over colored balls on a checkered work surface.",
    imageCaption: "Vision-guided ball-sorting workcell.",
    gallery: [
      {
        src: "/images/projects/rbe-3001-arm-workbench.webp",
        alt: "Robotic arm and gripper on a workbench beside a laptop and checkered work surface.",
        caption: "Robotic arm setup on the lab workbench.",
      },
      {
        src: "/images/projects/rbe-3001-sorted-balls.webp",
        alt: "Red, orange, yellow, and green balls grouped in labeled cups beside the robotic arm.",
        caption: "Colored balls grouped in labeled collection cups.",
      },
    ],
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
    image: "/images/projects/rbe-3002-turtlebot-hardware.webp",
    imageAlt:
      "Lidar-equipped TurtleBot on a workbench, showing its stacked electronics and two drive wheels.",
    imageCaption: "Lidar-equipped TurtleBot used for autonomous navigation.",
    gallery: [
      {
        src: "/images/projects/rbe-3002-navigation-map.webp",
        alt: "Navigation visualization showing mapped boundaries, a colored costmap, and a path through the environment.",
        caption: "Mapped environment and navigation visualization.",
      },
      {
        src: "/images/projects/rbe-3002-obstacle-arena.webp",
        alt: "TurtleBot in a tabletop test arena built from cardboard barriers.",
        caption: "Tabletop obstacle arena for navigation testing.",
      },
    ],
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
