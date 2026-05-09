/*
 * CyberStars – Main App
 * Lesson view with split layout, gamification, AI hints
 */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#6C5CE7",
  "editorTheme": "dark",
  "sidebarOpen": true,
  "gamificationDensity": "full"
}/*EDITMODE-END*/;

/* ───── Lesson Data ───── */
const LESSON_DATA = {
  title: "Variables & Data Types",
  course: "Python Fundamentals",
  chapter: 2,
  totalChapters: 12,
  xpReward: 50,
  sections: [
    "What are Variables?",
    "Naming Rules",
    "Data Types",
    "Type Conversion",
    "Practice Challenge"
  ],
  content: [
    {
      title: "What are Variables?",
      body: `Think of a variable as a **labeled box** that stores information. You give the box a name, and you can put things inside it — numbers, text, or even lists of things!\n\nIn Python, creating a variable is super easy. You just pick a name, use the \`=\` sign, and assign a value:`,
      code: `# Let's create some variables!\nmy_name = "CyberStar"\nmy_age = 14\nfavorite_number = 42.5\n\nprint(my_name)\nprint("Age:", my_age)\nprint("Fav number:", favorite_number)`,
      tip: "Variables are like sticky notes — you can change what's written on them anytime!"
    },
    {
      title: "Naming Rules",
      body: `Not every name works for a variable. Python has some rules:\n\n✅ **Can** start with a letter or underscore\n✅ **Can** contain letters, numbers, and underscores\n❌ **Cannot** start with a number\n❌ **Cannot** use spaces or special characters\n❌ **Cannot** use Python keywords like \`if\`, \`for\`, \`while\`\n\nAlso — Python is **case-sensitive**! \`myName\` and \`myname\` are different variables.`,
      code: `# Good variable names ✅\nplayer_score = 100\n_secret_code = "abc123"\nhighScore2 = 9999\n\n# This would cause an error! ❌\n# 2nd_place = "silver"\n# my-name = "Nope"\n\nprint("Score:", player_score)\nprint("High Score:", highScore2)`,
      tip: "Pro tip: use snake_case (words_with_underscores) — it's the Python way!"
    },
    {
      title: "Data Types",
      body: `Every value in Python has a **type**. The main types you'll use are:\n\n| Type | What it stores | Example |\n|------|---------------|--------|\n| \`str\` | Text (strings) | \`"hello"\` |\n| \`int\` | Whole numbers | \`42\` |\n| \`float\` | Decimal numbers | \`3.14\` |\n| \`bool\` | True or False | \`True\` |\n\nYou can check any value's type using the \`type()\` function:`,
      code: `# Let's explore data types!\nname = "CyberStar"    # str\nlevel = 7              # int\nhealth = 98.5          # float\nis_alive = True        # bool\n\nprint(type(name))\nprint(type(level))\nprint(type(health))\nprint(type(is_alive))`,
      tip: "Strings always need quotes around them. Numbers don't!"
    },
    {
      title: "Type Conversion",
      body: `Sometimes you need to convert between types. Python makes this easy with built-in functions:\n\n- \`str()\` — converts to text\n- \`int()\` — converts to whole number\n- \`float()\` — converts to decimal\n\nThis is especially useful when combining text with numbers:`,
      code: `# Type conversion in action!\nage = 14\nage_text = str(age)\n\nprint("I am " + age_text + " years old")\n\n# Converting strings to numbers\nprice_text = "9.99"\nprice = float(price_text)\ntax = price * 0.1\n\nprint("Tax:", tax)`,
      tip: "You can't add a string and a number directly — convert first!"
    },
    {
      title: "Practice Challenge",
      body: `🏆 **Challenge Time!**\n\nCreate a program that:\n1. Stores your name in a variable\n2. Stores your birth year as a number\n3. Calculates your age (use 2026 as current year)\n4. Prints a message like: *"Hi, I'm Alex and I'm 14 years old!"*\n\nEdit the code below to complete the challenge:`,
      code: `# 🏆 Complete the challenge!\n# Step 1: Store your name\nmy_name = "___"\n\n# Step 2: Store your birth year\nbirth_year = ___\n\n# Step 3: Calculate age\ncurrent_year = 2026\nmy_age = current_year - birth_year\n\n# Step 4: Print the message\nprint("Hi, I'm " + my_name + " and I'm " + str(my_age) + " years old!")`,
      tip: "Replace the ___ with your own values and hit Run!"
    }
  ]
};

