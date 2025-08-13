import { ProductView, ProductWithInventory, CreateProductInput, UpdateProductInput, ProductSearchInput } from '../../../../../shared/types/product.types';
export declare class ProductService {
    create(tenantId: string, input: CreateProductInput): Promise<ProductView>;
    update(tenantId: string, productId: string, update: UpdateProductInput): Promise<ProductView>;
    getById(tenantId: string, productId: string): Promise<ProductView | null>;
    getBySku(tenantId: string, sku: string): Promise<ProductView | null>;
    getWithInventory(tenantId: string, productId: string): Promise<ProductWithInventory | null>;
    list(tenantId: string, searchInput?: ProductSearchInput): Promise<{
        items: ProductView[];
        total: number;
        page: number;
        limit: number;
    }>;
    delete(tenantId: string, productId: string): Promise<void>;
    activate(tenantId: string, productId: string): Promise<ProductView>;
    deactivate(tenantId: string, productId: string): Promise<ProductView>;
    private mapToProductView;
}
//# sourceMappingURL=product.service.d.ts.map