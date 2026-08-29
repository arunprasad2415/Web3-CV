import { useRef } from "react";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Image preview + replace/remove. Never shows the file path as the primary
// UI — that's tucked away as small secondary text. Selecting a file only
// stages it locally (preview + validation); the actual upload happens when
// the admin hits Save, alongside everything else.
export default function ImageField({ label, previewUrl, hasImage, allowRemove, onSelectFile, onRemove, pending, error }) {
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      onSelectFile(null, "Please choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onSelectFile(null, `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB — max is ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);
      return;
    }
    onSelectFile(file, null);
  }

  return (
    <div className="image-field">
      {label && <span className="f-label">{label}</span>}
      <div className="image-field-box">
        {previewUrl ? (
          <img src={previewUrl} alt="" className="image-field-preview" />
        ) : (
          <div className="image-field-placeholder">
            <span>No image</span>
          </div>
        )}
        {pending && <span className="image-field-pending-badge">Ready to upload</span>}
      </div>
      <div className="image-field-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()}>
          Replace
        </button>
        {allowRemove && hasImage && (
          <button type="button" className="btn-danger-text" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {error && <span className="f-error">{error}</span>}
    </div>
  );
}
