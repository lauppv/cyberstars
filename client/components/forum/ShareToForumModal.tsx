import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as forumService from '../../services/forumService';
import { forumRoutes } from '../../constants/forumRoutes';
import { RESTRICTED_FORUM_CATEGORIES } from '../../../shared/constants';
import type { ForumCategoryDTO } from '../../../shared/forum';
import { CodeEditor } from '../code/CodeEditor';

const FENCE_LANG: Record<string, string> = {
  py: 'python',
  python: 'python',
  'algo-python': 'python',
  c: 'c',
  'algo-c': 'c',
  java: 'java',
  'algo-java': 'java',
  kotlin: 'kotlin',
  'algo-kotlin': 'kotlin',
};

export function ShareToForumModal({
  code,
  language,
  lessonTitle,
  onClose,
}: {
  code: string;
  language: string;
  lessonTitle?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ForumCategoryDTO[]>([]);
  const [categorySlug, setCategorySlug] = useState('');
  const [title, setTitle] = useState(lessonTitle ?? '');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fenceLang = FENCE_LANG[language.toLowerCase()] ?? language.toLowerCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    forumService
      .getCategories()
      .then((cats) => {
        const allowed = cats.filter((c) => !RESTRICTED_FORUM_CATEGORIES.has(c.slug));
        setCategories(allowed);
        if (allowed.length > 0) setCategorySlug(allowed[0].slug);
      })
      .catch(() => setError(t('forum.share.loadError')));
  }, [t]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !categorySlug || submitting) return;
    setSubmitting(true);
    setError(null);
    const codeBlock = `\`\`\`${fenceLang}\n${code}\n\`\`\``;
    const note = description.trim();
    const content = note ? `${codeBlock}\n\n${note}` : codeBlock;
    try {
      const { threadId } = await forumService.createThread({
        categorySlug,
        title: trimmedTitle,
        content,
      });
      onClose();
      navigate(forumRoutes.thread(threadId));
    } catch {
      setError(t('forum.share.postError'));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[600px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--border)] rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg2)] z-[1]">
          <div className="text-base font-bold">{t('forum.share.title')}</div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--text2)]">
              {t('forum.share.threadTitle')}
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder={t('forum.share.threadTitlePlaceholder')}
              className="w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--text2)]">
              {t('forum.share.category')}
            </span>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--text2)]">
              {t('forum.share.attachedCode')}
            </span>
            <div className="border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden bg-[#111820]">
              <CodeEditor value={code} language={fenceLang} fontSize="13px" readOnly />
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--text2)]">
              {t('forum.share.description')}
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={t('forum.share.descriptionPlaceholder')}
              className="w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition resize-y"
            />
          </label>

          {error && <div className="text-[13px] text-[var(--error)]">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text2)] font-semibold hover:text-[var(--text)] transition cursor-pointer"
            >
              {t('forum.share.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !categorySlug}
              className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)] font-semibold hover:bg-[var(--accent)]/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              {submitting ? t('forum.share.posting') : t('forum.share.post')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
