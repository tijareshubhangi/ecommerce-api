const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const msg = err.message || 'Server Error';
  res.status(status).json({ message: msg });
};

export default errorHandler;

