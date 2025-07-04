/*
 * AI Resume Builder
 * Clean, professional, and maintainable codebase
 * Author: [Your Name]
 * Description: Interactive AI-powered resume builder with live preview and PDF export.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State object to hold all resume data
    const resumeData = {
        personal: { 
            name: '', 
            title: '', 
            email: '', 
            phone: '', 
            linkedin: '', 
            github: '',
            portfolio: '',
            photo: '' 
        },
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
        awards: [],
        volunteering: [],
        hobbies: [],
        publications: [],
        template: 'modern'
    };

    // --- DOM Element Selectors ---
    const form = document.querySelector('.form-section');
    const preview = document.getElementById('resume-preview');
    const photoInput = document.getElementById('photo');
    const themeToggle = document.getElementById('theme-toggle');
    const aiModal = document.getElementById('ai-modal');
    const aiStatus = document.getElementById('ai-status');
    const aiAutofillBtn = document.getElementById('ai-autofill');

    // AI Summary Generator
    const summaryInput = document.getElementById('summary-input');
    const generateSummaryBtn = document.getElementById('generate-summary');
    const regenerateSummaryBtn = document.getElementById('regenerate-summary');
    const summaryField = document.getElementById('summary');

    // Experience
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceList = document.getElementById('experience-list');
    const aiEnhanceExpBtn = document.getElementById('ai-enhance-exp');

    // Education
    const addEducationBtn = document.getElementById('add-education');
    const educationList = document.getElementById('education-list');

    // Projects
    const addProjectBtn = document.getElementById('add-project');
    const projectsList = document.getElementById('projects-list');

    // Skills
    const skillsInput = document.getElementById('skills-input');
    const skillsList = document.getElementById('skills-list');
    const targetJobInput = document.getElementById('target-job');
    const aiSkillSuggestBtn = document.getElementById('ai-skill-suggest');

    // Certifications
    const addCertificationBtn = document.getElementById('add-certification');
    const certificationsList = document.getElementById('certifications-list');

    // Languages
    const addLanguageBtn = document.getElementById('add-language');
    const languagesList = document.getElementById('languages-list');

    // Additional Sections
    const sectionBtns = document.querySelectorAll('.section-btn');
    const additionalSections = document.getElementById('additional-sections');

    // Grammar Checker
    const toneSelector = document.getElementById('tone-selector');
    const grammarCheckBtn = document.getElementById('grammar-check');

    // Templates
    const templateSelector = document.getElementById('template-selector');
    
    // PDF Download
    const downloadPdfBtn = document.getElementById('download-pdf');
    const previewResumeBtn = document.getElementById('preview-resume');

    // Toggle Preview Section
    const previewSection = document.querySelector('.preview-section');
    const togglePreviewBtn = document.getElementById('toggle-preview');

    // --- TEMPLATES ---
    const templates = {
        classic: { name: 'Classic', color: '#4b5563' },
        modern: { name: 'Modern', color: '#3b82f6' },
        creative: { name: 'Creative', color: '#8b5cf6' },
        professional: { name: 'Professional', color: '#10b981' },
        minimalist: { name: 'Minimalist', color: '#6b7280' },
        executive: { name: 'Executive', color: '#1f2937' }
    };

    // --- AI MOCK FUNCTIONS ---
    function showAIModal(message) {
        aiStatus.textContent = message;
        aiModal.style.display = 'block';
    }

    function hideAIModal() {
        aiModal.style.display = 'none';
    }

    function mockAISummary(input, jobRole = '') {
        const summaries = [
            `Results-driven ${jobRole || 'professional'} with ${Math.floor(Math.random() * 10) + 3} years of experience in ${input.toLowerCase().includes('developer') ? 'software development' : 'the industry'}. Proven track record of delivering high-quality solutions and driving business growth through innovative approaches and strategic thinking.`,
            
            `Dynamic ${jobRole || 'professional'} passionate about ${input.toLowerCase().includes('design') ? 'creating exceptional user experiences' : 'achieving excellence'}. Skilled in ${input.toLowerCase().includes('manager') ? 'team leadership and project management' : 'problem-solving and collaboration'}, with a strong focus on delivering measurable results.`,
            
            `Experienced ${jobRole || 'professional'} with expertise in ${input.toLowerCase().includes('engineer') ? 'technical solutions and system optimization' : 'strategic planning and execution'}. Demonstrated ability to ${input.toLowerCase().includes('sales') ? 'exceed targets and build client relationships' : 'lead cross-functional teams and drive innovation'}.`
        ];
        
        return summaries[Math.floor(Math.random() * summaries.length)];
    }

    function mockAISkillSuggestions(targetJob) {
        const skillSets = {
            'frontend developer': ['React', 'Vue.js', 'TypeScript', 'CSS3', 'HTML5', 'JavaScript', 'Webpack', 'Git'],
            'backend developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Docker', 'AWS', 'REST APIs'],
            'data scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Tableau'],
            'project manager': ['Agile', 'Scrum', 'JIRA', 'Leadership', 'Risk Management', 'Stakeholder Management', 'Budget Planning'],
            'ui/ux designer': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
            'marketing manager': ['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media', 'Content Strategy', 'Campaign Management']
        };
        
        const defaultSkills = ['Communication', 'Problem Solving', 'Teamwork', 'Leadership', 'Time Management'];
        const jobSkills = skillSets[targetJob.toLowerCase()] || defaultSkills;
        
        return [...jobSkills, ...defaultSkills].slice(0, 8);
    }

    function mockAIGrammarCheck(text, tone) {
        const toneAdjustments = {
            professional: text.replace(/\b(I|me|my)\b/gi, 'The professional').replace(/\b(great|awesome|amazing)\b/gi, 'excellent'),
            bold: text.replace(/\b(helped|assisted|supported)\b/gi, 'spearheaded').replace(/\b(made|created)\b/gi, 'orchestrated'),
            friendly: text.replace(/\b(managed|led)\b/gi, 'collaborated on').replace(/\b(achieved|completed)\b/gi, 'successfully delivered')
        };
        
        return toneAdjustments[tone] || text;
    }

    function mockAIAutofill(jobRole, resumeText) {
        const name = resumeText.match(/^(.*)\n/)?.[1] || 'John Doe';
        const email = resumeText.match(/[\w\.-]+@[\w\.-]+\.\w+/)?.[0] || 'john.doe@email.com';
        
        return {
            personal: {
                name: name,
                title: jobRole || 'Software Engineer',
                email: email,
                phone: '123-456-7890',
                linkedin: 'linkedin.com/in/johndoe',
                github: 'github.com/johndoe',
                portfolio: 'johndoe.dev',
                photo: ''
            },
            summary: `Experienced ${jobRole || 'professional'} with a demonstrated history of working in the computer software industry. Skilled in JavaScript, React, Node.js, and MongoDB. Strong engineering professional with a Bachelor's degree focused in Computer Science from University of Example.`,
            experience: [
                { id: 1, title: 'Senior Software Engineer', company: 'Tech Solutions Inc.', location: 'San Francisco, CA', startDate: '2022-01', endDate: 'Present', description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to define, design, and ship new features. Led a team of 3 junior developers.' },
                { id: 2, title: 'Software Engineer', company: 'Innovate Corp.', location: 'Austin, TX', startDate: '2020-06', endDate: '2021-12', description: 'Worked on the backend services for a large-scale e-commerce platform. Optimized database queries, improving performance by 20%. Participated in code reviews and mentored new hires.' }
            ],
            education: [
                { id: 1, institution: 'University of Example', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2016-09', endDate: '2020-05', description: 'Graduated with honors. Member of the coding club.' }
            ],
            projects: [
                { id: 1, name: 'AI Resume Builder', description: 'A web application to help users create professional resumes with AI-powered suggestions.', url: 'github.com/johndoe/resume-builder' }
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS', 'Git'],
            certifications: [],
            languages: [],
        };
    }

    // --- EVENT LISTENERS ---
    
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    });

    // AI Autofill
    aiAutofillBtn.addEventListener('click', () => {
        const jobRole = document.getElementById('job-role').value.trim();
        const linkedinText = document.getElementById('linkedin-text').value.trim();

        if (!linkedinText) {
            alert('Please paste your LinkedIn profile or resume text first.');
            return;
        }

        showAIModal('Analyzing your profile and auto-filling the resume...');

        setTimeout(() => {
            const autofillData = mockAIAutofill(jobRole, linkedinText);
            
            // Merge data - keeping personal photo if it exists
            const photo = resumeData.personal.photo;
            Object.assign(resumeData, autofillData);
            resumeData.personal.photo = photo;
            
            // Populate form fields
            populateForm();
            
            // Update lists
            renderAllLists();
            
            updatePreview();
            hideAIModal();
            alert('Your resume has been auto-filled! Please review and make any necessary edits.');
        }, 3000);
    });

    // AI Summary Generator
    generateSummaryBtn.addEventListener('click', async () => {
        const input = summaryInput.value.trim();
        const jobRole = document.getElementById('job-role').value.trim();
        
        if (!input) {
            alert('Please enter some background information first.');
            return;
        }

        showAIModal('Generating professional summary...');
        
        // Simulate AI processing
        setTimeout(() => {
            const aiSummary = mockAISummary(input, jobRole);
            summaryField.value = aiSummary;
            resumeData.summary = aiSummary;
            updatePreview();
            hideAIModal();
        }, 2000);
    });

    regenerateSummaryBtn.addEventListener('click', async () => {
        const input = summaryInput.value.trim();
        const jobRole = document.getElementById('job-role').value.trim();
        
        if (!input) {
            alert('Please enter some background information first.');
            return;
        }

        showAIModal('Regenerating summary with different approach...');
        
        setTimeout(() => {
            const aiSummary = mockAISummary(input, jobRole);
            summaryField.value = aiSummary;
            resumeData.summary = aiSummary;
            updatePreview();
            hideAIModal();
        }, 1500);
    });

    // AI Skill Suggestions
    aiSkillSuggestBtn.addEventListener('click', async () => {
        const targetJob = targetJobInput.value.trim();
        
        if (!targetJob) {
            alert('Please enter a target job role first.');
            return;
        }

        showAIModal('Analyzing job requirements and suggesting skills...');
        
        setTimeout(() => {
            const suggestedSkills = mockAISkillSuggestions(targetJob);
            
            // Add suggested skills to the list
            suggestedSkills.forEach(skill => {
                if (!resumeData.skills.includes(skill)) {
                    resumeData.skills.push(skill);
                }
            });
            
            updateSkillsList();
            updatePreview();
            hideAIModal();
            
            alert(`Added ${suggestedSkills.length} relevant skills for ${targetJob}!`);
        }, 2000);
    });

    // AI Grammar Check
    grammarCheckBtn.addEventListener('click', async () => {
        const tone = toneSelector.value;
        const allText = JSON.stringify(resumeData);
        
        showAIModal('Checking grammar and adjusting tone...');
        
        setTimeout(() => {
            // Apply grammar check to experience descriptions
            resumeData.experience.forEach(exp => {
                if (exp.description) {
                    exp.description = mockAIGrammarCheck(exp.description, tone);
                }
            });
            
            // Apply to summary
            if (resumeData.summary) {
                resumeData.summary = mockAIGrammarCheck(resumeData.summary, tone);
                summaryField.value = resumeData.summary;
            }
            
            updatePreview();
            hideAIModal();
            alert(`Grammar check complete! Applied ${tone} tone throughout your resume.`);
        }, 2500);
    });

    // --- DYNAMIC SECTIONS ---
    
    addExperienceBtn.addEventListener('click', () => addDynamicEntry('experience'));
    addEducationBtn.addEventListener('click', () => addDynamicEntry('education'));
    addProjectBtn.addEventListener('click', () => addDynamicEntry('project'));
    addCertificationBtn.addEventListener('click', () => addDynamicEntry('certification'));
    addLanguageBtn.addEventListener('click', () => addDynamicEntry('language'));
    
    experienceList.addEventListener('click', (e) => handleDynamicList(e, 'experience'));
    educationList.addEventListener('click', (e) => handleDynamicList(e, 'education'));
    projectsList.addEventListener('click', (e) => handleDynamicList(e, 'project'));
    certificationsList.addEventListener('click', (e) => handleDynamicList(e, 'certification'));
    languagesList.addEventListener('click', (e) => handleDynamicList(e, 'language'));

    skillsInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && skillsInput.value.trim() !== '') {
            e.preventDefault();
            const skill = skillsInput.value.trim();
            if (!resumeData.skills.includes(skill)) {
                resumeData.skills.push(skill);
                updateSkillsList();
                updatePreview();
            }
            skillsInput.value = '';
        }
    });

    // Handle removing a skill
    skillsList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.parentElement.tagName === 'BUTTON') {
            const skillTag = e.target.closest('.skill-tag');
            const skill = skillTag.dataset.skill;
            resumeData.skills = resumeData.skills.filter(s => s !== skill);
            updateSkillsList();
            updatePreview();
        }
    });

    // Additional sections
    sectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                addAdditionalSection(section);
            } else {
                removeAdditionalSection(section);
            }
        });
    });
    
    // Template selection
    templateSelector.addEventListener('click', (e) => {
        const card = e.target.closest('.template-card');
        if (card) {
            templateSelector.querySelector('.selected').classList.remove('selected');
            card.classList.add('selected');
            resumeData.template = card.dataset.template;
            updatePreview();
        }
    });

    // PDF Download
    downloadPdfBtn.addEventListener('click', () => {
        // Wait a moment for any pending DOM updates
        setTimeout(() => {
            const options = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `${resumeData.personal.name || 'resume'}_resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait' 
                }
            };
            
            // Create a clone of the preview for PDF generation
            const previewClone = preview.cloneNode(true);
            previewClone.style.boxShadow = 'none';
            previewClone.style.transform = 'none';
            previewClone.style.position = 'static';
            previewClone.style.height = 'auto';
            previewClone.style.overflow = 'visible';
            
            // Temporarily append clone to body for PDF generation
            document.body.appendChild(previewClone);
            
            html2pdf().from(previewClone).set(options).save().then(() => {
                // Clean up the clone
                document.body.removeChild(previewClone);
            }).catch(error => {
                console.error('PDF generation error:', error);
                document.body.removeChild(previewClone);
            });
        }, 100);
    });

    // --- DATA & UI BINDING ---
    form.addEventListener('input', (e) => {
        const { id, value } = e.target;
        if (resumeData.personal.hasOwnProperty(id)) {
            resumeData.personal[id] = value;
        } else if (id === 'summary') {
            resumeData.summary = value;
        }
        // Dynamic fields are handled via their own listeners
        updatePreview();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                resumeData.personal.photo = event.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Toggle Preview Section
    togglePreviewBtn.addEventListener('click', () => {
        previewSection.classList.toggle('hidden');
        if (previewSection.classList.contains('hidden')) {
            togglePreviewBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Show Preview';
        } else {
            togglePreviewBtn.innerHTML = '<i class="fas fa-eye"></i> Hide Preview';
        }
    });

    // Preview Button Scrolls to Preview
    previewResumeBtn.addEventListener('click', () => {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // --- UTILITY FUNCTIONS ---
    function getListKey(type) {
        switch (type) {
            case 'project': return 'projects';
            case 'certification': return 'certifications';
            case 'language': return 'languages';
            default: return type;
        }
    }

    function populateForm() {
        for (const key in resumeData.personal) {
            const element = document.getElementById(key);
            if (element && element.type !== 'file') {
                element.value = resumeData.personal[key];
            }
        }
        summaryField.value = resumeData.summary;
    }

    function renderAllLists() {
        renderList('experience', experienceList);
        renderList('education', educationList);
        renderList('project', projectsList);
        renderList('certification', certificationsList);
        renderList('language', languagesList);
        updateSkillsList();
    }
    
    function renderList(type, container) {
        container.innerHTML = '';
        const dataKey = getListKey(type);
        if (resumeData[dataKey]) {
            resumeData[dataKey].forEach(item => {
                const itemHtml = getItemHtml(type, item);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = itemHtml;
                container.appendChild(tempDiv.firstElementChild);
            });
        }
    }

    function updateSkillsList() {
        skillsList.innerHTML = '';
        resumeData.skills.forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.dataset.skill = skill;
            skillTag.innerHTML = `
                <span>${skill}</span>
                <button>&times;</button>
            `;
            skillsList.appendChild(skillTag);
        });
    }

    function addDynamicEntry(type) {
        const dataKey = getListKey(type);
        const id = getCounter(dataKey);
        const newItem = { id };

        // Add placeholder data to make it visible
        switch (type) {
            case 'experience':
                newItem.title = 'New Job';
                newItem.company = 'Company Name';
                break;
            case 'education':
                newItem.institution = 'University Name';
                newItem.degree = 'Degree';
                break;
            case 'project':
                newItem.name = 'Project Name';
                break;
            case 'certification':
                newItem.name = 'Certificate Name';
                break;
            case 'language':
                newItem.name = 'Language';
                break;
        }

        if (!resumeData[dataKey]) {
            resumeData[dataKey] = [];
        }
        resumeData[dataKey].push(newItem);
        
        const container = document.getElementById(`${type}-list`);
        if (container) {
            renderList(type, container);
        }
        updatePreview();
    }

    function getCounter(type) {
        const dataKey = getListKey(type);
        if (!resumeData[dataKey] || resumeData[dataKey].length === 0) return 1;
        const ids = resumeData[dataKey].map(i => i.id).filter(Boolean);
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    function getItemHtml(type, item = {}) {
        const templates = {
            experience: `
                <input type="text" data-field="title" placeholder="Job Title" value="${item.title || ''}">
                <input type="text" data-field="company" placeholder="Company" value="${item.company || ''}">
                <input type="text" data-field="location" placeholder="Location (e.g., Remote)" value="${item.location || ''}">
                <div class="date-range">
                    <input type="number" data-field="startYear" placeholder="Start Year" min="1950" max="2030" value="${item.startYear || ''}">
                    <span>-</span>
                    <input type="number" data-field="endYear" placeholder="End Year" min="1950" max="2030" value="${item.endYear || ''}">
                </div>
                <textarea data-field="description" placeholder="Description of your role and achievements...&#10;Use line breaks to separate different achievements">${item.description || ''}</textarea>
            `,
            education: `
                <input type="text" data-field="institution" placeholder="Institution Name" value="${item.institution || ''}">
                <input type="text" data-field="degree" placeholder="Degree (e.g., B.S. in Computer Science)" value="${item.degree || ''}">
                <div class="date-range">
                    <input type="number" data-field="startYear" placeholder="Start Year" min="1950" max="2030" value="${item.startYear || ''}">
                    <span>-</span>
                    <input type="number" data-field="endYear" placeholder="End Year" min="1950" max="2030" value="${item.endYear || ''}">
                </div>
            `,
            project: `
                <input type="text" data-field="name" placeholder="Project Name" value="${item.name || ''}">
                <input type="text" data-field="technologies" placeholder="Technologies Used" value="${item.technologies || ''}">
                <input type="url" data-field="url" placeholder="Project URL (optional)" value="${item.url || ''}">
                <textarea data-field="description" placeholder="Project description and your role...">${item.description || ''}</textarea>
            `,
            certification: `
                <input type="text" data-field="name" placeholder="Certification Name" value="${item.name || ''}">
                <input type="text" data-field="issuer" placeholder="Issuing Organization" value="${item.issuer || ''}">
                <input type="number" data-field="year" placeholder="Year Obtained" min="1950" max="2030" value="${item.year || ''}">
                <input type="url" data-field="url" placeholder="Certification URL (optional)" value="${item.url || ''}">
            `,
            language: `
                <input type="text" data-field="language" placeholder="Language" value="${item.language || ''}">
                <select data-field="proficiency">
                    <option value="">Select Proficiency</option>
                    <option value="Native" ${item.proficiency === 'Native' ? 'selected' : ''}>Native</option>
                    <option value="Fluent" ${item.proficiency === 'Fluent' ? 'selected' : ''}>Fluent</option>
                    <option value="Advanced" ${item.proficiency === 'Advanced' ? 'selected' : ''}>Advanced</option>
                    <option value="Intermediate" ${item.proficiency === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                    <option value="Basic" ${item.proficiency === 'Basic' ? 'selected' : ''}>Basic</option>
                </select>
            `
        };
        return templates[type] || '';
    }

    function handleDynamicList(e, type) {
        if (e.target.classList.contains('remove-btn')) {
            const itemElement = e.target.closest('.dynamic-item');
            if(itemElement) {
                const itemId = parseInt(itemElement.dataset.id, 10);
                const dataKey = getListKey(type);
                
                const index = resumeData[dataKey].findIndex(item => item.id === itemId);
                if (index > -1) {
                    resumeData[dataKey].splice(index, 1);
                }
                
                itemElement.remove(); // Direct DOM removal for speed
                updatePreview();
            }
        }
    }

    function updatePreview() {
        const template = resumeData.template;
        const { personal, summary, experience, education, projects, skills, certifications, languages, awards, volunteering, hobbies, publications, template: templateName } = resumeData;
        const themeColor = templates[templateName].color;
        
        // Skills HTML
        const skillsHtml = skills.map(skill => `<span class="skill-item" style="background-color: ${themeColor}22; color: ${themeColor};">${skill}</span>`).join('');
        updateSkillsList();

        // Experience HTML
        const experienceHtml = experience.map(exp => {
            const descriptionWithBreaks = (exp.description || '').replace(/\n/g, '<br>');
            return `
            <div class="exp-item">
                <h4>${exp.title || ''} at ${exp.company || ''}</h4>
                <h5>${exp.startYear || ''} - ${exp.endYear || ''} | ${exp.location || ''}</h5>
                <p>${descriptionWithBreaks}</p>
            </div>
        `;
        }).join('');
        
        // Education HTML
        const educationHtml = education.map(edu => `
             <div class="edu-item">
                <h4>${edu.institution || ''}</h4>
                <h5>${edu.degree || ''} (${edu.startYear || ''} - ${edu.endYear || ''})</h5>
            </div>
        `).join('');

        // Projects HTML
        const projectsHtml = projects.map(proj => `
            <div class="proj-item">
                <h4>${proj.name || ''}</h4>
                <h5>${proj.technologies || ''}</h5>
                <p>${proj.description || ''}</p>
                ${proj.url ? `<a href="${proj.url}" target="_blank">View Project</a>` : ''}
            </div>
        `).join('');

        // Certifications HTML
        const certificationsHtml = certifications.map(cert => `
            <div class="cert-item">
                <h4>${cert.name || ''}</h4>
                <h5>${cert.issuer || ''} - ${cert.year || ''}</h5>
            </div>
        `).join('');

        // Languages HTML
        const languagesHtml = languages.map(lang => `
            <div class="lang-item">
                <span>${lang.language || ''}: ${lang.proficiency || ''}</span>
            </div>
        `).join('');

        // Additional Sections HTML
        const awardsHtml = awards && awards.length > 0 ? `<div class="rp-section"><h3>Awards</h3>${awards.map(a => `<div class='award-item'>${a.name || ''}${a.description ? ': ' + a.description : ''}</div>`).join('')}</div>` : '';
        const volunteeringHtml = volunteering && volunteering.length > 0 ? `<div class="rp-section"><h3>Volunteering</h3>${volunteering.map(v => `<div class='vol-item'>${v.name || ''}${v.description ? ': ' + v.description : ''}</div>`).join('')}</div>` : '';
        const hobbiesHtml = hobbies && hobbies.length > 0 ? `<div class="rp-section"><h3>Hobbies</h3>${hobbies.map(h => `<div class='hobby-item'>${h.name || h}</div>`).join('')}</div>` : '';
        const publicationsHtml = publications && publications.length > 0 ? `<div class="rp-section"><h3>Publications</h3>${publications.map(p => `<div class='pub-item'>${p.name || ''}${p.url ? `: <a href='${p.url}' target='_blank'>${p.url}</a>` : ''}</div>`).join('')}</div>` : '';

        // --- TEMPLATE-SPECIFIC RENDER LOGIC ---
        let previewHtml = '';

        if (template === 'modern') {
            // Two-column modern layout
            previewHtml = `
            <style>
                .rp-modern { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; }
                .rp-modern .left-column { background-color: ${themeColor}1A; padding: 2rem; border-right: 1px solid #e5e7eb; }
                .rp-modern .right-column { padding: 2rem; }
                .rp-modern .rp-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 5px solid ${themeColor}; }
                .rp-modern .rp-section h3 { font-size: 1.2rem; font-weight: 600; color: ${themeColor}; margin-top: 1.5rem; margin-bottom: 0.5rem; padding-bottom: 0.25rem; border-bottom: 2px solid ${themeColor}; }
                .rp-modern .rp-name { font-size: 2.2rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
                .rp-modern .rp-title { font-size: 1.1rem; font-weight: 500; color: #374151; margin-bottom: 1.5rem; }
                .rp-modern .contact-item { font-size: 0.9rem; margin-bottom: 0.5rem; }
                .rp-modern .skill-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
                .rp-modern .skill-item { background-color: ${themeColor}33; color: ${themeColor}; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.9rem; }
                .rp-modern .exp-item p { line-height: 1.6; white-space: pre-line; }
                .rp-modern .summary { font-style: italic; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6; }
            </style>
            <div class="rp-modern">
                <div class="left-column">
                    ${personal.photo ? `<img src="${personal.photo}" alt="Profile" class="rp-photo">` : ''}
                    <div class="rp-section">
                        <h3>Contact</h3>
                        <p class="contact-item">${personal.email || ''}</p>
                        <p class="contact-item">${personal.phone || ''}</p>
                        ${personal.linkedin ? `<p class="contact-item"><a href="${personal.linkedin}" style="color: ${themeColor};">LinkedIn</a></p>` : ''}
                        ${personal.github ? `<p class="contact-item"><a href="${personal.github}" style="color: ${themeColor};">GitHub</a></p>` : ''}
                        ${personal.portfolio ? `<p class="contact-item"><a href="${personal.portfolio}" style="color: ${themeColor};">Portfolio</a></p>` : ''}
                    </div>
                    <div class="rp-section">
                        <h3>Skills</h3>
                        <div class="skill-list">${skillsHtml}</div>
                    </div>
                    ${languages.length > 0 ? `<div class="rp-section"><h3>Languages</h3>${languagesHtml}</div>` : ''}
                </div>
                <div class="right-column">
                    <h1 class="rp-name">${personal.name || 'Your Name'}</h1>
                    <h2 class="rp-title">${personal.title || 'Professional Title'}</h2>
                    ${summary ? `<div class="summary">${summary}</div>` : ''}
                    ${experience.length > 0 ? `<div class="rp-section"><h3>Experience</h3>${experienceHtml}</div>` : ''}
                    ${education.length > 0 ? `<div class="rp-section"><h3>Education</h3>${educationHtml}</div>` : ''}
                    ${projects.length > 0 ? `<div class="rp-section"><h3>Projects</h3>${projectsHtml}</div>` : ''}
                    ${certifications.length > 0 ? `<div class="rp-section"><h3>Certifications</h3>${certificationsHtml}</div>` : ''}
                    ${awardsHtml}
                    ${volunteeringHtml}
                    ${hobbiesHtml}
                    ${publicationsHtml}
                </div>
            </div>
            `;
        } else {
            // Default single-column layout
            previewHtml = `
            <style>
                .resume-preview-content { padding: 2.5rem; font-family: 'Poppins', sans-serif; }
                .rp-header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 1.5rem; display:flex; align-items:center; gap: 1.5rem;}
                .rp-header img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid ${themeColor}; }
                .rp-header .rp-name { font-size: 2.5rem; font-weight: 700; color: #111827; margin:0;}
                .rp-header .rp-title { font-size: 1.2rem; font-weight: 500; color: ${themeColor}; margin:0;}
                .rp-contact { text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: #4b5563;}
                .rp-section { margin-bottom: 1.5rem; }
                .rp-section h3 { font-size: 1.3rem; font-weight: 600; color: ${themeColor}; border-bottom: 2px solid ${themeColor}66; padding-bottom: 0.3rem; margin-bottom: 0.8rem; }
                .skill-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .skill-item { padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; }
                .exp-item, .edu-item, .proj-item, .cert-item { margin-bottom: 1rem; }
                .exp-item h4, .edu-item h4, .proj-item h4, .cert-item h4 { font-size: 1.1rem; font-weight: 600; color: #1f2937; }
                .exp-item h5, .edu-item h5, .proj-item h5, .cert-item h5 { font-size: 0.9rem; font-weight: 500; color: #6b7280; margin: 0.2rem 0; }
                .exp-item p { font-size: 0.95rem; color: #374151; line-height: 1.6; white-space: pre-line; }
                .summary { font-style: italic; color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6; }
            </style>
            <div class="resume-preview-content">
                <div class="rp-header">
                    ${personal.photo ? `<img src="${personal.photo}" alt="Profile">` : ''}
                    <div>
                        <h1 class="rp-name">${personal.name || 'Your Name'}</h1>
                        <h2 class="rp-title">${personal.title || 'Professional Title'}</h2>
                    </div>
                </div>
                <div class="rp-contact">
                    ${personal.email || ''} | ${personal.phone || ''} | ${personal.linkedin ? `<a href="${personal.linkedin}" style="color: ${themeColor};">LinkedIn</a>` : ''}
                </div>
                
                ${summary ? `<div class="summary">${summary}</div>` : ''}
                
                ${experience.length > 0 ? `
                <div class="rp-section">
                    <h3>Experience</h3>
                    ${experienceHtml}
                </div>` : ''}
                
                ${education.length > 0 ? `
                <div class="rp-section">
                    <h3>Education</h3>
                    ${educationHtml}
                </div>` : ''}

                ${projects.length > 0 ? `
                <div class="rp-section">
                    <h3>Projects</h3>
                    ${projectsHtml}
                </div>` : ''}
                
                ${skills.length > 0 ? `
                <div class="rp-section">
                    <h3>Skills</h3>
                    <div class="skill-list">${skillsHtml}</div>
                </div>` : ''}

                ${certifications.length > 0 ? `
                <div class="rp-section">
                    <h3>Certifications</h3>
                    ${certificationsHtml}
                </div>` : ''}

                ${languages.length > 0 ? `
                <div class="rp-section">
                    <h3>Languages</h3>
                    ${languagesHtml}
                </div>` : ''}

                ${awardsHtml}
                ${volunteeringHtml}
                ${hobbiesHtml}
                ${publicationsHtml}
            </div>
            `;
        }

        preview.innerHTML = previewHtml.replace('</div></div>', `${awardsHtml}${volunteeringHtml}${hobbiesHtml}${publicationsHtml}</div></div>`);
    }

    // --- INITIALIZATION ---
    populateTemplates();
    updatePreview();
    populateForm();
}); 