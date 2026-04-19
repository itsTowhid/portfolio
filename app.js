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
        initLanguage();
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

// Language Management
function initLanguage() {
    const langToggle = document.getElementById('lang-toggle');
    const html = document.documentElement;

    const savedLang = localStorage.getItem('lang') || 'en';
    html.setAttribute('data-lang', savedLang);
    updateLanguage(savedLang);

    langToggle.addEventListener('click', () => {
        const currentLang = html.getAttribute('data-lang');
        const newLang = currentLang === 'en' ? 'bn' : 'en';
        html.setAttribute('data-lang', newLang);
        localStorage.setItem('lang', newLang);
        updateLanguage(newLang);
    });
}

function updateLanguage(lang) {
    const langToggle = document.getElementById('lang-toggle');
    langToggle.querySelector('.lang-text').textContent = lang.toUpperCase();

    // Update all elements with data-en and data-bn attributes
    document.querySelectorAll('[data-en][data-bn]').forEach(el => {
        if (el.tagName === 'A' && el.classList.contains('nav-link')) {
            el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
        } else if (el.tagName === 'SPAN' && el.parentElement.tagName === 'H1') {
            // Don't override name highlights
            if (!el.classList.contains('highlight')) {
                el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
            }
        } else {
            el.textContent = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
        }
    });

    // Update dynamic content from data.json
    updateDynamicContent(lang);
}

function updateDynamicContent(lang) {
    const data = window.portfolioData;
    if (!data) return;

    // Update bio
    const bioEl = document.getElementById('hero-bio');
    if (bioEl && data.personal.bio[lang]) {
        bioEl.innerHTML = data.personal.bio[lang].join('<br>');
    }

    // Update role
    const roleEl = document.getElementById('hero-role');
    if (roleEl && data.personal.role[lang]) {
        roleEl.textContent = data.personal.role[lang];
    }

    // Update resume intro
    const resumeIntro = document.getElementById('resume-intro');
    if (resumeIntro && data.resume.intro[lang]) {
        resumeIntro.textContent = data.resume.intro[lang];
    }

    // Update skills intro
    const skillsIntro = document.getElementById('skills-intro');
    if (skillsIntro && data.resume.skillsIntro[lang]) {
        skillsIntro.textContent = data.resume.skillsIntro[lang];
    }

    // Update work intro
    const workIntro = document.getElementById('work-intro');
    if (workIntro && data.resume.workIntro[lang]) {
        const downloadText = lang === 'bn' ? 'আমার জীবনবৃত্তান্ত ডাউনলোড করুন 📄' : 'download my resume 📄';
        workIntro.innerHTML = `${data.resume.workIntro[lang]} <a href="${data.resume.downloadUrl}" class="link-highlight">${downloadText}</a>`;
    }
}

// Content Rendering
function renderContent(data) {
    window.portfolioData = data;
    const lang = document.documentElement.getAttribute('data-lang') || 'en';

    // Hero Section
    document.getElementById('hero-name').textContent = data.personal.name;
    document.getElementById('hero-role').textContent = data.personal.role[lang];
    document.getElementById('hero-bio').innerHTML = data.personal.bio[lang].join('<br>');

    // Hero stats
    const statsContainer = document.getElementById('hero-stats');
    statsContainer.innerHTML = data.personal.stats.map(stat => `
        <div class="stat-item">
            <span class="stat-number">${stat.value}</span>
            <span class="stat-label">${stat.label[lang]}</span>
        </div>
    `).join('');

    // Contact email - only show as hyperlink, not text
    const emailLink = document.getElementById('contact-email');
    emailLink.href = `mailto:${data.personal.email}`;
    emailLink.textContent = lang === 'bn' ? 'ইমেইল পাঠান' : 'Send Email';

    const emailLinkPage = document.getElementById('contact-email-page');
    emailLinkPage.href = `mailto:${data.personal.email}`;
    emailLinkPage.textContent = lang === 'bn' ? 'ইমেইল পাঠান' : 'Send Email';

    // Contact backup
    const backupLink = document.getElementById('contact-backup');
    if (backupLink) {
        backupLink.textContent = data.contact.backup.label[lang];
        backupLink.href = data.contact.backup.url;
    }

    // Footer name
    document.getElementById('footer-name').textContent = data.personal.name;

    // Featured Projects (home)
    renderFeaturedProjects(data.projects, lang);

    // All Projects
    renderProjects(data.projects, lang);

    // Social Links
    renderSocialLinks(data.personal.social);
    renderContactSocialLinks(data.personal.social);

    // Resume
    document.getElementById('resume-intro').textContent = data.resume.intro[lang];
    document.getElementById('skills-intro').textContent = data.resume.skillsIntro[lang];
    const downloadText = lang === 'bn' ? 'আমার জীবনবৃত্তান্ত ডাউনলোড করুন 📄' : 'download my resume 📄';
    document.getElementById('work-intro').innerHTML = `${data.resume.workIntro[lang]} <a href="${data.resume.downloadUrl}" class="link-highlight">${downloadText}</a>`;

    // Skills with categories
    renderSkills(data.resume.skills);

    // Work Timeline
    renderTimeline(data.resume.experience, lang);

    // Education
    renderEducation(data.education, lang);

    // Certifications
    renderCertifications(data.certifications, lang);

    // Interests
    renderInterests(data.interests, lang);

    // Awards
    renderAwards(data.awards, lang);

    // LeetCode
    renderLeetCode(data.leetcode, lang);
}

