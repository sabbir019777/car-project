const app = require("../server/index.js");

// Export a simple handler that delegates to the Express app
module.exports = (req, res) => app(req, res);
