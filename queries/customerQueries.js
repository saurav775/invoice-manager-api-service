export const getAllCustomersQuery = "select * from customer";
export const getCustomerByIdQuery =
  "select * from customer where customer_id = $1";
export const checkNameExistsQuery =
  "select count(*) from customer where customer_name = $1";
export const addCustomerQuery = "insert into customer values($1, $2, $3, $4)";
export const deleteCustomerQuery =
  "delete from customer where customer_id = $1";
export const checkEmailExistsQuery =
  "select count(*) from customer where customer_email = $1";
export const checkPhoneExistsQuery =
  "select count(*) from customer where customer_phone = $1";
export const updateCustomerQuery =
  "update customer set customer_name = $1, customer_email = $2, customer_phone = $3 where customer_id = $4";
