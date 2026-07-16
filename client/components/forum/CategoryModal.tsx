import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as forumService from '../../services/forumService';
import type { ForumCategoryDTO } from '../../../shared/forum';

const inputCls =
  'w-full px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text)] outline-none focus:border-[var(--accent)]/60 transition';
const labelCls = 'text-[12px] font-semibold text-[var(--text2)]';

export function CategoryModal({
  category,
  groups,
  onClose,
  onSaved,
}: {
  /** Present in edit mode; absent for creation. */
  category?: ForumCategoryDTO;
  /** Existing group names, offered as a datalist. */
  groups: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const editing = category != null;

  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '💬');
  const [color, setColor] = useState(category?.color ?? '#6C5CE7');
  const [groupName, setGroupName] = useState(category?.groupName ?? groups[0] ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const valid = name.trim() && description.trim() && icon.trim() && groupName.trim();

  const handleSubmit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
      color,
      groupName: groupName.trim(),
    };
    try {
      if (editing) {
        await forumService.updateCategory(category.slug, payload);
      } else {
        await forumService.createCategory(payload);
      }
      onSaved();
    } catch {
      setError(t('forum.categoryModal.error'));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[520px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--accent)]/30 rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--accent)]/20 sticky top-0 bg-[var(--bg2)] z-[1]">
          <div className="text-base font-bold">
            {editing ? t('forum.categoryModal.editTitle') : t('forum.categoryModal.createTitle')}
          </div>
          <button
            onClick={onClose}
            aria-label={t('forum.categoryModal.cancel')}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t('forum.categoryModal.name')}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder={t('forum.categoryModal.namePlaceholder')}
              className={inputCls}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t('forum.categoryModal.description')}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder={t('forum.categoryModal.descriptionPlaceholder')}
              className={`${inputCls} resize-y`}
            />
          </label>

          <div className="flex gap-4">
            <label className="flex flex-col gap-1.5 w-24">
              <span className={labelCls}>{t('forum.categoryModal.icon')}</span>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={10}
                placeholder={t('forum.categoryModal.iconPlaceholder')}
                className={`${inputCls} text-center text-lg`}
              />
            </label>
            <label className="flex flex-col gap-1.5 w-24">
              <span className={labelCls}>{t('forum.categoryModal.color')}</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-[42px] rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] cursor-pointer p-1"
              />
            </label>
            <label className="flex flex-col gap-1.5 flex-1">
              <span className={labelCls}>{t('forum.categoryModal.group')}</span>
              <input
                type="text"
                list="forum-group-options"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={50}
                placeholder={t('forum.categoryModal.groupPlaceholder')}
                className={inputCls}
              />
              <datalist id="forum-group-options">
                {groups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </label>
          </div>

          {error && <div className="text-[13px] text-[var(--error)]">{error}</div>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text2)] font-semibold hover:text-[var(--text)] transition cursor-pointer"
            >
              {t('forum.categoryModal.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !valid}
              className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)] font-semibold hover:bg-[var(--accent)]/25 transition cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              {submitting
                ? t('forum.categoryModal.saving')
                : editing
                  ? t('forum.categoryModal.save')
                  : t('forum.categoryModal.create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