/* ───── Markdown-lite renderer ───── */
function renderMarkdown(text) {
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  // Simple table support
  if (html.includes('|')) {
    const lines = html.split('<br/>');
    let inTable = false;
    let tableHtml = '<table class="md-table">';
    let resultLines = [];
    lines.forEach((line, i) => {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) { inTable = true; }
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        if (cells.every(c => /^-+$/.test(c))) return; // separator row
        const tag = !tableHtml.includes('<tr>') ? 'th' : 'td';
        tableHtml += '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
      } else {
        if (inTable) {
          tableHtml += '</table>';
          resultLines.push(tableHtml);
          tableHtml = '<table class="md-table">';
          inTable = false;
        }
        resultLines.push(line);
      }
    });
    if (inTable) { tableHtml += '</table>'; resultLines.push(tableHtml); }
    html = resultLines.join('<br/>');
  }

  return '<p>' + html + '</p>';
}

/* ───── Main App ───── */
/* ───── Profile Modal ───── */
function ProfileModal({ onClose, xp, streak, completedSections }) {
  const badges = [
    { icon: '🐍', label: 'First Code', earned: true, desc: 'Run your first program' },
    { icon: '⚡', label: 'Speed Run', earned: true, desc: 'Complete a lesson in under 5 min' },
    { icon: '🔥', label: 'On Fire', earned: true, desc: 'Reach a 5-day streak' },
    { icon: '🧠', label: 'Bug Squasher', earned: false, desc: 'Fix 10 code errors' },
    { icon: '🌟', label: 'Perfect Score', earned: false, desc: 'Ace all challenges in a course' },
    { icon: '🏆', label: 'Champion', earned: false, desc: 'Complete an entire course' },
    { icon: '💎', label: 'Collector', earned: false, desc: 'Earn all badges in a language' },
    { icon: '🚀', label: 'Rocket', earned: false, desc: 'Reach Level 10' },
  ];

  const courses = [
    { icon: '🐍', name: 'Python Fundamentals', progress: 17, total: 100, color: '#3572A5' },
    { icon: '☕', name: 'Java Basics', progress: 5, total: 100, color: '#b07219' },
    { icon: '⚙️', name: 'C Programming', progress: 0, total: 100, color: '#555555' },
  ];

  return React.createElement('div', { className: 'profile-overlay', onClick: e => { if (e.target === e.currentTarget) onClose(); } },
    React.createElement('div', { className: 'profile-modal' },
      React.createElement('div', { className: 'profile-header' },
        React.createElement('div', { className: 'profile-avatar' }, '🚀'),
        React.createElement('div', { className: 'profile-info' },
          React.createElement('div', { className: 'profile-name' }, 'Alex'),
          React.createElement('div', { className: 'profile-joined' }, 'Joined March 2026')
        ),
        React.createElement('button', { className: 'profile-close', onClick: onClose }, '×')
      ),
      React.createElement('div', { className: 'profile-stats' },
        React.createElement('div', { className: 'profile-stat' },
          React.createElement('div', { className: 'profile-stat-value' }, xp),
          React.createElement('div', { className: 'profile-stat-label' }, 'Total XP')
        ),
        React.createElement('div', { className: 'profile-stat' },
          React.createElement('div', { className: 'profile-stat-value' }, streak),
          React.createElement('div', { className: 'profile-stat-label' }, 'Day Streak')
        ),
        React.createElement('div', { className: 'profile-stat' },
          React.createElement('div', { className: 'profile-stat-value' }, badges.filter(b => b.earned).length),
          React.createElement('div', { className: 'profile-stat-label' }, 'Badges')
        )
      ),
      React.createElement('div', { className: 'profile-xp-section' },
        React.createElement(XPBar, { current: xp, max: 300, level: 4 })
      ),
      React.createElement('div', { className: 'profile-section' },
        React.createElement('div', { className: 'profile-section-title' }, 'Courses'),
        React.createElement('div', { className: 'profile-courses' },
          courses.map((c, i) =>
            React.createElement('div', { key: i, className: 'profile-course' },
              React.createElement('div', { className: 'profile-course-icon' }, c.icon),
              React.createElement('div', { className: 'profile-course-info' },
                React.createElement('div', { className: 'profile-course-name' }, c.name),
                React.createElement('div', { className: 'profile-course-progress' }, c.progress, '% complete'),
                React.createElement('div', { className: 'profile-course-bar' },
                  React.createElement('div', { className: 'profile-course-fill', style: { width: c.progress + '%', background: c.color } })
                )
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'profile-section', style: { paddingTop: 0 } },
        React.createElement('div', { className: 'profile-section-title' }, 'Badges'),
        React.createElement('div', { className: 'badges-grid' },
          badges.map((b, i) =>
            React.createElement(Badge, { key: i, icon: b.icon, label: b.label, earned: b.earned })
          )
        )
      )
    )
  );
}

function CyberStarsApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [currentSection, setCurrentSection] = React.useState(0);
  const [completedSections, setCompletedSections] = React.useState(new Set());
  const [xp, setXp] = React.useState(120);
  const [streak, setStreak] = React.useState(5);
  const [showToast, setShowToast] = React.useState(false);
  const [toastData, setToastData] = React.useState({ icon: '', title: '', xp: 0 });
  const [sidebarOpen, setSidebarOpen] = React.useState(tweaks.sidebarOpen);
  const [showProfile, setShowProfile] = React.useState(false);
  const contentRef = React.useRef(null);

  const section = LESSON_DATA.content[currentSection];
  const isChallenge = currentSection === LESSON_DATA.content.length - 1;

  const handleRunCode = () => {
    if (!completedSections.has(currentSection)) {
      const newCompleted = new Set(completedSections);
      newCompleted.add(currentSection);
      setCompletedSections(newCompleted);

      const gained = isChallenge ? 50 : 15;
      setXp(prev => prev + gained);

      setToastData({
        icon: isChallenge ? '🏆' : '✅',
        title: isChallenge ? 'Challenge Complete!' : 'Section Complete!',
        xp: gained
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const goNext = () => {
    if (currentSection < LESSON_DATA.content.length - 1) {
      setCurrentSection(currentSection + 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const goPrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const accent = tweaks.accentColor;
  const gamFull = tweaks.gamificationDensity === 'full';

  return React.createElement('div', {
    className: 'app ' + tweaks.editorTheme,
    style: { '--accent': accent, '--accent-glow': accent + '33' }
  },
    /* ── Top Bar ── */
    React.createElement('header', { className: 'topbar' },
      React.createElement('div', { className: 'topbar-left' },
        React.createElement('button', {
          className: 'sidebar-toggle',
          onClick: () => setSidebarOpen(!sidebarOpen)
        }, sidebarOpen ? '◀' : '▶'),
        React.createElement('div', { className: 'logo' },
          React.createElement('span', { className: 'logo-icon' }, '⬡'),
          React.createElement('span', { className: 'logo-text' }, 'CyberStars')
        ),
        React.createElement('div', { className: 'breadcrumb' },
          React.createElement('span', { className: 'bc-course' }, LESSON_DATA.course),
          React.createElement('span', { className: 'bc-sep' }, '/'),
          React.createElement('span', { className: 'bc-lesson' }, 'Ch. ', LESSON_DATA.chapter, ': ', LESSON_DATA.title)
        )
      ),
      React.createElement('div', { className: 'topbar-right' },
        gamFull && React.createElement(StreakWidget, { days: streak }),
        React.createElement('div', { className: 'user-avatar', onClick: () => setShowProfile(true) },
          React.createElement('div', { className: 'avatar-img' }, '🚀'),
          React.createElement('span', { className: 'avatar-name' }, 'Alex')
        )
      )
    ),

    /* ── XP Bar (compact row) ── */
    gamFull && React.createElement('div', { className: 'topbar-xp-row' },
      React.createElement(XPBar, { current: xp, max: 300, level: 4 })
    ),

    /* ── Main Layout ── */
    React.createElement('div', { className: 'main-layout' },
      /* Sidebar */
      sidebarOpen && React.createElement('aside', { className: 'sidebar' },
        React.createElement('div', { className: 'sidebar-header' }, 'Lesson Progress'),
        React.createElement(LessonNav, {
          sections: LESSON_DATA.sections,
          currentSection: currentSection,
          onNavigate: (i) => { setCurrentSection(i); if (contentRef.current) contentRef.current.scrollTop = 0; }
        }),
        React.createElement('div', { className: 'sidebar-progress' },
          React.createElement('div', { className: 'sp-label' },
            completedSections.size, ' / ', LESSON_DATA.sections.length, ' completed'
          ),
          React.createElement('div', { className: 'sp-bar' },
            React.createElement('div', { className: 'sp-fill', style: { width: (completedSections.size / LESSON_DATA.sections.length * 100) + '%' } })
          )
        ),

      ),

      /* Content + Editor Split */
      React.createElement('div', { className: 'content-split' },
        /* Left: Lesson Content */
        React.createElement('div', { className: 'lesson-content', ref: contentRef },
          React.createElement('div', { className: 'lesson-header' },
            React.createElement('div', { className: 'section-badge' }, 'Section ', currentSection + 1, ' of ', LESSON_DATA.sections.length),
            React.createElement('h1', { className: 'lesson-title' }, section.title),
            isChallenge && React.createElement('div', { className: 'challenge-badge' }, '🏆 Challenge')
          ),
          React.createElement('div', {
            className: 'lesson-body',
            dangerouslySetInnerHTML: { __html: renderMarkdown(section.body) }
          }),
          section.tip && React.createElement('div', { className: 'tip-box' },
            React.createElement('div', { className: 'tip-icon' }, '💡'),
            React.createElement('div', { className: 'tip-text' }, section.tip)
          ),
          React.createElement('div', { className: 'lesson-nav-buttons' },
            React.createElement('button', {
              className: 'btn-nav prev',
              onClick: goPrev,
              disabled: currentSection === 0
            }, '← Previous'),
            React.createElement('button', {
              className: 'btn-nav next',
              onClick: goNext,
              disabled: currentSection === LESSON_DATA.content.length - 1
            }, 'Next →')
          )
        ),

        /* Right: Code Editor */
        React.createElement('div', { className: 'editor-panel' },
          React.createElement('div', { className: 'editor-panel-header' },
            React.createElement('span', null, '⌨️ Code Playground'),
            React.createElement('div', { className: 'editor-panel-actions' },
              React.createElement('button', {
                className: 'btn-reset',
                onClick: () => {} // placeholder
              }, '↺ Reset')
            )
          ),
          React.createElement(CodeEditor, {
            initialCode: section.code,
            language: 'python',
            onRun: handleRunCode,
            height: 260,
            key: currentSection // force remount on section change
          })
        )
      )
    ),

    /* Profile Modal */
    showProfile && React.createElement(ProfileModal, {
      onClose: () => setShowProfile(false),
      xp: xp,
      streak: streak,
      completedSections: completedSections
    }),

    /* Achievement Toast */
    React.createElement(AchievementToast, {
      icon: toastData.icon,
      title: toastData.title,
      xp: toastData.xp,
      visible: showToast,
      onClose: () => setShowToast(false)
    }),

    /* Tweaks Panel */
    React.createElement(TweaksPanel, null,
      React.createElement(TweakSection, { title: 'Theme' },
        React.createElement(TweakColor, { label: 'Accent Color', value: tweaks.accentColor, onChange: v => setTweak('accentColor', v) }),
        React.createElement(TweakRadio, {
          label: 'Editor Theme', value: tweaks.editorTheme,
          options: [{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }],
          onChange: v => setTweak('editorTheme', v)
        })
      ),
      React.createElement(TweakSection, { title: 'Layout' },
        React.createElement(TweakToggle, { label: 'Show Sidebar', value: sidebarOpen, onChange: v => { setSidebarOpen(v); setTweak('sidebarOpen', v); } }),
        React.createElement(TweakRadio, {
          label: 'Gamification', value: tweaks.gamificationDensity,
          options: [{ label: 'Full', value: 'full' }, { label: 'Minimal', value: 'minimal' }],
          onChange: v => setTweak('gamificationDensity', v)
        })
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(CyberStarsApp));
