export const getAllProductsQuery = "select * from product";
export const getProductByIdQuery =
  "select * from product where product_id = $1";
export const checkProductNameExistsQuery =
  "select count(*) from product where product_name = $1";
export const addProductQuery = "insert into product values($1, $2, $3, $4)";
export const deleteProductQuery = "delete from product where product_id = $1";
export const updateProductQuery =
  "update product set product_name = $1, product_rate_per_item = $2, product_description = $3 where product_id = $4";
