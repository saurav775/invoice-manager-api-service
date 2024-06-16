export const getAllInvoicesQuery = "select * from invoice";
export const getInvoiceByIdQuery =
  "select * from invoice where invoice_id = $1";
export const getInvoiceByIdWithCustomerQuery =
  "select invoice.invoice_id, invoice.customer_id, customer.customer_name, customer.customer_email, customer.customer_phone, invoice.invoice_total_amount, invoice.invoice_creation_timestamp, invoice.order_required_by_date, invoice.order_status from invoice inner join customer on invoice.customer_id = customer.customer_id where invoice_id = $1";
export const getInvoiceDetailsByIdQuery =
  "select invoice_details.product_id, product.product_name, product.product_description, invoice_details.product_qty, invoice_details.product_rate, invoice_details.product_total_amount from invoice_details inner join product on invoice_details.product_id = product.product_id  where invoice_id = $1";
export const addInvoiceQuery =
  "insert into invoice values($1, $2, $3, $4, $5, $6)";
export const addInvoiceDetailsQuery =
  "insert into invoice_details values($1, $2, $3, $4, $5)";
export const deleteInvoiceQuery = "delete from invoice where invoice_id = $1";
export const deleteInvoiceDetailsQuery =
  "delete from invoice_details where invoice_id = $1";
export const updateInvoiceQuery =
  "update invoice set invoice_total_amount = $1, order_required_by_date = $2, order_status = $3 where invoice_id = $4";
export const updateInvoiceDetailsQuery =
  "update invoice_details set product_qty = $1, product_rate = $2, product_total_amount = $3 where invoice_id = $4 and product_id = $5";
