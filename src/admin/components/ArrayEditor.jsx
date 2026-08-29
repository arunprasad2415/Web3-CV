import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog.jsx";

// Generic "list of cards" editor for arrays of objects (experience, NFTs,
// tweets, achievements…). Each card shows a summary and expands in place
// to edit — no giant all-at-once form, no modal system to build/maintain.
export default function ArrayEditor({
  items,
  onChange,
  renderSummary, // (item) => { title, subtitle }
  renderEditor, // (item, update) => JSX, update(patch) merges into the item
  newItem, // () => default shape for a new entry
  itemLabel = "Item",
  emptyLabel,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // index or null

  function update(i, patch) {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    onChange(next);
  }

  function add() {
    const next = [...items, newItem()];
    onChange(next);
    setOpenIndex(next.length - 1);
  }

  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i));
    setConfirmDelete(null);
    if (openIndex === i) setOpenIndex(null);
  }

  function duplicate(i) {
    const next = [...items];
    next.splice(i + 1, 0, { ...items[i] });
    onChange(next);
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    if (openIndex === i) setOpenIndex(j);
    else if (openIndex === j) setOpenIndex(i);
  }

  return (
    <div className="array-editor">
      {items.length === 0 && <p className="array-empty">{emptyLabel || `No ${itemLabel.toLowerCase()}s yet.`}</p>}

      {items.map((item, i) => {
        const { title, subtitle } = renderSummary(item);
        const open = openIndex === i;
        return (
          <div className={`item-card ${open ? "item-card-open" : ""}`} key={i}>
            <button type="button" className="item-card-head" onClick={() => setOpenIndex(open ? null : i)}>
              <div className="item-card-titles">
                <span className="item-card-title">{title || `Untitled ${itemLabel}`}</span>
                {subtitle && <span className="item-card-subtitle">{subtitle}</span>}
              </div>
              <span className={`item-card-chevron ${open ? "item-card-chevron-open" : ""}`}>⌄</span>
            </button>

            {open && (
              <div className="item-card-body">
                {renderEditor(item, (patch) => update(i, patch), i)}
                <div className="item-card-actions">
                  <div className="item-card-actions-left">
                    <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} title="Move up">
                      ↑ Move up
                    </button>
                    <button type="button" className="icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} title="Move down">
                      ↓ Move down
                    </button>
                    <button type="button" className="icon-btn" onClick={() => duplicate(i)} title="Duplicate">
                      ⧉ Duplicate
                    </button>
                  </div>
                  <button type="button" className="btn-danger-text" onClick={() => setConfirmDelete(i)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className="btn btn-ghost add-item-btn" onClick={add}>
        + Add {itemLabel}
      </button>

      <ConfirmDialog
        open={confirmDelete !== null}
        title={`Delete this ${itemLabel.toLowerCase()}?`}
        body="This can't be undone once you save."
        confirmLabel="Delete"
        danger
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => remove(confirmDelete)}
      />
    </div>
  );
}
