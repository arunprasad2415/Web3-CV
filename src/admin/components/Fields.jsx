// Reusable form primitives for the admin CMS — plain inputs, styled to
// match the dashboard, no external form library.

export function Field({ label, hint, error, children }) {
  return (
    <label className="f-field">
      {label && <span className="f-label">{label}</span>}
      {children}
      {hint && !error && <span className="f-hint">{hint}</span>}
      {error && <span className="f-error">{error}</span>}
    </label>
  );
}

export function TextField({ label, hint, error, value, onChange, placeholder, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <input
        className={`f-input ${error ? "f-input-error" : ""}`}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
    </Field>
  );
}

export function UrlField({ label, hint, error, value, onChange, placeholder, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <input
        className={`f-input ${error ? "f-input-error" : ""}`}
        type="url"
        inputMode="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "https://…"}
        {...rest}
      />
    </Field>
  );
}

export function NumberField({ label, hint, error, value, onChange, suffix, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <div className="f-number-row">
        <input
          className={`f-input ${error ? "f-input-error" : ""}`}
          type="number"
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          {...rest}
        />
        {suffix}
      </div>
    </Field>
  );
}

export function TextAreaField({ label, hint, error, value, onChange, rows = 4, placeholder }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <textarea
        className={`f-textarea ${error ? "f-input-error" : ""}`}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function SelectField({ label, hint, error, value, onChange, options }) {
  return (
    <Field label={label} hint={hint} error={error}>
      <select className="f-input f-select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ToggleField({ label, hint, value, onChange }) {
  return (
    <label className="f-toggle-row">
      <span>
        <span className="f-label">{label}</span>
        {hint && <span className="f-hint f-hint-inline"> · {hint}</span>}
      </span>
      <button
        type="button"
        className={`f-toggle ${value ? "f-toggle-on" : ""}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
      >
        <span className="f-toggle-knob" />
      </button>
    </label>
  );
}
