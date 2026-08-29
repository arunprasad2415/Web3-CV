import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField, NumberField } from "../components/Fields.jsx";
import StringListEditor from "../components/StringListEditor.jsx";

const toObj = ([name, pct]) => ({ name, pct });
const toTuple = ({ name, pct }) => [name, pct];

function SkillItems({ items, onChange }) {
  const objItems = (items || []).map(toObj);
  return (
    <ArrayEditor
      items={objItems}
      onChange={(next) => onChange(next.map(toTuple))}
      itemLabel="Skill"
      renderSummary={(it) => ({ title: it.name, subtitle: `${it.pct}%` })}
      newItem={() => ({ name: "New skill", pct: 50 })}
      renderEditor={(it, update) => (
        <div className="field-grid">
          <TextField label="Skill name" value={it.name} onChange={(v) => update({ name: v })} />
          <NumberField label="Proficiency %" value={it.pct} onChange={(v) => update({ pct: Math.max(0, Math.min(100, v)) })} min={0} max={100} />
        </div>
      )}
    />
  );
}

export default function SkillsSection({ skillGroups, onSkillGroupsChange, techSkills, onTechSkillsChange, tools, onToolsChange, aiTools, onAiToolsChange }) {
  return (
    <div className="section-stack">
      <div className="card glass grad-border">
        <h3 className="card-title">Skill groups</h3>
        <p className="f-hint">Each group renders as its own card with progress bars.</p>
        <ArrayEditor
          items={skillGroups}
          onChange={onSkillGroupsChange}
          itemLabel="Skill group"
          renderSummary={(g) => ({ title: g.title, subtitle: `${g.items.length} skill${g.items.length === 1 ? "" : "s"}` })}
          newItem={() => ({ title: "New group", items: [] })}
          renderEditor={(g, update) => (
            <>
              <TextField label="Group title" value={g.title} onChange={(v) => update({ title: v })} />
              <div className="f-field">
                <span className="f-label">Skills in this group</span>
                <SkillItems items={g.items} onChange={(v) => update({ items: v })} />
              </div>
            </>
          )}
        />
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">Technical skills</h3>
        <StringListEditor items={techSkills} onChange={onTechSkillsChange} placeholder="e.g. React JS" />
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">Tools</h3>
        <StringListEditor items={tools} onChange={onToolsChange} placeholder="e.g. Dune" />
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">AI & Automation</h3>
        <StringListEditor items={aiTools} onChange={onAiToolsChange} placeholder="e.g. Claude" />
      </div>
    </div>
  );
}
