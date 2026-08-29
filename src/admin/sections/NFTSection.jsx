import ArrayEditor from "../components/ArrayEditor.jsx";
import { TextField } from "../components/Fields.jsx";
import ImageField from "../components/ImageField.jsx";

export default function NFTSection({ collections, onChange, slotFor }) {
  return (
    <div className="section-stack">
      <p className="section-intro">Your NFT collection gallery. A card with no image shows an empty "add image" placeholder on the live site.</p>
      <ArrayEditor
        items={collections}
        onChange={onChange}
        itemLabel="Collection"
        renderSummary={(it) => ({ title: it.name, subtitle: it.image ? "Has image" : "No image" })}
        newItem={() => ({ name: "New collection", image: null })}
        renderEditor={(it, update, i) => {
          const slot = slotFor(`nft.${i}`, it.image, "nft", (v) => update({ image: v }));
          return (
            <>
              <TextField label="Collection name" value={it.name} onChange={(v) => update({ name: v })} />
              <ImageField label="Card image" allowRemove {...slot} />
            </>
          );
        }}
      />
    </div>
  );
}
