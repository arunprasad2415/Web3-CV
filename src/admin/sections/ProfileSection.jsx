import { TextField, TextAreaField } from "../components/Fields.jsx";
import ImageField from "../components/ImageField.jsx";
import StringListEditor from "../components/StringListEditor.jsx";

export default function ProfileSection({ profile, onChange, typerWords, onTyperWordsChange, slotFor }) {
  const set = (patch) => onChange({ ...profile, ...patch });
  const photoSlot = slotFor("profile.photo", profile.photo, "profile", (v) => set({ photo: v }));

  return (
    <div className="section-stack">
      <div className="card glass grad-border">
        <h3 className="card-title">Photo</h3>
        <ImageField label="Profile photo" allowRemove {...photoSlot} />
        <p className="f-hint">Shown in the hero section. Falls back to your initials if removed.</p>
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">Identity</h3>
        <div className="field-grid">
          <TextField label="Name" value={profile.name} onChange={(v) => set({ name: v })} placeholder="Your name" />
          <TextField label="Initials" value={profile.initials} onChange={(v) => set({ initials: v })} placeholder="e.g. WD" hint="Shown when there's no photo" />
          <TextField label="Title" value={profile.title} onChange={(v) => set({ title: v })} placeholder="e.g. Web3 Researcher & Community Contributor" />
        </div>
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">Hero typing words</h3>
        <p className="f-hint">The words that type/erase in the hero — "I am an …"</p>
        <StringListEditor items={typerWords} onChange={onTyperWordsChange} placeholder="Add a word or phrase…" />
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">About</h3>
        <TextAreaField label="Bio" value={profile.aboutText} onChange={(v) => set({ aboutText: v })} rows={5} placeholder="A short paragraph about you" />
      </div>

      <div className="card glass grad-border">
        <h3 className="card-title">Contact & footer</h3>
        <div className="field-grid">
          <TextField label="Email" type="email" value={profile.email} onChange={(v) => set({ email: v })} placeholder="you@example.com" />
          <TextField label="Email subject" value={profile.emailSubject} onChange={(v) => set({ emailSubject: v })} placeholder="e.g. Web3 opportunity" hint="Pre-filled subject when someone emails you" />
        </div>
        <TextField label="Footer tagline" value={profile.footerTagline} onChange={(v) => set({ footerTagline: v })} placeholder="A short closing line" />
      </div>
    </div>
  );
}
