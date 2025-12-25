import redisClient from "../config/redis.js";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;

  if (!sid) {
  return res.status(401).json({ error: "Not logged in!" });
}

  const session = await redisClient.json.get(`session:${sid}`);

  if (!session) {
  return res.status(401).json({ error: "Session expired" });
}

  req.user = { _id: session.userId, rootDirId: session.rootDirId };
  next();
}

export const checkNotRegularUser = (req, res, next) => {
  if (req.user.role !== "User") return next();
  res.status(403).json({ error: "You can not access users" });
};

export const checkIsAdminUser = (req, res, next) => {
  if (req.user.role === "Admin") return next();
  res.status(403).json({ error: "You can not delete users" });
};
