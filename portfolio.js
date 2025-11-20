// About Me Content
function initAboutMe(container) {
  container.innerHTML = `
    <div class="about-me-content">
      <div class="about-header">
        <img src="https://via.placeholder.com/120" alt="Profile Photo" class="profile-photo">
        <div class="about-intro">
          <h2>Kae Davis</h2>
          <p class="tagline">Full Stack Developer | Designer | Problem Solver</p>
        </div>
      </div>
      
      <div class="about-section">
        <h3>About Me</h3>
        <p>I'm a passionate developer with expertise in web technologies, creating innovative solutions and beautiful user experiences. I love building projects that make a difference.</p>
      </div>

      <div class="about-section">
        <h3>Skills</h3>
        <div class="skill-bar">
          <div class="skill-label">JavaScript / TypeScript</div>
          <div class="skill-progress"><div class="skill-fill" style="width: 90%"></div></div>
        </div>
        <div class="skill-bar">
          <div class="skill-label">HTML / CSS</div>
          <div class="skill-progress"><div class="skill-fill" style="width: 95%"></div></div>
        </div>
        <div class="skill-bar">
          <div class="skill-label">React / Node.js</div>
          <div class="skill-progress"><div class="skill-fill" style="width: 85%"></div></div>
        </div>
        <div class="skill-bar">
          <div class="skill-label">Python</div>
          <div class="skill-progress"><div class="skill-fill" style="width: 80%"></div></div>
        </div>
      </div>

      <div class="about-section">
        <h3>Experience</h3>
        <div class="experience-item">
          <strong>Senior Developer</strong> - Company Name (2022 - Present)
          <p>Building awesome web applications and leading development teams.</p>
        </div>
        <div class="experience-item">
          <strong>Junior Developer</strong> - Another Company (2020 - 2022)
          <p>Developed features and learned best practices in software development.</p>
        </div>
      </div>
    </div>
  `;
}

// Contact Form
function initContactForm(container) {
  container.innerHTML = `
    <div class="contact-form-content">
      <h3>📧 Send Me a Message</h3>
      <form id="contactForm" class="win-form">
        <div class="form-group">
          <label>Name:</label>
          <input type="text" id="contactName" required>
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" id="contactEmail" required>
        </div>
        <div class="form-group">
          <label>Subject:</label>
          <input type="text" id="contactSubject" required>
        </div>
        <div class="form-group">
          <label>Message:</label>
          <textarea id="contactMessage" rows="6" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="win-button">Send</button>
          <button type="reset" class="win-button">Clear</button>
        </div>
      </form>
      <div id="contactStatus" class="contact-status"></div>
    </div>
  `;

  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("contactStatus");

    status.innerHTML = "📤 Sending message...";
    status.style.color = "#0000ff";

    // EmailJS configuration
    const SERVICE_ID = "service_osy8xna";
    const TEMPLATE_ID = "template_sc8aq4f";
    const PUBLIC_KEY = "KfIGDVd_GVzsxok2v";

    // Initialize EmailJS with public key
    emailjs.init(PUBLIC_KEY);

    const templateParams = {
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value
    };

    // Send email via EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        status.innerHTML = "✅ Message sent successfully!";
        status.style.color = "#008000";
        e.target.reset();
      })
      .catch((error) => {
        status.innerHTML = "❌ Failed to send message. Please try again.";
        status.style.color = "#ff0000";
        console.error("EmailJS error:", error);
      });
  });
}

// MSN Messenger Widget
function initMSNWidget(container) {
  container.innerHTML = `
    <div class="msn-widget">
      <div class="msn-header">
        <img src="https://via.placeholder.com/32" alt="Avatar" class="msn-avatar">
        <div class="msn-info">
          <div class="msn-name">Kae D.</div>
          <div class="msn-status">🟢 Online - Available to chat!</div>
        </div>
      </div>
      
      <div class="msn-links">
        <h4>Connect with me:</h4>
        <a href="https://github.com/kdavis00" target="_blank" class="social-link">
          <span class="link-icon">💻</span> GitHub
        </a>
        <a href="https://linkedin.com/in/kdavis00" target="_blank" class="social-link">
          <span class="link-icon">💼</span> LinkedIn
        </a>
      
      </div>

      <div class="msn-personal-message">
        "Building the future, one line of code at a time 🚀"
      </div>
    </div>
  `;
}

// Projects Folder Content
function initProjectsFolder(container) {
  const projects = [
    {
      name: "Project 1",
      icon: "Windows 2000/Folder Closed.ico",
      description: "E-commerce Platform",
      tech: "React, Node.js, MongoDB",
    },
    {
      name: "Project 2",
      icon: "Windows 2000/Folder Closed.ico",
      description: "Social Media Dashboard",
      tech: "Vue.js, Firebase",
    },
    {
      name: "Project 3",
      icon: "Windows 2000/Folder Closed.ico",
      description: "Task Management App",
      tech: "Python, Django, PostgreSQL",
    },
    {
      name: "Project 4",
      icon: "Windows 2000/Folder Closed.ico",
      description: "Weather Forecast App",
      tech: "JavaScript, API Integration",
    },
  ];

  container.innerHTML = projects
    .map(
      (project, idx) => `
    <div class="file-icon project-item" data-project="${idx}">
      <img src="${project.icon}" alt="${project.name}">
      <span>${project.name}</span>
    </div>
  `
    )
    .join("");

  // Add click handlers for project details
  container.querySelectorAll(".project-item").forEach((item, idx) => {
    item.addEventListener("dblclick", () => {
      showProjectDetails(projects[idx]);
    });
  });
}

function showProjectDetails(project) {
  alert(
    `${project.name}\n\n${project.description}\n\nTech Stack: ${project.tech}\n\n(Double-click to open full details)`
  );
}
