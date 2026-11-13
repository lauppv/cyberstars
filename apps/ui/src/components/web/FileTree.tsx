import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileCode,
  FilePlus,
  FileText,
  Film,
  Folder,
  FolderPlus,
  Image,
  Music,
  PanelLeftOpen,
  Pencil,
  Trash2,
} from 'lucide-react';
import { assetLanguage, extensionOf, type WebFile } from '@cyberstars/shared/webFiles';

// The files of a web lesson's site as a tree (CYB-109): folders first, then
// files, by name. A click on a file opens it; a folder picked is where a new
// file or folder goes. New, rename and delete go back to the IDE, which says
// whether they could be done: an error shows under the box the name was typed in.
// Closed (dev mode, its divider dragged to the left), the tree is a narrow
// strip that opens it again, or opens it on a new file or folder.

interface Node {
  name: string;
  path: string;
  folder: boolean;
  image: boolean;
  children: Node[];
}

function buildTree(files: WebFile[], folders: string[]): Node[] {
  const root: Node = { name: '', path: '', folder: true, image: false, children: [] };
  const folderNode = (path: string): Node => {
    let node = root;
    for (const name of path.split('/')) {
      const at = node.path ? `${node.path}/${name}` : name;
      let child = node.children.find((c) => c.folder && c.path === at);
      if (!child) {
        child = { name, path: at, folder: true, image: false, children: [] };
        node.children.push(child);
      }
      node = child;
    }
    return node;
  };
  for (const folder of folders) folderNode(folder);
  for (const file of files) {
    const cut = file.path.lastIndexOf('/');
    const parent = cut < 0 ? root : folderNode(file.path.slice(0, cut));
    parent.children.push({
      name: file.path.slice(cut + 1),
      path: file.path,
      folder: false,
      image: !!file.image,
      children: [],
    });
  }
  const sort = (node: Node) => {
    node.children.sort(
      (a, b) => Number(b.folder) - Number(a.folder) || a.name.localeCompare(b.name),
    );
    node.children.forEach(sort);
  };
  sort(root);
  return root.children;
}

type Editing =
  | { kind: 'file' | 'folder'; value: string }
  | { kind: 'rename'; from: string; value: string };

interface FileTreeProps {
  files: WebFile[];
  folders: string[];
  active: string | null;
  onOpen: (path: string) => void;
  // Each gives back the error to show, or null once done
  onCreate: (path: string, folder: boolean) => string | null;
  onRename: (from: string, to: string) => string | null;
  onDelete: (path: string, folder: boolean) => void;
  closed?: boolean;
  onShow?: () => void;
}

// The icon of a picture, a video or a sound of the course
const ASSET_ICONS = { image: Image, video: Film, audio: Music };

const iconButton =
  'w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface)] bg-transparent border-none cursor-pointer transition';

