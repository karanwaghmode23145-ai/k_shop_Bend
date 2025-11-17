import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  console.log("\n=== protect middleware called ===");
  try {
    // 1) read Authorization header
    let token = req.headers.authorization;
    console.log("1) Raw Authorization header:", token);

    // 2) missing token
    if (!token) {
      console.log("⛔ No Authorization header present - returning 401");
      return res.status(401).json({ message: "No token. Unauthorized!" });
    }

    // 3) Bearer format check and extraction
    if (!token.startsWith("Bearer ")) {
      console.log("⚠ Authorization header not in 'Bearer <token>' format:", token);
      // still try to split defensively, or return 401 depending on policy
      return res.status(401).json({ message: "Invalid token format" });
    }

    token = token.split(" ")[1]; // extract actual token
    console.log("2) Extracted token (first 20 chars):", token ? token.slice(0, 20) + "..." : token);

    // 4) verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("3) Token verified successfully. Decoded payload:", decoded);
    } catch (verifyError) {
      console.log("⛔ Token verification failed:", verifyError.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 5) attach user info to request
    req.user = decoded;
    console.log("4) Attached req.user:", req.user);

    // 6) continue to next middleware/controller
    console.log("✅ protect middleware: auth passed, calling next()");
    next();

  } catch (error) {
    console.log("🔥 Unexpected error in protect middleware:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  } finally {
    console.log("=== protect middleware finished ===\n");
  }
};
