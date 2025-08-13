"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProductUpdateData = buildProductUpdateData;
function buildProductUpdateData(input) {
    const updateData = {};
    for (const [key, value] of Object.entries(input)) {
        if (value !== undefined) {
            updateData[key] = value;
        }
    }
    return updateData;
}
//# sourceMappingURL=buildProductUpdateData.js.map