export function FileTree({
  files,
  folders,
  active,
  onOpen,
  onCreate,
  onRename,
  onDelete,
  closed = false,
  onShow,
}: FileTreeProps) {
  const { t } = useTranslation();
  const [picked, setPicked] = useState('');
  const [editing, setEditing] = useState<Editing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tree = buildTree(files, folders);

  const start = (next: Editing) => {
    setError(null);
    setEditing(next);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const value = editing.value.trim();
    const failed =
      editing.kind === 'rename'
        ? onRename(editing.from, value)
        : onCreate(value, editing.kind === 'folder');
    if (failed) {
      setError(failed);
    } else {
      setEditing(null);
      setError(null);
    }
  };

  const box = editing && (
    <form onSubmit={submit} className="px-2 py-1.5">
      <input
        autoFocus
        aria-label={
          editing.kind === 'rename'
            ? t('web.newName', { name: editing.from })
            : t(editing.kind === 'folder' ? 'web.folderName' : 'web.fileName')
        }
        placeholder={
          editing.kind === 'folder'
            ? t('web.folderExample')
            : editing.kind === 'file'
              ? t('web.fileExample')
              : undefined
        }
        value={editing.value}
        onChange={(e) => setEditing({ ...editing, value: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setEditing(null);
        }}
        onBlur={() => {
          if (!error) setEditing(null);
        }}
        aria-invalid={!!error}
        className="w-full px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[12px] font-mono text-[var(--text)]"
      />
      {error && (
        <p role="alert" className="mt-1 text-[11px] leading-snug text-[var(--error)]">
          {error}
        </p>
      )}
    </form>
  );

  const row = (node: Node, depth: number) => {
    const Icon = node.folder
      ? Folder
      : node.image
        ? ASSET_ICONS[assetLanguage(node.path) ?? 'image']
        : extensionOf(node.path) === 'txt'
          ? FileText
          : FileCode;
    const selected = node.folder ? picked === node.path : active === node.path;
    return (
      <li key={node.path}>
        <div
          className={`group flex items-center gap-1 pr-1 ${selected ? 'bg-[var(--surface)]' : 'hover:bg-[var(--glass)]'}`}
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          <button
            type="button"
            onClick={() => {
              if (node.folder) {
                setPicked(picked === node.path ? '' : node.path);
              } else {
                setPicked(
                  node.path.includes('/') ? node.path.slice(0, node.path.lastIndexOf('/')) : '',
                );
                onOpen(node.path);
              }
            }}
            aria-current={!node.folder && active === node.path ? 'true' : undefined}
            className={`flex-1 min-w-0 flex items-center gap-1.5 py-1 text-left text-[12px] font-mono bg-transparent border-none cursor-pointer ${selected ? 'text-[var(--text)]' : 'text-[var(--text2)]'}`}
          >
            <Icon size={13} aria-hidden="true" className="shrink-0 text-[var(--text3)]" />
            <span className="truncate">{node.name}</span>
          </button>
          {!node.image && !(node.folder && node.children.some((c) => c.image)) && (
            <span className="flex opacity-0 group-hover:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                aria-label={t('web.rename', { name: node.path })}
                title={t('web.rename', { name: node.path })}
                onClick={() => start({ kind: 'rename', from: node.path, value: node.path })}
                className={iconButton}
              >
                <Pencil size={12} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t('web.delete', { name: node.path })}
                title={t('web.delete', { name: node.path })}
                onClick={() => {
                  const question = node.folder ? 'web.confirmDeleteFolder' : 'web.confirmDelete';
                  if (window.confirm(t(question, { name: node.path }))) {
                    onDelete(node.path, node.folder);
                    if (picked === node.path) setPicked('');
                  }
                }}
                className={iconButton}
              >
                <Trash2 size={12} aria-hidden="true" />
              </button>
            </span>
          )}
        </div>
        {editing?.kind === 'rename' && editing.from === node.path && box}
        {node.folder && node.children.length > 0 && (
          <ul className="list-none m-0 p-0">{node.children.map((c) => row(c, depth + 1))}</ul>
        )}
      </li>
    );
  };

  const into = picked ? `${picked}/` : '';
  const newFile = (
    <button
      type="button"
      aria-label={t('web.newFile')}
      title={t('web.newFile')}
      onClick={() => {
        onShow?.();
        start({ kind: 'file', value: into });
      }}
      className={iconButton}
    >
      <FilePlus size={14} aria-hidden="true" />
    </button>
  );
  const newFolder = (
    <button
      type="button"
      aria-label={t('web.newFolder')}
      title={t('web.newFolder')}
      onClick={() => {
        onShow?.();
        start({ kind: 'folder', value: into });
      }}
      className={iconButton}
    >
      <FolderPlus size={14} aria-hidden="true" />
    </button>
  );

  if (closed) {
    return (
      <div className="flex flex-col items-center gap-1 py-1.5 min-h-0 h-full">
        <button
          type="button"
          aria-label={t('web.showFiles')}
          title={t('web.showFiles')}
          onClick={onShow}
          className={iconButton}
        >
          <PanelLeftOpen size={14} aria-hidden="true" />
        </button>
        {newFile}
        {newFolder}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex items-center justify-between pl-3 pr-1 py-1.5 border-b border-[var(--border)]">
        <span className="section-label">{t('web.files')}</span>
        <span className="flex">
          {newFile}
          {newFolder}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto py-1">
        {editing && editing.kind !== 'rename' && box}
        {tree.length === 0 && !editing ? (
          <p className="px-3 py-2 text-[12px] text-[var(--text3)]">{t('web.noFiles')}</p>
        ) : (
          <ul className="list-none m-0 p-0">{tree.map((node) => row(node, 0))}</ul>
        )}
      </div>
    </div>
  );
}
