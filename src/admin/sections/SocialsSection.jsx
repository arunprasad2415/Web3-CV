import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField, UrlField, SelectField } from "../components/Fields.jsx";

// The "key" must match one of the site's known brand icons (see
// src/components/Icons.jsx) — Navbar/Contact render Icon[key], so a free-text
// key would render nothing. Kept as a fixed choice rather than free text.
const PLATFORMS = [
  { value: "Telegram", label: "Telegram" },
  { value: "X", label: "X (Twitter)" },
  { value: "Discord", label: "Discord" },
  { value: "Github", label: "GitHub" },
];

export default function SocialsSection({ socials, onChange }) {
  return (
    <div className="section-stack">
      <p className="section-intro">Shown in the top nav and Contact section. Email is added automatically and isn't editable here.</p>
      <ArrayEditor
        items={socials}
        onChange={onChange}
        itemLabel="Social link"
        renderSummary={(it) => ({ title: it.label, subtitle: it.href })}
        newItem={() => ({ key: "Telegram", label: "Telegram", href: "" })}
        renderEditor={(it, update) => (
          <div className="field-grid">
            <SelectField label="Platform" value={it.key} onChange={(v) => update({ key: v, label: PLATFORMS.find((p) => p.value === v)?.label || it.label })} options={PLATFORMS} />
            <TextField label="Display label" value={it.label} onChange={(v) => update({ label: v })} />
            <UrlField label="Link" value={it.href} onChange={(v) => update({ href: v })} />
          </div>
        )}
      />
    </div>
  );
}
