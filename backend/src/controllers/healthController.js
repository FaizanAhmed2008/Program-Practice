exports.getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'Docker DevBox Backend Running'
  });
};
