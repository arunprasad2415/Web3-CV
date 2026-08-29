import { useState } from "react";

// Editor for a flat array of plain strings (goals, tags, typer words…):
// chips with remove + reorder, plus an add input. Reused across several
// sections instead of writing one of these per field.
export default function StringListEditor({ items, onChange, placeholder = "Add item…", emptyLabel = "Nothing added yet." }) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  }

  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function update(i, value) {
    const next = [...items];
    next[i] = value;
    onChange(next);
  }

  return (
    <div className="taglist">
      {items.length === 0 && <p className="taglist-empty">{emptyLabel}</p>}
      {items.map((item, i) => (
        <div className="tagchip" key={i}>
          <input
            className="tagchip-input"
            value={item}
            onChange={(e) => update(i, e.target.value)}
          />
          <div className="tagchip-actions">
            <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" title="Move up">
              ↑
            </button>
            <button type="button" className="icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down" title="Move down">
              ↓
            </button>
            <button type="button" className="icon-btn icon-btn-danger" onClick={() => remove(i)} aria-label="Remove" title="Remove">
              ✕
            </button>
          </div>
        </div>
      ))}
      <div className="tagadd">
        <input
          className="f-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          + Add
        </button>
      </div>
    </div>
  );
}
