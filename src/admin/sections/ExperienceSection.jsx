import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField } from "../components/Fields.jsx";
import StringListEditor from "../components/StringListEditor.jsx";

export default function ExperienceSection({ experience, onChange }) {
  return (
    <div className="section-stack">
      <p className="section-intro">The vertical timeline. Order here matches the order on the site, top to bottom.</p>
      <ArrayEditor
        items={experience}
        onChange={onChange}
        itemLabel="Experience entry"
        renderSummary={(it) => ({ title: it.role, subtitle: it.meta })}
        newItem={() => ({ role: "New role", meta: "", badge: "", points: [] })}
        renderEditor={(it, update) => (
          <>
            <div className="field-grid">
              <TextField label="Role" value={it.role} onChange={(v) => update({ role: v })} placeholder="e.g. Collab Manager — Project X" />
              <TextField label="Badge" value={it.badge} onChange={(v) => update({ badge: v })} placeholder="e.g. Current" hint="Small tag next to the role — leave blank to hide" />
            </div>
            <TextField label="Meta line" value={it.meta} onChange={(v) => update({ meta: v })} placeholder="e.g. Current · Web3 NFT Community" hint="Leave blank to hide" />
            <div className="f-field">
              <span className="f-label">Highlights</span>
              <StringListEditor
                items={it.points || []}
                onChange={(v) => update({ points: v })}
                placeholder="Add a bullet point…"
                emptyLabel="No highlights yet."
              />
            </div>
          </>
        )}
      />
    </div>
  );
}
