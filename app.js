// Fetch data from JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadData();
    if (data) {
        initTheme();
        renderContent(data);
        initNavigation();
    }
});

// Theme Management
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Content Rendering
function renderContent(data) {
    // Hero Section
    document.getElementById('hero-name').textContent = data.personal.name;
    document.getElementById('hero-role').textContent = data.personal.role;
    document.getElementById('hero-bio').innerHTML = data.personal.bio.join('<br>');

    // Hero stats
    const statsContainer = document.getElementById('hero-stats');
    statsContainer.innerHTML = data.personal.stats.map(stat => `
        <div class="stat-item">
            <span class="stat-number">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        </div>
    `).join('');

    // Contact emails
    const emailLink = document.getElementById('contact-email');
    emailLink.textContent = data.personal.email;
    emailLink.href = `mailto:${data.personal.email}`;

    const emailLinkPage = document.getElementById('contact-email-page');
    emailLinkPage.textContent = data.personal.email;
    emailLinkPage.href = `mailto:${data.personal.email}`;

    // Contact phone & location
    const phoneLink = document.getElementById('contact-phone');
    phoneLink.textContent = data.personal.phone;
    phoneLink.href = `tel:${data.personal.phone.replace(/\D/g, '')}`;

    document.getElementById('contact-location').textContent = data.personal.location;

    // Contact backup
    const backupLink = document.getElementById('contact-backup');
    if (backupLink) {
        backupLink.textContent = data.contact.backup.label;
        backupLink.href = data.contact.backup.url;
    }

    // Footer name
    document.getElementById('footer-name').textContent = data.personal.name;

    // Featured Projects (home)
    renderFeaturedProjects(data.projects);

    // All Projects
    renderProjects(data.projects);

    // Social Links
    renderSocialLinks(data.personal.social);
    renderContactSocialLinks(data.personal.social);

    // Resume
    document.getElementById('resume-intro').textContent = data.resume.intro;
    document.getElementById('skills-intro').textContent = data.resume.skillsIntro;
    document.getElementById('work-intro').innerHTML = `${data.resume.workIntro} <a href="${data.resume.downloadUrl}" class="link-highlight">download my resume 📄</a>`;

    // Skills with categories
    renderSkills(data.resume.skills);

    // Work Timeline
    renderTimeline(data.resume.experience);

    // Education
    renderEducation(data.education);

    // Certifications
    renderCertifications(data.certifications);

    // Interests
    renderInterests(data.interests);

    // Awards
    renderAwards(data.awards);

    // LeetCode
    renderLeetCode(data.leetcode);
}

