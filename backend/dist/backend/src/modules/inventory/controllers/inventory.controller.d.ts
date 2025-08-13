import { Request, Response } from 'express';
export declare class InventoryController {
    private service;
    constructor();
    stockIn(req: Request, res: Response): Promise<void>;
    stockOut(req: Request, res: Response): Promise<void>;
    getByProductId(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    adjustStock(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=inventory.controller.d.ts.map