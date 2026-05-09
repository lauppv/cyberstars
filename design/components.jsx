/*
 * CyberStars – Reusable Components
 * Syntax highlighting, code editor, gamification widgets
 */

/* ───── Syntax Highlighter (simple keyword-based) ───── */
const PYTHON_KEYWORDS = ['def','class','if','elif','else','for','while','return','import','from','as','try','except','finally','with','yield','lambda','pass','break','continue','and','or','not','in','is','True','False','None','print','range','len','input','int','str','float','list','dict','set','tuple','type','self'];
const JAVA_KEYWORDS = ['public','private','protected','static','void','class','interface','extends','implements','new','return','if','else','for','while','do','switch','case','break','continue','try','catch','finally','throw','throws','import','package','int','String','boolean','double','float','char','long','byte','short','null','true','false','this','super','final','abstract','System'];
const C_KEYWORDS = ['int','char','float','double','void','if','else','for','while','do','switch','case','break','continue','return','struct','typedef','enum','union','sizeof','static','extern','const','unsigned','signed','long','short','include','define','printf','scanf','main','NULL','malloc','free','stdin','stdout','stderr'];

function highlightCode(code, lang) {
  const keywords = lang === 'python' ? PYTHON_KEYWORDS : lang === 'java' ? JAVA_KEYWORDS : C_KEYWORDS;
  // Escape HTML
  let html = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Strings
  html = html.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, '<span class="syn-str">$&</span>');
  // Comments
  html = html.replace(/(\/\/.*$|#.*$)/gm, '<span class="syn-cmt">$&</span>');
  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$&</span>');
  // Keywords
  const kwPattern = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
  html = html.replace(kwPattern, '<span class="syn-kw">$&</span>');
  return html;
}

/* ───── CodeEditor Component ───── */
function CodeEditor({ initialCode, language, onRun, readOnly, height }) {
  const [code, setCode] = React.useState(initialCode || '');
  const [output, setOutput] = React.useState(null);
  const [running, setRunning] = React.useState(false);
  const [showAIHint, setShowAIHint] = React.useState(false);
  const [aiHint, setAiHint] = React.useState('');
  const [aiLoading, setAiLoading] = React.useState(false);
  const textareaRef = React.useRef(null);
  const preRef = React.useRef(null);

  const syncScroll = () => {
    if (preRef.current && textareaRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const simulateRun = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      // Simulate output based on code content
      let result = '';
      const printMatches = code.match(/print\s*\(([^)]*)\)/g) || code.match(/printf\s*\(([^)]*)\)/g) || code.match(/System\.out\.println\s*\(([^)]*)\)/g);
      if (printMatches) {
        result = printMatches.map(m => {
          const inner = m.match(/\(([^)]*)\)/);
          if (inner) {
            let val = inner[1].replace(/["']/g, '').trim();
            return val || '(empty)';
          }
          return '';
        }).join('\n');
      } else {
        result = '✓ Code executed successfully (no output)';
      }
      setOutput(result);
      setRunning(false);
      if (onRun) onRun(code);
    }, 800 + Math.random() * 600);
  };

  const getAIHint = async () => {
    setAiLoading(true);
    setShowAIHint(true);
    setTimeout(() => {
      const hints = {
        python: [
          "💡 Try using a for loop with range() to repeat an action multiple times. Example: for i in range(5) will loop 5 times!",
          "💡 Remember: Python uses indentation (spaces) to group code blocks. Make sure your code inside if/for/while is indented!",
          "💡 You can use f-strings to mix variables into text: print(f\"Hello {name}\")",
        ],
        java: [
          "💡 Every Java program needs a main method: public static void main(String[] args). This is where your program starts!",
          "💡 Don't forget semicolons at the end of each statement in Java — it's how Java knows where one instruction ends.",
          "💡 Use System.out.println() to print output. The 'ln' adds a new line automatically!",
        ],
        c: [
          "💡 In C, every program starts at main(). Don't forget to #include <stdio.h> for printf!",
          "💡 C uses curly braces {} to group code blocks. Every opening brace needs a closing one!",
          "💡 Remember: in C, you must declare variable types. Use int for whole numbers, float for decimals.",
        ]
      };
      const langHints = hints[language] || hints.python;
      setAiHint(langHints[Math.floor(Math.random() * langHints.length)]);
      setAiLoading(false);
    }, 1200);
  };

  const editorHeight = height || 200;

  return React.createElement('div', { className: 'code-editor' },
    React.createElement('div', { className: 'editor-toolbar' },
      React.createElement('div', { className: 'editor-lang-badge' },
        React.createElement('span', { className: 'lang-dot', style: { background: language === 'python' ? '#3572A5' : language === 'java' ? '#b07219' : '#555555' } }),
        language === 'python' ? 'Python 3' : language === 'java' ? 'Java' : 'C'
      ),
      React.createElement('div', { className: 'editor-actions' },
        React.createElement('button', { className: 'btn-hint', onClick: getAIHint, title: 'Get AI Hint' },
          React.createElement('span', null, '✨'), ' Hint'
        ),
        React.createElement('button', { className: 'btn-run', onClick: simulateRun, disabled: running },
          running ? React.createElement('span', { className: 'spinner' }) : React.createElement('span', null, '▶'),
          running ? ' Running...' : ' Run'
        )
      )
    ),
    React.createElement('div', { className: 'editor-body', style: { height: editorHeight } },
      React.createElement('div', { className: 'line-numbers' },
        code.split('\n').map((_, i) =>
          React.createElement('div', { key: i, className: 'line-num' }, i + 1)
        )
      ),
      React.createElement('div', { className: 'editor-code-area' },
        React.createElement('pre', { ref: preRef, className: 'editor-highlight', dangerouslySetInnerHTML: { __html: highlightCode(code, language) + '\n' } }),
        React.createElement('textarea', {
          ref: textareaRef,
          className: 'editor-textarea',
          value: code,
          onChange: e => setCode(e.target.value),
          onScroll: syncScroll,
          spellCheck: false,
          readOnly: readOnly
        })
      )
    ),
    showAIHint && React.createElement('div', { className: 'ai-hint-bar' },
      React.createElement('div', { className: 'ai-hint-header' },
        React.createElement('span', null, '🤖 CyberBot'),
        React.createElement('button', { onClick: () => setShowAIHint(false), className: 'hint-close' }, '×')
      ),
      aiLoading
        ? React.createElement('div', { className: 'ai-hint-loading' },
            React.createElement('span', { className: 'dot-pulse' }),
            ' Thinking...'
          )
        : React.createElement('div', { className: 'ai-hint-text' }, aiHint)
    ),
    output !== null && React.createElement('div', { className: 'editor-output' },
      React.createElement('div', { className: 'output-header' }, '⬡ Output'),
      React.createElement('pre', { className: 'output-text' }, output)
    )
  );
}

