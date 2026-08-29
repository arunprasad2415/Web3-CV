import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField, UrlField, ToggleField } from "../components/Fields.jsx";
import ImageField from "../components/ImageField.jsx";

export default function ThreadsSection({ tweets, onChange, slotFor }) {
  return (
    <div className="section-stack">
      <p className="section-intro">Posts shown in the Content &amp; Threads section, linking out to X.</p>
      <ArrayEditor
        items={tweets}
        onChange={onChange}
        itemLabel="Thread"
        renderSummary={(it) => ({ title: it.text, subtitle: it.date })}
        newItem={() => ({ text: "New post", date: "", url: "", image: null, pinned: false })}
        renderEditor={(it, update, i) => {
          const slot = slotFor(`tweet.${i}`, it.image, "tweet", (v) => update({ image: v }));
          return (
            <>
              <TextField label="Post text" value={it.text} onChange={(v) => update({ text: v })} />
              <div className="field-grid">
                <TextField label="Date" value={it.date} onChange={(v) => update({ date: v })} placeholder="e.g. May 2026" />
                <UrlField label="Link to post" value={it.url} onChange={(v) => update({ url: v })} />
              </div>
              <ToggleField label="Pinned" hint="Shows a pin badge" value={Boolean(it.pinned)} onChange={(v) => update({ pinned: v })} />
              <ImageField label="Image" allowRemove {...slot} />
            </>
          );
        }}
      />
    </div>
  );
}
