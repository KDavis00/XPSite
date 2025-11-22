// PORTFOLIO: ABOUT ME SECTION
// THIS FUNCTION INITIALIZES AND RENDERS THE ABOUT ME CONTENT WINDOW
// DISPLAYS: PROFILE PHOTO, INTRODUCTION, SKILLS WITH PROGRESS BARS, AND WORK EXPERIENCE
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
          <strong>Kennel Assistant/</strong> - The Seeing Eye (2024 - Present)
          <p>Executed daily animal care routines, ensuring the health, safety, and comfort of guide dogs.
Maintained a pristine and sanitary living environment for animals through meticulous cleaning and sanitization protocols.
Conducted routine monitoring of animal well-being and behavior, promptly reporting any anomalies to management.
</p>
        </div>
        <div class="experience-item">
          <strong>Animal Care Technician/Customer Service Representative</strong> - Destination Pet, LLC | Livingston, New Jersey, United States  (2021 - 2024)
          <p>Delivered exceptional animal care services, ensuring the health, comfort, and safety of pets in the facility.
Handled 50+ calls per day, managing inquiries, appointments, and veterinary scheduling with accuracy and professionalism.
Maintained a clean and sanitary environment in compliance with strict health and safety protocols.
Utilized advanced animal handling techniques to provide compassionate and efficient care for a variety of species.
Built strong relationships with pet owners through clear communication, empathy, and reliable service.
Collaborated with a multidisciplinary team to support daily operations and enhance the overall client experience.
</p>
        </div>
      </div>
    </div>
  `;
}

// PORTFOLIO: CONTACT FORM
// THIS FUNCTION CREATES AN INTERACTIVE CONTACT FORM WITH EMAILJS INTEGRATION
// USERS CAN SEND MESSAGES DIRECTLY FROM THE PORTFOLIO
// USES EMAILJS API TO SEND EMAILS WITHOUT A BACKEND SERVER
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

  // FORM SUBMISSION HANDLER
  // PREVENTS DEFAULT FORM SUBMISSION AND USES EMAILJS TO SEND THE EMAIL
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("contactStatus");

    // DISPLAY SENDING STATUS TO USER
    status.innerHTML = "📤 Sending message...";
    status.style.color = "#0000ff";

    // EMAILJS CONFIGURATION - SERVICE, TEMPLATE, AND PUBLIC KEY
    const SERVICE_ID = "service_osy8xna";
    const TEMPLATE_ID = "template_sc8aq4f";
    const PUBLIC_KEY = "KfIGDVd_GVzsxok2v";

    // INITIALIZE EMAILJS LIBRARY WITH THE PUBLIC KEY
    emailjs.init(PUBLIC_KEY);

    // COLLECT FORM DATA INTO TEMPLATE PARAMETERS OBJECT
    const templateParams = {
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value,
    };

    // SEND EMAIL VIA EMAILJS API
    // ON SUCCESS: SHOW CONFIRMATION AND RESET FORM
    // ON ERROR: DISPLAY ERROR MESSAGE AND LOG TO CONSOLE
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        status.innerHTML = "✅ Message sent successfully!";
        status.style.color = "#008000";
        e.target.reset(); // CLEAR FORM FIELDS
      })
      .catch((error) => {
        status.innerHTML = "❌ Failed to send message. Please try again.";
        status.style.color = "#ff0000";
        console.error("EmailJS error:", error);
      });
  });
}

// PORTFOLIO: MSN MESSENGER STYLE WIDGET
// THIS FUNCTION CREATES A NOSTALGIC MSN MESSENGER-STYLE SOCIAL LINKS WIDGET
// DISPLAYS ONLINE STATUS, AVATAR, AND LINKS TO GITHUB AND LINKEDIN
function initMSNWidget(container) {
  container.innerHTML = `
    <div class="msn-widget">
      <div class="msn-header">
        <img src="img/K1_cool.png" alt="Avatar" class="msn-avatar">
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

// PORTFOLIO: PROJECTS FOLDER
// THIS FUNCTION DISPLAYS A FOLDER VIEW OF PORTFOLIO PROJECTS
// EACH PROJECT IS SHOWN AS A DRAGGABLE FILE ICON WITH DETAILS
// SUPPORTS DOUBLE-CLICK TO VIEW DETAILS, DRAG TO RECYCLE BIN, AND RIGHT-CLICK TO DELETE
function initProjectsFolder(container) {
  // ARRAY OF PROJECT DATA WITH NAME, ICON, DESCRIPTION, AND TECH STACK
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

  // RENDER PROJECT ITEMS AS DRAGGABLE FILE ICONS
  container.innerHTML = projects
    .map(
      (project, idx) => `
    <div class="file-icon project-item" data-project="${idx}" draggable="true">
      <img src="${project.icon}" alt="${project.name}">
      <span>${project.name}</span>
    </div>
  `
    )
    .join("");

  // ADD EVENT HANDLERS FOR EACH PROJECT ITEM
  container.querySelectorAll(".project-item").forEach((item, idx) => {
    // DOUBLE-CLICK HANDLER: SHOW PROJECT DETAILS IN AN ALERT
    item.addEventListener("dblclick", () => {
      showProjectDetails(projects[idx]);
    });

    // DRAG START HANDLER: ENABLE DRAGGING PROJECT ITEMS TO RECYCLE BIN
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", item.outerHTML);
      item.classList.add("dragging");
    });

    // DRAG END HANDLER: CLEAN UP DRAGGING STATE
    item.addEventListener("dragend", (e) => {
      item.classList.remove("dragging");
    });

    // RIGHT-CLICK CONTEXT MENU HANDLER: DELETE PROJECT WITH CONFIRMATION
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (confirm(`Delete "${projects[idx].name}"?`)) {
        moveFileToRecycleBin(item, projects[idx].name);
      }
    });
  });
}

// DISPLAY DETAILED INFORMATION ABOUT A PROJECT IN AN ALERT DIALOG
// IN A PRODUCTION VERSION, THIS WOULD OPEN A DEDICATED WINDOW OR MODAL
function showProjectDetails(project) {
  alert(
    `${project.name}\n\n${project.description}\n\nTech Stack: ${project.tech}\n\n(Double-click to open full details)`
  );
}

// HELPER FUNCTIONS
// HELPER FUNCTION TO MOVE FILE ITEMS TO THE RECYCLE BIN
// ATTEMPTS TO USE THE GLOBAL RECYCLE BIN FUNCTION IF AVAILABLE
// FALLS BACK TO SIMPLE REMOVAL IF THE FUNCTION IS NOT DEFINED
function moveFileToRecycleBin(element, name) {
  if (typeof moveToRecycleBin === "function") {
    // USE THE GLOBAL RECYCLE BIN FUNCTION IF AVAILABLE
    const fakeIconData = {
      querySelector: (sel) => {
        if (sel === "span") return { textContent: name };
        if (sel === "img") return { src: element.querySelector("img").src };
      },
      classList: { contains: () => false },
      style: { display: "", left: "", top: "" },
      dataset: {},
    };
    moveToRecycleBin(element);
  } else {
    element.remove();
  }
}
