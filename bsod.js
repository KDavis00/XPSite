// BLUE SCREEN OF DEATH (BSOD) EASTER EGG
// A fun easter egg that displays a "Blue Screen of Death"
// Instead of showing errors, it showcases the developer's skills!
// This file defines `showBSOD()` which can be called by other scripts.
function showBSOD() {
  const bsod = document.createElement('div');
  bsod.id = 'bsodScreen';
  
  // List of "error codes" that are actually developer skills
  const skills = [
    'EXCEPTIONAL_JAVASCRIPT_SKILLS',
    'ADVANCED_CSS_MASTERY',
    'REACT_EXPERTISE_OVERFLOW',
    'NODE_JS_PROFICIENCY',
    'PYTHON_WIZARD_MODE',
    'DATABASE_NINJA_DETECTED',
    'API_INTEGRATION_GENIUS',
    'PROBLEM_SOLVING_EXCELLENCE'
  ];
  
  // Pick a random skill to display as the "error"
  const randomSkill = skills[Math.floor(Math.random() * skills.length)];
  
  // Create BSOD screen with humorous "error" message showcasing skills
  bsod.innerHTML = `
    <div class="bsod-content">
      <h1>Windows</h1>
      <p>A skill exception has been detected and the developer has been showcased to prevent damage to your hiring team.</p>
      
      <p>The skill that caused this:</p>
      <p class="bsod-error">${randomSkill}</p>
      
      <p>If this is the first time you've seen this developer, consider hiring them immediately.
If you've seen this developer before, then you already know they're amazing.</p>
      
      <p>Technical information:</p>
      
      <p>*** STOP: 0x0000007B (0xF00DC0DE, 0xDEADBEEF, 0xC0FFEE00, 0x1337BABE)</p>
      
      <div class="bsod-skills">
        <p>LOADED SKILLS:</p>
        <p>JavaScript - TypeScript - React - Node.js - Python - HTML/CSS</p>
        <p>Git - REST APIs - Databases - Agile - Problem Solving</p>
      </div>
      
      <p class="bsod-footer">Press any key to hire this developer... or click anywhere to continue.</p>
    </div>
  `;
  
  document.body.appendChild(bsod);
  
  // Click anywhere to close the BSOD
  bsod.addEventListener('click', () => {
    bsod.remove();
  });
  
  // Press any key to close the BSOD
  const keyHandler = (e) => {
    bsod.remove();
    document.removeEventListener('keydown', keyHandler);
  };
  document.addEventListener('keydown', keyHandler);
}
