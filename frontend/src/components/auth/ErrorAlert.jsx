const ErrorAlert = ({ message }) => {

  if (!message) return null;

  return (
    <div className="lp-error">
      {message}
    </div>
  );

};

export default ErrorAlert;