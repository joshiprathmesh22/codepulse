function Card({ children }) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-8
        shadow-2xl
      "
    >
      {children}
    </div>
  );
}

export default Card;