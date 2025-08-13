import { z } from 'zod';
export declare const stockInSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    source: z.ZodEnum<{
        supplier: "supplier";
        warehouse: "warehouse";
        "initial-stock": "initial-stock";
    }>;
    referenceId: z.ZodOptional<z.ZodString>;
    receivedBy: z.ZodString;
    locationId: z.ZodOptional<z.ZodString>;
    batchNumber: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const stockOutSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    destinationType: z.ZodEnum<{
        supplier: "supplier";
        warehouse: "warehouse";
        customer: "customer";
    }>;
    referenceId: z.ZodOptional<z.ZodString>;
    handledBy: z.ZodString;
    locationId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    allowNegativeStock: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const stockAdjustmentSchema: z.ZodObject<{
    productId: z.ZodString;
    adjustmentType: z.ZodEnum<{
        increase: "increase";
        decrease: "decrease";
    }>;
    quantity: z.ZodNumber;
    reason: z.ZodString;
    performedBy: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=inventory.validation.d.ts.map