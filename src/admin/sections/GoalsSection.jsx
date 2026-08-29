import StringListEditor from "../components/StringListEditor.jsx";

export default function GoalsSection({ goals, onChange }) {
  return (
    <div className="section-stack">
      <p className="section-intro">The roadmap cards, numbered in the order shown here.</p>
      <div className="card glass grad-border">
        <StringListEditor items={goals} onChange={onChange} placeholder="Add a goal…" />
      </div>
    </div>
  );
}
