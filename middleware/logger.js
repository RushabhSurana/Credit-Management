const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}:`);
  next();
};

//Exports

module.exports = logger;
