import React, { useState, useEffect } from "react";

// Cycles through `words` with a typewriter type/delete effect.
export default function Typer({ words }) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[i % words.length];
    let t;
    if (!del && txt === cur) {
      t = setTimeout(() => setDel(true), 1500);
    } else if (del && txt === "") {
      setDel(false);
      setI((p) => p + 1);
    } else {
      t = setTimeout(() => {
        setTxt((p) => (del ? cur.slice(0, p.length - 1) : cur.slice(0, p.length + 1)));
      }, del ? 45 : 90);
    }
    return () => clearTimeout(t);
  }, [txt, del, i, words]);
  return (
    <span className="text-white">
      {txt}
      <span className="typer-caret">|</span>
    </span>
  );
}
