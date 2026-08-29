import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField, NumberField } from "../components/Fields.jsx";

// ABOUT_STATS items are tuples [label, number, suffix] — mapped to/from a
// small object shape so the generic ArrayEditor/Fields can work with them.
const toObj = ([label, number, suffix]) => ({ label, number, suffix });
const toTuple = ({ label, number, suffix }) => [label, number, suffix];

export default function AboutStatsSection({ stats, onChange }) {
  const items = stats.map(toObj);

  return (
    <div className="section-stack">
      <p className="section-intro">The animated counters in the About section.</p>
      <ArrayEditor
        items={items}
        onChange={(next) => onChange(next.map(toTuple))}
        itemLabel="Stat"
        renderSummary={(it) => ({ title: it.label, subtitle: `${it.number}${it.suffix || ""}` })}
        newItem={() => ({ label: "New stat", number: 0, suffix: "+" })}
        renderEditor={(it, update) => (
          <div className="field-grid">
            <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} placeholder="e.g. Years in Web3" />
            <NumberField label="Number" value={it.number} onChange={(v) => update({ number: v })} />
            <TextField label="Suffix" value={it.suffix} onChange={(v) => update({ suffix: v })} placeholder="e.g. +" hint="Shown right after the number" />
          </div>
        )}
      />
    </div>
  );
}
