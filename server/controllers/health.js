const getHome = (req, res) => {
  res.json({ message: "Welcome to Tiny Tours" });
};

const getHealth = (req, res) => {
  res.json({ status: "OK" });
};

export { getHealth, getHome };