function renderFeaturedProjects(projects, lang) {
    const container = document.getElementById('featured-projects');
    const featured = projects.filter(p => p.featured);
    const viewLabel = lang === 'bn' ? 'দেখুন' : 'View Project';
    const githubLabel = lang === 'bn' ? 'গিটহাব' : 'GitHub';

    container.innerHTML = featured.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                ${project.badge ? `<span class="project-badge">${project.badge}</span>` : ''}
            </div>
            <p class="project-description">${project.description[lang]}</p>
            <div class="project-links">
                ${project.links.map(link => `
                    <a href="${link.url}" class="project-link" target="_blank" rel="noopener">
                        ${link.type === 'github' ? githubLabel : viewLabel}
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

function renderProjects(projects, lang) {
    const container = document.getElementById('projects-container');
    const viewLabel = lang === 'bn' ? 'দেখুন' : 'View Project';
    const githubLabel = lang === 'bn' ? 'গিটহাব' : 'GitHub';

    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                ${project.badge ? `<span class="project-badge">${project.badge}</span>` : ''}
            </div>
            <p class="project-description">${project.description[lang]}</p>
            <div class="project-links">
                ${project.links.map(link => `
                    <a href="${link.url}" class="project-link" target="_blank" rel="noopener">
                        ${link.type === 'github' ? githubLabel : viewLabel}
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
        languages: { en: 'Languages', bn: 'ভাষা' },
        flutter: { en: 'Flutter', bn: 'ফ্লাটার' },
        android: { en: 'Android Native', bn: 'অ্যান্ড্রয়েড নেটিভ' },
        architecture: { en: 'Principles & Architecture', bn: 'নীতি ও আর্কিটেকচার' },
        other: { en: 'Other Tools & Services', bn: 'অন্যান্য টুল ও সার্ভিস' }
    };

    const lang = document.documentElement.getAttribute('data-lang') || 'en';

    container.innerHTML = Object.entries(categories).map(([category, items]) => `
        <div class="skill-category">
            <h3 class="skill-category-title">${categoryNames[category] ? categoryNames[category][lang] : category}</h3>
            <div class="skills-container">
                ${items.map(skill => {
        const iconSvg = skillIcons[skill.icon] || skillIcons.github;
        return `
                        <span class="skill-tag">
                            <span class="skill-icon">${iconSvg}</span>
                            ${skill.name}
                        </span>
                    `;
    }).join('')}
            </div>
        </div>
    `).join('');
}

function renderTimeline(experience, lang) {
    const container = document.getElementById('work-timeline');
    const currentLabel = lang === 'bn' ? 'বর্তমান' : 'Current';
    const typeLabels = {
        'Contractual': { en: 'Contractual', bn: 'চুক্তিভিত্তিক' },
        'Full-Time': { en: 'Full-Time', bn: 'পূর্ণকালীন' }
    };

    container.innerHTML = experience.map(job => `
        <div class="timeline-item">
            <div class="timeline-header">
                <h3 class="timeline-title">${job.title}</h3>
                ${job.current ? `<span class="timeline-badge">${currentLabel}</span>` : ''}
            </div>
            <div class="timeline-meta">
                <span class="timeline-company">${job.company}</span>
                <span class="timeline-location">
                    ${job.flag} ${job.location}
                </span>
                <span class="timeline-type">• ${typeLabels[job.type] ? typeLabels[job.type][lang] : job.type}</span>
            </div>
            <div class="timeline-date">${job.startDate} — ${job.endDate}</div>
            <ul class="timeline-duties">
                ${job.duties[lang].map(duty => `<li>${duty}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderEducation(education, lang) {
    const container = document.getElementById('education-container');
    const labels = {
        degree: { en: 'BSc in Computer Science & Engineering', bn: 'কম্পিউটার সায়েন্স এন্ড ইঞ্জিনিয়ারিং বিএসসি' }
    };

    container.innerHTML = `
        <div class="education-icon">🎓</div>
        <div class="education-content">
            <h3>${labels.degree[lang]}</h3>
            <p>${education.institution} <span class="education-year">[${education.year}]</span></p>
        </div>
    `;
}

function renderCertifications(certifications, lang) {
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

function renderInterests(interests, lang) {
    const container = document.getElementById('interests-container');
    const interestLabels = {
        'Competitive Programming': { en: 'Competitive Programming', bn: 'প্রতিযোগিতামূলক প্রোগ্রামিং' },
        'Machine Learning': { en: 'Machine Learning', bn: 'মেশিন লার্নিং' },
        'MicroController': { en: 'MicroController', bn: 'মাইক্রোকন্ট্রোলার' },
        'Walking': { en: 'Walking', bn: 'হাঁটাহাঁটি' }
    };

    const emojis = {
        'Competitive Programming': '💻',
        'Machine Learning': '🤖',
        'MicroController': '🔌',
        'Walking': '🚶'
    };

    container.innerHTML = interests.map(interest => `
        <span class="interest-tag">
            <span>${emojis[interest] || '•'}</span>
            ${interestLabels[interest] ? interestLabels[interest][lang] : interest}
        </span>
    `).join('');
}

function renderAwards(awards, lang) {
    const container = document.getElementById('awards-container');
    const rankClasses = {
        '1st': 'gold',
        '2nd': 'silver',
        '3rd': 'silver',
        '4th': ''
    };

    const rankLabels = {
        '1st': { en: '1st', bn: '১ম' },
        '2nd': { en: '2nd', bn: '২য়' },
        '3rd': { en: '3rd', bn: '৩য়' },
        '4th': { en: '4th', bn: '৪র্থ' }
    };

    container.innerHTML = awards.map(award => `
        <div class="award-card">
            <div class="award-rank ${rankClasses[award.rank] || ''}">${rankLabels[award.rank] ? rankLabels[award.rank][lang] : award.rank}</div>
            <div class="award-content">
                <h3>${award.title}</h3>
                <p>${award.event} <span class="award-year">${award.year}</span></p>
            </div>
        </div>
    `).join('');
}

function renderLeetCode(leetcode, lang) {
    const container = document.getElementById('leetcode-container');
    const labels = {
        solved: { en: 'Problems Solved', bn: 'সমাধানকৃত সমস্যা' },
        since: { en: 'Active Since', bn: 'সক্রিয় desde' },
        viewProfile: { en: 'View Profile →', bn: 'প্রোফাইল দেখুন →' }
    };

    container.innerHTML = `
        <div class="leetcode-stats">
            <div class="leetcode-stat">
                <div class="leetcode-number">${leetcode.solved}</div>
                <div class="leetcode-label">${labels.solved[lang]}</div>
            </div>
            <div class="leetcode-stat">
                <div class="leetcode-number">${leetcode.since}</div>
                <div class="leetcode-label">${labels.since[lang]}</div>
            </div>
        </div>
        <a href="${leetcode.url}" class="leetcode-link" target="_blank" rel="noopener">${labels.viewProfile[lang]}</a>
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