import React from "react";
import Reveal from "../components/Reveal";
import Heading from "../components/Heading";
import { NFT_COLLECTIONS } from "../data/content";

// NFT gallery with 3D-tilt glass cards (empty placeholders by default).
export default function NFTShowcase() {
  return (
    <section id="nft" className="section">
      <Heading kicker="Collections" title="Favorite NFT Collections" />
      <div className="nft-grid">
        {NFT_COLLECTIONS.map((nft, i) => (
          <Reveal key={i} delay={i * 130}>
            <div className="grad-border tilt glow-hover glass nft-card">
              <div className="nft-image">
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} className="nft-image-img" />
                ) : (
                  <div className="nft-placeholder">
                    <div className="nft-placeholder-box">
                      <span>＋</span>
                    </div>
                    <p>Add NFT image</p>
                  </div>
                )}
              </div>
              <div className="nft-body">
                <p className="nft-name">{nft.name}</p>
                <p className="nft-note">{nft.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