/* ───── XP Bar Component ───── */
function XPBar({ current, max, level }) {
  const pct = Math.min((current / max) * 100, 100);
  return React.createElement('div', { className: 'xp-bar-wrap' },
    React.createElement('div', { className: 'xp-label' },
      React.createElement('span', { className: 'xp-level' }, '⭐ Level ', level),
      React.createElement('span', { className: 'xp-numbers' }, current, ' / ', max, ' XP')
    ),
    React.createElement('div', { className: 'xp-track' },
      React.createElement('div', { className: 'xp-fill', style: { width: pct + '%' } })
    )
  );
}

/* ───── Streak Component ───── */
function StreakWidget({ days }) {
  const dayLabels = ['M','T','W','T','F','S','S'];
  return React.createElement('div', { className: 'streak-widget' },
    React.createElement('div', { className: 'streak-flame' }, '🔥'),
    React.createElement('div', { className: 'streak-count' }, days, ' day streak!'),
    React.createElement('div', { className: 'streak-days' },
      dayLabels.map((d, i) =>
        React.createElement('div', {
          key: i,
          className: 'streak-day ' + (i < days % 7 ? 'active' : '')
        }, d)
      )
    )
  );
}

/* ───── Badge Component ───── */
function Badge({ icon, label, earned }) {
  return React.createElement('div', { className: 'badge ' + (earned ? 'earned' : 'locked') },
    React.createElement('div', { className: 'badge-icon' }, icon),
    React.createElement('div', { className: 'badge-label' }, label)
  );
}

/* ───── Lesson Progress Sidebar ───── */
function LessonNav({ sections, currentSection, onNavigate }) {
  return React.createElement('div', { className: 'lesson-nav' },
    sections.map((s, i) =>
      React.createElement('div', {
        key: i,
        className: 'lesson-nav-item ' + (i === currentSection ? 'active' : '') + (i < currentSection ? ' completed' : ''),
        onClick: () => onNavigate(i)
      },
        React.createElement('div', { className: 'nav-marker' },
          i < currentSection ? '✓' : (i + 1)
        ),
        React.createElement('span', null, s)
      )
    )
  );
}

/* ───── Achievement Toast ───── */
function AchievementToast({ icon, title, xp, visible, onClose }) {
  return React.createElement('div', { className: 'achievement-toast ' + (visible ? 'show' : '') },
    React.createElement('div', { className: 'toast-icon' }, icon),
    React.createElement('div', { className: 'toast-content' },
      React.createElement('div', { className: 'toast-title' }, title),
      React.createElement('div', { className: 'toast-xp' }, '+', xp, ' XP')
    ),
    React.createElement('button', { className: 'toast-close', onClick: onClose }, '×')
  );
}

Object.assign(window, {
  highlightCode, CodeEditor, XPBar, StreakWidget, Badge,
  LessonNav, AchievementToast
});
