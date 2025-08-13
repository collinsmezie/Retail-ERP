// src/shared/utils/buildProductUpdateData.ts
import { UpdateProductInput } from '../shared/types/product.types';

export function buildProductUpdateData(input: UpdateProductInput): any {
  const updateData: any = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }
  return updateData;
} 