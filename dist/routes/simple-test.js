"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Simple test route
router.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});
exports.default = router;
//# sourceMappingURL=simple-test.js.map