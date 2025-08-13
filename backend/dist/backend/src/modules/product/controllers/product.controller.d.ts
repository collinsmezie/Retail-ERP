import { Request, Response } from 'express';
export declare class ProductController {
    private service;
    constructor();
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    getBySku(req: Request, res: Response): Promise<void>;
    getWithInventory(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    activate(req: Request, res: Response): Promise<void>;
    deactivate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map