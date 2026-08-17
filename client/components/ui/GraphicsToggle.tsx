import { useTranslation } from 'react-i18next';
import { Segmented } from './Segmented';
import { useGraphicsPreview, type GraphicsMode } from '../../hooks/useGraphics';

const OPTIONS: GraphicsMode[] = ['min', 'max'];

/**
 * The graphics switch offered on the home and sign-in pages.
 *
 * Those two are reachable without an account, so they are where someone first
 * learns the site has two looks. They always open in min and this control lets
 * the visitor try max on the spot — it changes only the current visit, never
 * what is stored in settings, so a signed-in person's own choice survives.
 */
export function GraphicsToggle() {
  const { t } = useTranslation();
  const [graphics, setGraphics] = useGraphicsPreview();

  return (
    // No frame of its own: the wrapper only positions the control and backs it
    // with an opaque surface, so the inactive half stays readable over the
    // starfield. It hugs the control exactly, at the control's own radius.
    <div className="fixed bottom-4 left-4 z-40 w-fit overflow-hidden rounded-[var(--radius-sm)] bg-[var(--popover)] backdrop-blur-[var(--panel-blur)]">
      <Segmented
        value={graphics}
        options={OPTIONS}
        onChange={setGraphics}
        optionLabel={(opt) => t(`graphics.${opt}`)}
        ariaLabel={t('graphics.switch')}
      />
    </div>
  );
}
