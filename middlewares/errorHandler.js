export default (req, res,next) => {
  const errorHandler = ({statusCode=500,body=null,message="Internal Server Error"}) => {
    return res.status(statusCode).json({ success: false, body, message });
  };
  res.sendError = errorHandler;
  next();
};