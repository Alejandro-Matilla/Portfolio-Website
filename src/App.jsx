import React, { useCallback, useEffect, useRef, useState } from "react";
import { publicAsset } from "./assets.js";
import { profile, education, projects, publications } from "./data.js";

const categoryLabel = {
  research: "Research",
  personal: "Personal project",
  coursework: "Coursework",
};
const resumeUrl = publicAsset("/documents/Alejandro-Matilla-Resume.pdf");
const projectHref = (project) => `#/projects/${project.id}`;

function readRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === "/") return { page: "home" };
  if (hash === "/projects") return { page: "projects" };
  if (hash === "/publications") return { page: "publications" };
  if (hash.startsWith("/projects/"))
    return { page: "project", id: hash.slice(10) };
  if (["about", "featured", "documents"].includes(hash))
    return { page: "home", anchor: hash };
  return { page: "not-found" };
}

function Icon({ name = "arrow", size = 20, ...props }) {
  const paths = {
    arrow: (
      <>
        <path d="M5 19 19 5M5 5h14v14" />
      </>
    ),
    right: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v16m-6-6 6 6 6-6" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    pause: <path d="M9 5v14M15 5v14" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    document: (
      <>
        <path d="M14 3H5v18h14V8l-5-5Z" />
        <path d="M14 3v5h5M8 12h8M8 16h6" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

function SectionLabel({ number, children, light = false }) {
  return (
    <div className={`section-label ${light ? "on-dark" : ""}`}>
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function ProjectCard({ project, featured = false, index }) {
  const years = [...new Set(project.period?.match(/\d{4}/g) || [])].join("—");
  const imageIndex = `${String(index + 1).padStart(2, "0")} / ${categoryLabel[project.category]}`;
  return (
    <article className={`project-card ${featured ? "featured-card" : ""}`}>
      <a
        className={`project-image art-${project.art}`}
        href={projectHref(project)}
        aria-label={`Explore ${project.title}, ${imageIndex}${project.image ? "" : ", Concept illustration"}`}
      >
        <img
          src={publicAsset(project.image || `/images/${project.art}.svg`)}
          alt=""
          loading={featured ? "eager" : "lazy"}
          draggable={false}
        />
        <span className="image-index" aria-hidden="true">
          {imageIndex}
        </span>{" "}
        <span className="image-arrow">
          <Icon />
        </span>
        {!project.image && (
          <span className="art-note" aria-hidden="true">
            Concept illustration
          </span>
        )}
      </a>
      <div className="project-body">
        <div className="project-meta">
          <span>{categoryLabel[project.category]}</span>
          <span>
            {project.status === "In progress" ? (
              <>
                <i /> In progress
              </>
            ) : (
              years || project.status
            )}
          </span>
        </div>
        <h3>
          <a href={projectHref(project)}>
            {project.title}
            <Icon name="right" size={22} />
          </a>
        </h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.tags.slice(0, featured ? 3 : 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function FeaturedCarousel() {
  const featuredProjects = projects.filter((project) => project.featured);
  const count = featuredProjects.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackPosition, setTrackPosition] = useState(count > 1 ? 1 : 0);
  const positionRef = useRef(trackPosition);
  const movingRef = useRef(false);
  const gestureRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [isMoving, setIsMoving] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isHovered, setIsHovered] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const advancing = isPlaying && !isHovered && !focusPaused;

  const finishMovement = useCallback(() => {
    if (!movingRef.current) return;
    movingRef.current = false;
    const position = positionRef.current;
    const settledPosition =
      position === 0 ? count : position === count + 1 ? 1 : position;
    positionRef.current = settledPosition;
    setTrackPosition(settledPosition);
    setIsMoving(false);
  }, [count]);

  const move = useCallback(
    (direction) => {
      if (count < 2 || movingRef.current) return;
      const target = positionRef.current + direction;
      setActiveIndex((index) => (index + direction + count) % count);
      if (prefersReducedMotion) {
        const settledPosition =
          target === 0 ? count : target === count + 1 ? 1 : target;
        positionRef.current = settledPosition;
        setTrackPosition(settledPosition);
      } else {
        movingRef.current = true;
        positionRef.current = target;
        setIsMoving(true);
        setTrackPosition(target);
      }
    },
    [count, prefersReducedMotion],
  );

  useEffect(() => {
    if (!advancing || count < 2) return;
    const timer = window.setInterval(() => move(1), 3000);
    return () => window.clearInterval(timer);
  }, [advancing, activeIndex, count, move]);

  useEffect(() => {
    if (!isMoving) return;
    // Complete the move even when a background tab suppresses transitionend.
    const timer = window.setTimeout(finishMovement, 680);
    return () => window.clearTimeout(timer);
  }, [isMoving, finishMovement]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setPrefersReducedMotion(preference.matches);
      if (preference.matches) {
        setIsPlaying(false);
        finishMovement();
      }
    };
    preference.addEventListener("change", onChange);
    return () => preference.removeEventListener("change", onChange);
  }, [finishMovement]);

  const realSlides = featuredProjects.map((project, index) => ({
    project,
    index,
    key: project.id,
    clone: false,
  }));
  const slides =
    count > 1
      ? [
          { ...realSlides[count - 1], key: "loop-last", clone: true },
          ...realSlides,
          { ...realSlides[0], key: "loop-first", clone: true },
        ]
      : realSlides;

  if (!count) return null;
  return (
    <div
      className="featured-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={() => setIsHovered(false)}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocusPaused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocusPaused(false);
      }}
    >
      <div className="carousel-stage">
        <button
          className="carousel-arrow previous"
          aria-label="Previous featured project"
          aria-disabled={isMoving || count < 2}
          onClick={() => move(-1)}
        >
          <Icon name="right" style={{ transform: "rotate(180deg)" }} />
        </button>
        <div
          className="carousel-slides"
          aria-live={advancing ? "off" : "polite"}
          onPointerDown={(event) => {
            suppressClickRef.current = false;
            gestureRef.current =
              event.isPrimary && event.pointerType !== "mouse"
                ? { x: event.clientX, y: event.clientY }
                : null;
          }}
          onPointerCancel={() => {
            gestureRef.current = null;
          }}
          onPointerUp={(event) => {
            const start = gestureRef.current;
            gestureRef.current = null;
            if (!start) return;
            const distanceX = event.clientX - start.x;
            const distanceY = event.clientY - start.y;
            if (
              Math.abs(distanceX) >= 48 &&
              Math.abs(distanceX) > Math.abs(distanceY) * 1.5
            ) {
              suppressClickRef.current = true;
              move(distanceX < 0 ? 1 : -1);
            }
          }}
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClickRef.current = false;
          }}
        >
          <div
            className={`carousel-track ${isMoving ? "is-animated" : ""}`}
            style={{ transform: `translate3d(-${trackPosition * 100}%, 0, 0)` }}
            onTransitionEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.propertyName === "transform"
              )
                finishMovement();
            }}
          >
            {slides.map(({ project, index, key, clone }) => {
              const isActive = !clone && index === activeIndex;
              return (
                <div
                  className="carousel-slide"
                  key={key}
                  data-active={isActive}
                  data-clone={clone ? "true" : undefined}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${project.title}`}
                >
                  <ProjectCard project={project} featured index={index} />
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="carousel-arrow next"
          aria-label="Next featured project"
          aria-disabled={isMoving || count < 2}
          onClick={() => move(1)}
        >
          <Icon name="right" />
        </button>
      </div>
      <div className="carousel-controls">
        <span
          className="carousel-count"
          aria-label={`Project ${activeIndex + 1} of ${featuredProjects.length}`}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(featuredProjects.length).padStart(2, "0")}
        </span>
        <button
          className="carousel-play"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          onClick={() => {
            setIsPlaying((playing) => !playing);
            setFocusPaused(false);
          }}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={14} />
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}

function NavigationMenu({ route, onClose, triggerRef }) {
  const ref = useRef(null);
  const containFocus = (event) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...event.currentTarget.querySelectorAll(
        "a[href], button:not([disabled])",
      ),
    ];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    document.body.classList.add("modal-open");
    return () => {
      dialog.close();
      document.body.classList.remove("modal-open");
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, []);
  const links = [
    { label: "Home", href: "#/", page: "home" },
    { label: "Projects", href: "#/projects", page: "projects" },
    {
      label: "Research publications",
      href: "#/publications",
      page: "publications",
    },
  ];
  return (
    <dialog
      ref={ref}
      className="menu-dialog"
      id="site-navigation"
      aria-labelledby="navigation-title"
      onKeyDown={containFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="menu-panel">
        <div className="menu-top">
          <h2 id="navigation-title" className="eyebrow">
            Site navigation
          </h2>
          <button
            className="menu-close"
            onClick={onClose}
            aria-label="Close navigation"
            autoFocus
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav className="menu-links" aria-label="Site pages">
          {links.map((link, index) => (
            <a
              key={link.page}
              className="menu-link"
              href={link.href}
              aria-current={
                route.page === link.page ||
                (route.page === "project" && link.page === "projects")
                  ? "page"
                  : undefined
              }
              onClick={onClose}
            >
              <span className="menu-index" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="menu-title">{link.label}</span>
              <Icon size={23} />
            </a>
          ))}
        </nav>
        <div className="menu-bottom">
          <p className="eyebrow">LET’S CONNECT</p>
          <a href={`mailto:${profile.email}`}>
            {profile.email}
            <Icon size={16} />
          </a>
          <p>
            {profile.role}
            <br />
            WPI · Class of 2028
          </p>
        </div>
      </div>
    </dialog>
  );
}

function HomePage() {
  const [hasPortrait, setHasPortrait] = useState(Boolean(profile.portrait));
  const study = education[0];
  return (
    <>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-grid container">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span className="orange-dot" /> ROBOTICS & MECHANICAL ENGINEERING
            </p>
            <h1 id="hero-title">
              Alejandro
              <br />
              <span className="hero-surname">Matilla Calvo.</span>
            </h1>
            <p className="hero-statement">
              Curious by nature.
              <br />
              An engineer in the making.
            </p>
            <p className="hero-description">
              I design, build, and explore robotic systems.
              <br className="desktop-break" /> Currently studying at WPI,
              turning ideas into motion.
            </p>
            <div className="hero-actions">
              <a className="button button-orange" href="#featured">
                Explore my work <Icon name="right" size={19} />
              </a>
            </div>
          </div>
          <div className={`hero-art ${hasPortrait ? "portrait-mode" : ""}`}>
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="crosshair crosshair-top">+</div>
            <div className="crosshair crosshair-bottom">+</div>
            <div className="hero-art-label">
              <span>DESIGN / BUILD / ITERATE</span>
              <span>01—AMC</span>
            </div>
            <img
              src={publicAsset(
                hasPortrait ? profile.portrait : "/images/hero-robot.svg",
              )}
              alt={
                hasPortrait
                  ? profile.fullName
                  : "Conceptual technical illustration of a humanoid robot"
              }
              onError={() => setHasPortrait(false)}
              fetchPriority="high"
            />
            <span className="hero-art-caption">
              <span className="orange-dot" /> MECHANICAL CURIOSITY, IN MOTION
            </span>
            {!hasPortrait && (
              <span className="hero-concept">CONCEPT ILLUSTRATION</span>
            )}
          </div>
        </div>
        <div className="hero-bottom container">
          <span>
            <Icon name="location" size={14} /> GREATER BOSTON, MA
          </span>
          <span>
            WORCESTER POLYTECHNIC INSTITUTE{" "}
            <span className="tiny-divider">/</span> CLASS OF 2028
          </span>
          <a href="#about" aria-label="Scroll to about">
            <Icon name="down" size={18} />
          </a>
        </div>
      </section>

      <section
        className="about section-light"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="container">
          <SectionLabel number="01">A LITTLE ABOUT ME</SectionLabel>
          <div className="about-grid">
            <div className="portrait-frame">
              {hasPortrait ? (
                <img
                  src={publicAsset(profile.portrait)}
                  alt={profile.fullName}
                  onError={() => setHasPortrait(false)}
                />
              ) : (
                <div
                  className="portrait-placeholder"
                  role="img"
                  aria-label="Portrait placeholder for Alejandro Matilla Calvo"
                >
                  <span className="portrait-top">HELLO, I’M</span>
                  <span className="portrait-monogram">
                    amc<span>.</span>
                  </span>
                  <span className="portrait-bottom">
                    ALEJANDRO MATILLA CALVO<span>Portrait coming soon</span>
                  </span>
                </div>
              )}
            </div>
            <div className="about-copy">
              <h2 id="about-title">
                Where mechanics
                <br />
                meet possibility<span>.</span>
              </h2>
              <p>{profile.description}</p>
              <div className="about-skills">
                <span>Mechanical design</span>
                <span>Embedded systems</span>
                <span>Robot control</span>
              </div>
            </div>
            <div className="education-card">
              <span className="school-mark">
                WPI<span>EST. 1865</span>
              </span>
              <h3>{study.institution}</h3>
              <p>
                Robotics Engineering
                <br />
                Mechanical Engineering
              </p>
              <div className="education-footer">
                <span>Dual B.S.</span>
                <span>Expected May 2028</span>
              </div>
              <p className="course-note">
                Learning through thermodynamics, fluids, embedded systems, and
                hands-on design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="featured section-light"
        id="featured"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <SectionLabel number="02">SELECTED WORK</SectionLabel>
              <h2 id="featured-title">
                Ideas put into practice<span>.</span>
              </h2>
            </div>
            <a className="home-featured-link" href="#/projects">
              All projects <Icon name="arrow" size={16} />
            </a>
          </div>
          <FeaturedCarousel />
        </div>
      </section>

      <section
        className="documents section-light"
        id="documents"
        aria-labelledby="documents-title"
      >
        <div className="container documents-grid">
          <div>
            <SectionLabel number="03">DOCUMENTS</SectionLabel>
            <h2 id="documents-title">
              The details,
              <br />
              on paper<span>.</span>
            </h2>
            <p>
              A snapshot of my studies, experience,
              <br />
              and the things I’ve been building.
            </p>
          </div>
          <article className="resume-card">
            <div className="resume-preview" aria-hidden="true">
              <div className="paper">
                <strong>
                  ALEJANDRO
                  <br />
                  MATILLA CALVO
                </strong>
                <span className="paper-rule" />
                <small>EDUCATION</small>
                <i />
                <i />
                <small>PROJECTS & RESEARCH</small>
                <i />
                <i />
                <i />
                <small>EXPERIENCE</small>
                <i />
                <i />
                <i />
              </div>
              <span className="pdf-badge">PDF</span>
            </div>
            <div className="resume-info">
              <Icon name="document" size={24} />
              <div>
                <h3>Curriculum vitae / Resume</h3>
                <p>PDF document · 135 KB</p>
              </div>
            </div>
            <div className="resume-actions">
              <a
                className="button button-dark"
                href={resumeUrl}
                download="Alejandro-Matilla-Resume.pdf"
              >
                Download resume
                <Icon name="download" size={17} />
              </a>
              <a
                className="view-resume"
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF <Icon size={15} />
              </a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function ProjectsPage() {
  const groups = [
    {
      id: "research",
      title: "Research",
      description:
        "Exploring how robotic systems move, adapt, and respond to the world.",
    },
    {
      id: "personal",
      title: "Personal projects",
      description:
        "Independent ideas and club projects, taken from concept to hardware.",
    },
    {
      id: "coursework",
      title: "Coursework",
      description: "Engineering ideas explored through my studies at WPI.",
    },
  ];
  return (
    <div className="page-surface projects-page">
      <div className="page-intro container">
        <SectionLabel number="01">THE PROJECT COLLECTION</SectionLabel>
        <div className="page-heading">
          <h1>
            Always building<span>.</span>
          </h1>
          <span className="page-meta">
            {String(projects.length).padStart(2, "0")} PROJECTS & COUNTING
          </span>
        </div>
        <p className="page-description">
          Research, independent builds, and coursework—each with its own space.
        </p>
      </div>
      {groups.map((group, groupIndex) => {
        const entries = projects.filter(
          (project) => project.category === group.id,
        );
        return (
          <section
            className="project-category container"
            data-category={group.id}
            key={group.id}
            aria-labelledby={`${group.id}-title`}
          >
            <div className="category-heading">
              <div>
                <SectionLabel number={`0${groupIndex + 1}`}>
                  {group.id === "personal"
                    ? "INDEPENDENT BUILDS"
                    : group.id === "research"
                      ? "IN THE LAB"
                      : "IN THE CLASSROOM"}
                </SectionLabel>
                <h2 id={`${group.id}-title`}>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <span className="category-number">
                {String(entries.length).padStart(2, "0")} PROJECTS
              </span>
            </div>
            {entries.length ? (
              <div className="featured-grid">
                {entries.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-mark" aria-hidden="true">
                  +
                </span>
                <div>
                  <h3>More to explore.</h3>
                  <p>
                    Coursework projects will be added here as the collection
                    grows.
                  </p>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PublicationsPage() {
  return (
    <div className="page-surface publications-page">
      <div className="page-intro container">
        <SectionLabel number="01">RESEARCH & PUBLICATIONS</SectionLabel>
        <div className="page-heading">
          <h1>
            Research publications<span>.</span>
          </h1>
          <span className="page-meta">
            {String(publications.length).padStart(2, "0")} PUBLICATIONS
          </span>
        </div>
        <p className="page-description">
          A place for the papers and findings that grow out of my research.
        </p>
      </div>
      <section
        className="publication-empty container"
        aria-label="Publication status"
      >
        {publications.length ? (
          <div className="publications-list">
            {publications.map((publication, index) => (
              <article
                className="publication-entry"
                key={publication.id || index}
              >
                <p className="eyebrow">
                  {publication.year} · {publication.venue}
                </p>
                <h2>
                  {publication.href ? (
                    <a
                      href={publication.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {publication.title} <Icon size={20} />
                    </a>
                  ) : (
                    publication.title
                  )}
                </h2>
                <p>{publication.authors}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">
              <Icon name="document" size={35} />
            </span>
            <div>
              <p className="eyebrow">WORK IN PROGRESS</p>
              <h2>No publications yet.</h2>
              <p>
                {profile.publicationStatus} Future papers will be shared here
                once published.
              </p>
            </div>
          </div>
        )}
        <div className="page-actions">
          <a className="button button-dark" href="#/projects">
            Explore the research <Icon name="right" size={18} />
          </a>
          <a className="home-featured-link" href="#/">
            Back to home <Icon size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

function ProjectPage({ project }) {
  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const hasProjectNotes =
    project.details.length > 0 || project.sections?.length > 0;
  return (
    <article className="page-surface project-page">
      <div className="project-page-intro container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="#/">Home</a>
          <span>/</span>
          <a href="#/projects">Projects</a>
          <span>/</span>
          <span>{categoryLabel[project.category]}</span>
        </nav>
        <SectionLabel number="01">{project.eyebrow}</SectionLabel>
        <div className="detail-heading">
          <h1>
            {project.title}
            <span>.</span>
          </h1>
        </div>
        <div className="detail-meta">
          {project.period && <span>{project.period}</span>}
          <span className="status">{project.status}</span>
        </div>
      </div>
      <div className="detail-layout container">
        <div className={`detail-visual art-${project.art}`}>
          <img
            src={publicAsset(project.image || `/images/${project.art}.svg`)}
            alt={
              project.image
                ? project.imageAlt || project.title
                : `Concept illustration of ${project.title}`
            }
          />
          {!project.image && (
            <span className="art-note">Concept illustration</span>
          )}
        </div>
        <div className="detail-summary">
          <p className="eyebrow">THE IDEA</p>
          <h2>Project overview</h2>
          <p>{project.description}</p>
          <div className="tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`detail-body container ${hasProjectNotes ? "" : "context-only"}`}
      >
        {hasProjectNotes && (
          <div className="contributions">
            {project.details.length > 0 && (
              <>
                <SectionLabel number="02">MY ROLE</SectionLabel>
                <h2 id="contributions-title">My contributions</h2>
                <ul>
                  {project.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </>
            )}
            {project.sections?.map((section, index) => (
              <section className="case-study-section" key={index}>
                <h2>{section.heading}</h2>
                {(Array.isArray(section.body)
                  ? section.body
                  : [section.body]
                ).map((paragraph, paragraphIndex) => (
                  <p key={paragraphIndex}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        )}
        <aside className="project-facts">
          <h3>Project context</h3>
          <dl>
            <div>
              <dt>Focus</dt>
              <dd>{categoryLabel[project.category]}</dd>
            </div>
            {project.period && (
              <div>
                <dt>Timeline</dt>
                <dd>{project.period}</dd>
              </div>
            )}
            <div>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </div>
          </dl>
          <a className="home-featured-link" href={`mailto:${profile.email}`}>
            Talk about this project <Icon size={16} />
          </a>
        </aside>
      </div>
      <div className="project-page-footer container">
        <a className="home-featured-link" href="#/projects">
          <Icon
            name="right"
            size={17}
            style={{ transform: "rotate(180deg)" }}
          />{" "}
          All projects
        </a>
        <a className="home-featured-link" href={projectHref(nextProject)}>
          Next: {nextProject.title} <Icon name="right" size={17} />
        </a>
      </div>
    </article>
  );
}

function NotFoundPage() {
  return (
    <div className="page-surface">
      <div className="page-intro container">
        <SectionLabel number="404">PAGE NOT FOUND</SectionLabel>
        <div className="page-heading">
          <h1>
            Let’s get back on track<span>.</span>
          </h1>
        </div>
        <p className="page-description">
          This page isn’t in the portfolio. You can find the current work in the
          projects collection.
        </p>
        <div className="page-actions">
          <a className="button button-dark" href="#/projects">
            Explore projects <Icon name="right" size={18} />
          </a>
          <a className="home-featured-link" href="#/">
            Back to home <Icon size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);
  const mainRef = useRef(null);
  const activeProject =
    route.page === "project"
      ? projects.find((project) => project.id === route.id)
      : null;
  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    setMenuOpen(false);
    const label =
      route.page === "project"
        ? activeProject?.title || "Page not found"
        : route.page === "projects"
          ? "Projects"
          : route.page === "publications"
            ? "Research publications"
            : route.page === "not-found"
              ? "Page not found"
              : "Robotics & Mechanical Engineering";
    document.title = `${label} — ${profile.fullName}`;
    const frame = requestAnimationFrame(() => {
      if (route.anchor)
        document
          .getElementById(route.anchor)
          ?.scrollIntoView({ behavior: "smooth" });
      else {
        window.scrollTo({ top: 0, behavior: "instant" });
        mainRef.current?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route]);
  const homeClick = () => {
    if (route.page === "home" && !route.anchor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      mainRef.current?.focus({ preventScroll: true });
    }
  };
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-shell">
          <a
            className="brand"
            href="#/"
            onClick={homeClick}
            aria-label={`amc. — ${profile.fullName}, home`}
          >
            amc<span>.</span>
            <span className="brand-divider" />
            <span className="brand-name">{profile.fullName.toUpperCase()}</span>
          </a>
          <div className="header-actions">
            <span className="header-note">ENGINEERING PORTFOLIO</span>
            <button
              ref={menuToggleRef}
              className="menu-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              aria-controls={menuOpen ? "site-navigation" : undefined}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
      </header>
      <main ref={mainRef} id="main" tabIndex={-1}>
        {route.page === "home" ? (
          <HomePage />
        ) : route.page === "projects" ? (
          <ProjectsPage />
        ) : route.page === "publications" ? (
          <PublicationsPage />
        ) : activeProject ? (
          <ProjectPage key={activeProject.id} project={activeProject} />
        ) : (
          <NotFoundPage />
        )}
      </main>
      <footer className="site-footer">
        <div className="container">
          <a
            className="brand footer-brand"
            href="#/"
            onClick={homeClick}
            aria-label="amc., back to home"
          >
            amc<span>.</span>
          </a>
          <p>
            © {new Date().getFullYear()} {profile.fullName}
          </p>
          <span>DESIGNED WITH CURIOSITY. BUILT WITH PURPOSE.</span>
          <a href={`mailto:${profile.email}`}>
            Get in touch <Icon size={14} />
          </a>
        </div>
      </footer>
      {menuOpen && (
        <NavigationMenu
          route={route}
          onClose={() => setMenuOpen(false)}
          triggerRef={menuToggleRef}
        />
      )}
    </>
  );
}
