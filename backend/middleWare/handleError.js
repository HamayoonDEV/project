import pkg from "joi";

const { ValidationError } = pkg;

const handleError = (error, req, res, next) => {
  //default state
  let status = 500;
  let data = {
    message: "internal server error!!!",
  };

  if (error instanceof ValidationError) {
    (status = 401), (data.message = "internal server error!!!");

    return res.status(status).json(data);
  }

  if (status.error) {
    status = error.status;
  }

  if (error.message) {
    data.message = error.message;
  }

  return res.status(status).json(data);
};

export default handleError;
