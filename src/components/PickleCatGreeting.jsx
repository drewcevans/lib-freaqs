// Place your photos in the project's public/ folder:
//   public/pickle.png  — the illuminated pickle sculpture
//   public/cat.png     — the pink stuffed cat with string lights

export default function PickleCatGreeting() {
  return (
    <div className="pcg-scene" aria-hidden="true">

      {/* ── PICKLE TOTEM ── */}
      <div className="pcg-pickle-wrapper">
        <div className="pcg-sign pcg-sign--pickle">
          <img src="/pickle.png" alt="" className="pcg-char-img pcg-pickle-img" />
        </div>
        <div className="pcg-pole pcg-pole--green" />
      </div>

      {/* ── HEARTS ── */}
      <div className="pcg-hearts">
        <span className="pcg-heart pcg-h1">💜</span>
        <span className="pcg-heart pcg-h2">💚</span>
        <span className="pcg-heart pcg-h3">💖</span>
        <span className="pcg-heart pcg-h4">✨</span>
      </div>

      {/* ── CAT TOTEM ── */}
      <div className="pcg-cat-wrapper">
        <div className="pcg-sign pcg-sign--cat">
          <img src="/cat.png" alt="" className="pcg-char-img pcg-cat-img" />
        </div>
        <div className="pcg-pole pcg-pole--pink" />
      </div>

    </div>
  );
}
