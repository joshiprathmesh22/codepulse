const AuthLayout = ({ left, right }) => {
  return (
    <div className="lp-body">
      <div className="lp-left">
        {left}
      </div>

      <div className="lp-right">
        {right}
      </div>
    </div>
  );
};

export default AuthLayout;