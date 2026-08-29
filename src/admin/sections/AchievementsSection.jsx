import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField, NumberField } from "../components/Fields.jsx";

const toObj = ([label, number]) => ({ label, number });
const toTuple = ({ label, number }) => [label, number];

export default function AchievementsSection({ achievements, onChange }) {
  const items = achievements.map(toObj);

  return (
    <div className="section-stack">
      <p className="section-intro">The glowing counters in the Achievements section.</p>
      <ArrayEditor
        items={items}
        onChange={(next) => onChange(next.map(toTuple))}
        itemLabel="Achievement"
        renderSummary={(it) => ({ title: it.label, subtitle: `${it.number}+` })}
        newItem={() => ({ label: "New achievement", number: 0 })}
        renderEditor={(it, update) => (
          <div className="field-grid">
            <TextField label="Label" value={it.label} onChange={(v) => update({ label: v })} placeholder="e.g. Collabs Secured" />
            <NumberField label="Number" value={it.number} onChange={(v) => update({ number: v })} />
          </div>
        )}
      />
    </div>
  );
}
