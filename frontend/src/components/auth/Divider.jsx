const Divider = ({
  text = "or",
}) => {
  return (
    <div className="lp-divider">
      <span>{text}</span>
    </div>
  );
};

export default Divider;