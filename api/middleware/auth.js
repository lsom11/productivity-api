import btoa from 'btoa';

const basicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send({ message: 'Invalid Credentials' });
    return false;
  }

  const reqAuth = req.headers.authorization.split(' ')[1];

  const auth = btoa(
    `${process.env.BASIC_AUTH_USER}:${process.env.BASIC_AUTH_PASSWORD}`
  );

  if (auth === reqAuth) {
    next();
  } else {
    console.log(auth);
    res.status(401).send({ message: 'Invald Credentials' });
  }
};

export default basicAuth;
