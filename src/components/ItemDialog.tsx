import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'

import { COMBO, EXTRA_PATTY, type MenuItem } from '../data'
import { useStore } from '../lib/store'
import { lineUnitPrice, money } from '../shared/pricing'
import { Button } from './Button'
import { Img, TagBadge } from './Display'
import { Stepper, Switch, TextArea } from './Form'
import { Modal, useToast } from './Overlay'

/** Customise a menu item (combo, extra patty, note, quantity) and add it. */
export function ItemDialog({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { addItem, setBagOpen } = useStore()
  const toast = useToast()
  const [combo, setCombo] = useState(false)
  const [extraPatty, setExtraPatty] = useState(false)
  const [note, setNote] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (item) {
      setCombo(false)
      setExtraPatty(false)
      setNote('')
      setQty(1)
    }
  }, [item])

  const unit = item ? lineUnitPrice({ key: 'preview', kind: 'item', itemId: item.id, qty: 1, combo, extraPatty }) : 0

  const add = () => {
    if (!item) return
    addItem(item.id, qty, { combo, extraPatty, note })
    onClose()
    toast(
      `${qty} × ${item.name} added`,
      <button type="button" className="on-ink h-9 rounded-[10px] bg-ketchup px-3 text-[14px] font-semibold text-cream hover:bg-ketchup-2" onClick={() => setBagOpen(true)}>
        View bag
      </button>,
    )
  }

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      title={item?.name ?? 'Item'}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <Stepper value={qty} onChange={setQty} label="quantity" />
          <Button size="md" icon={<ShoppingBag aria-hidden />} onClick={add} data-autofocus>
            Add {money(unit * qty)}
          </Button>
        </div>
      }
    >
      {item && (
        <div className="grid gap-6 sm:grid-cols-[1fr_1.1fr]">
          <div className="flex aspect-square items-center justify-center rounded-[var(--radius-md)] bg-bun">
            <Img src={item.image} alt={item.name} className="h-[86%] w-[86%] object-contain drop-shadow-[0_18px_18px_rgb(0_0_0/0.25)]" eager />
          </div>
          <div className="flex flex-col gap-4">
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            )}
            <p className="text-[16px] leading-relaxed text-muted">{item.description}</p>
            <p className="text-[14px] font-semibold">
              {money(item.price)}, {item.kcal} kcal
            </p>
            {item.comboable && (
              <div className="flex flex-col gap-2">
                <Switch checked={combo} onChange={setCombo} label={`${COMBO.label} +${money(COMBO.price)}`} note={COMBO.note} />
                <Switch checked={extraPatty} onChange={setExtraPatty} label={`${EXTRA_PATTY.label} +${money(EXTRA_PATTY.price)}`} note="Stack it one higher" />
              </div>
            )}
            <TextArea label="Note for the grill" optional placeholder="No onions, extra pickles…" maxLength={140} value={note} onChange={(e) => setNote(e.target.value)} className="min-h-20" />
          </div>
        </div>
      )}
    </Modal>
  )
}