function renderFeaturedProjects(projects) {
    const container = document.getElementById('featured-projects');
    const featured = projects.filter(p => p.featured);
    container.innerHTML = featured.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                ${project.badge ? `<span class="project-badge">${project.badge}</span>` : ''}
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-links">
                ${project.links.map(link => `
                    <a href="${link.url}" class="project-link" target="_blank" rel="noopener">
                        ${link.label}
                        <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                ${project.badge ? `<span class="project-badge">${project.badge}</span>` : ''}
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-links">
                ${project.links.map(link => `
                    <a href="${link.url}" class="project-link" target="_blank" rel="noopener">
                        ${link.label}
                        <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                    </a>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderSocialLinks(social) {
    const container = document.getElementById('social-links');
    const icons = {
        linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
        github: '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>',
        stackoverflow: '<path d="M15.725 0l-1.72 1.277 6.39 8.588 1.72-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154z"/>',
        leetcode: '<path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.554-1.901-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.835-1.452l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM5.754 15.696l4.351-4.361c.973-.979 2.333-1.452 3.83-1.452 1.498 0 2.858.473 3.836 1.452l2.697 2.606c.514.515 1.366.497 1.901-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.037 5.037 0 0 0-3.835-1.494c-1.498 0-2.853.513-3.834 1.494l-4.347 4.36c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l2.697 2.606c.514.515 1.366.497 1.901-.038.535-.536.553-1.387.039-1.901l-2.609-2.636c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824z"/>'
    };

    container.innerHTML = Object.entries(social).map(([key, value]) => `
        <a href="${value.url}" class="social-link-item" target="_blank" rel="noopener">
            <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                ${icons[key] || icons.github}
            </svg>
            ${value.label}
        </a>
    `).join('');
}

function renderContactSocialLinks(social) {
    const container = document.getElementById('contact-social-links');
    if (!container) return;

    const icons = {
        linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
        github: '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>',
        stackoverflow: '<path d="M15.725 0l-1.72 1.277 6.39 8.588 1.72-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154z"/>',
        leetcode: '<path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.554-1.901-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.473 3.835-1.452l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM5.754 15.696l4.351-4.361c.973-.979 2.333-1.452 3.83-1.452 1.498 0 2.858.473 3.836 1.452l2.697 2.606c.514.515 1.366.497 1.901-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.037 5.037 0 0 0-3.835-1.494c-1.498 0-2.853.513-3.834 1.494l-4.347 4.36c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l2.697 2.606c.514.515 1.366.497 1.901-.038.535-.536.553-1.387.039-1.901l-2.609-2.636c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824z"/>'
    };

    container.innerHTML = Object.entries(social).map(([key, value]) => `
        <a href="${value.url}" class="social-link-large" target="_blank" rel="noopener">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                ${icons[key] || icons.github}
            </svg>
            ${value.label}
        </a>
    `).join('');
}

function renderSkills(skills) {
    const container = document.getElementById('skills-categories');

    // Group skills by category
    const categories = {};
    skills.forEach(skill => {
        if (!categories[skill.category]) {
            categories[skill.category] = [];
        }
        categories[skill.category].push(skill);
    });

    const categoryNames = {
        languages: 'Languages',
        flutter: 'Flutter',
        android: 'Android Native',
        architecture: 'Principles & Architecture',
        other: 'Other Tools & Services'
    };

    container.innerHTML = Object.entries(categories).map(([category, items]) => `
        <div class="skill-category">
            <h3 class="skill-category-title">${categoryNames[category] || category}</h3>
            <div class="skills-container">
                ${items.map(skill => `
                    <span class="skill-tag">
                        <span class="skill-icon" data-icon="${skill.icon}"></span>
                        ${skill.name}
                    </span>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Load SVGs from files
    document.querySelectorAll('.skill-icon[data-icon]').forEach(async span => {
        const iconName = span.getAttribute('data-icon');
        try {
            const response = await fetch(`assets/skills/${iconName}.svg`);
            if (response.ok) {
                const svgContent = await response.text();
                span.innerHTML = svgContent;
            } else {
                // Fallback to github if icon missing
                const fallback = await fetch('assets/skills/github.svg');
                if (fallback.ok) {
                    span.innerHTML = await fallback.text();
                }
            }
        } catch (error) {
            console.error(`Error loading icon ${iconName}:`, error);
        }
    });
}

function renderTimeline(experience) {
    const container = document.getElementById('work-timeline');
    container.innerHTML = experience.map(job => `
        <div class="timeline-item">
            <div class="timeline-header">
                <h3 class="timeline-title">${job.title}</h3>
                ${job.current ? '<span class="timeline-badge">Current</span>' : ''}
            </div>
            <div class="timeline-meta">
                <span class="timeline-company">${job.company}</span>
                <span class="timeline-location">
                    ${job.flag} ${job.location}
                </span>
                <span class="timeline-type">• ${job.type}</span>
            </div>
            <div class="timeline-date">${job.startDate} — ${job.endDate}</div>
            <ul class="timeline-duties">
                ${job.duties.map(duty => `<li>${duty}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderEducation(education) {
    const container = document.getElementById('education-container');
    container.innerHTML = `
        <div class="education-icon">🎓</div>
        <div class="education-content">
            <h3>${education.degree}</h3>
            <p>${education.institution} <span class="education-year">[${education.year}]</span></p>
        </div>
    `;
}

function renderCertifications(certifications) {
    const container = document.getElementById('cert-container');
    container.innerHTML = certifications.map(cert => `
        <div class="cert-card">
            <div class="cert-icon">📜</div>
            <div class="cert-content">
                <h4>${cert.title}</h4>
                <p>${cert.institution} <span class="cert-year">${cert.year}</span></p>
            </div>
        </div>
    `).join('');
}

function renderInterests(interests) {
    const container = document.getElementById('interests-container');
    const emojis = {
        'Competitive Programming': '💻',
        'Machine Learning': '🤖',
        'MicroController': '🔌',
        'Walking': '🚶'
    };

    container.innerHTML = interests.map(interest => `
        <span class="interest-tag">
            <span>${emojis[interest] || '•'}</span>
            ${interest}
        </span>
    `).join('');
}

function renderAwards(awards) {
    const container = document.getElementById('awards-container');
    const rankClasses = {
        '1st': 'gold',
        '2nd': 'silver',
        '3rd': 'silver',
        '4th': ''
    };

    container.innerHTML = awards.map(award => `
        <div class="award-card">
            <div class="award-rank ${rankClasses[award.rank] || ''}">${award.rank}</div>
            <div class="award-content">
                <h3>${award.title}</h3>
                <p>${award.event} <span class="award-year">${award.year}</span></p>
            </div>
        </div>
    `).join('');
}

function renderLeetCode(leetcode) {
    const container = document.getElementById('leetcode-container');
    container.innerHTML = `
        <div class="leetcode-stats">
            <div class="leetcode-stat">
                <div class="leetcode-number">${leetcode.solved}</div>
                <div class="leetcode-label">Problems Solved</div>
            </div>
            <div class="leetcode-stat">
                <div class="leetcode-number">${leetcode.since}</div>
                <div class="leetcode-label">Active Since</div>
            </div>
        </div>
        <a href="${leetcode.url}" class="leetcode-link" target="_blank" rel="noopener">View Profile →</a>
    `;
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            window.scrollTo(0, 0);
        });
    });

    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1) || 'resume';

            navLinks.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === `#${targetId}`) {
                    l.classList.add('active');
                }
            });

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            window.scrollTo(0, 0);
        });
    });
}