export default async (req, res) => {
  return res.json({ host: req.headers.host });
};
