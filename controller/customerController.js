import pool from "../database.js";
import {
  getAllCustomersQuery,
  getCustomerByIdQuery,
  checkNameExistsQuery,
  addCustomerQuery,
  deleteCustomerQuery,
  checkEmailExistsQuery,
  checkPhoneExistsQuery,
  updateCustomerQuery,
} from "../queries/customerQueries.js";
import {
  NAME_ALREADY_EXISTS,
  CUSTOMER_NOT_FOUND,
  CUSTOMER_CREATED_SUCCESSFULLY,
  CUSTOMER_DELETED_SUCCESSFULLY,
  CUSTOMER_UPDATED_SUCCESSFULLY,
  EMAIL_ALREADY_EXISTS,
  PHONE_ALREADY_EXISTS,
} from "../messages.js";
import { generateRandomId } from "../utils.js";

export const getCustomers = (req, res) => {
  pool.query(getAllCustomersQuery, (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export const getCustomerById = (req, res) => {
  const customer_id = req.params.id;
  pool.query(getCustomerByIdQuery, [customer_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export const createCustomer = (req, res) => {
  const { customer_name, customer_email, customer_phone } = req.body;
  pool.query(checkNameExistsQuery, [customer_name], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (parseInt(results.rows?.[0]?.count)) {
      res.status(200).json({ message: NAME_ALREADY_EXISTS });
    } else {
      pool.query(checkEmailExistsQuery, [customer_email], (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (parseInt(results.rows?.[0]?.count)) {
          res.status(200).json({ message: EMAIL_ALREADY_EXISTS });
        } else {
          pool.query(
            checkPhoneExistsQuery,
            [customer_phone],
            (error, results) => {
              if (error) {
                console.log(error);
                throw error;
              }
              if (parseInt(results.rows?.[0]?.count)) {
                res.status(200).json({ message: PHONE_ALREADY_EXISTS });
              } else {
                const newCustomerId = generateRandomId();
                pool.query(
                  addCustomerQuery,
                  [
                    newCustomerId,
                    customer_name,
                    customer_email,
                    customer_phone,
                  ],
                  (error, results) => {
                    if (error) {
                      console.log(error);
                      throw error;
                    }
                    const responseJson = {
                      message: CUSTOMER_CREATED_SUCCESSFULLY,
                      payload: { customer_id: newCustomerId },
                    };
                    res.status(201).json(responseJson);
                  }
                );
              }
            }
          );
        }
      });
    }
  });
};

export const deleteCustomer = (req, res) => {
  const customer_id = req.params.id;
  pool.query(getCustomerByIdQuery, [customer_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (!results.rows.length) {
      res.status(200).json({ message: CUSTOMER_NOT_FOUND });
    } else {
      pool.query(deleteCustomerQuery, [customer_id], (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (results.rowCount) {
          res.status(200).json({ message: CUSTOMER_DELETED_SUCCESSFULLY });
        }
      });
    }
  });
};

export const updateCustomer = (req, res) => {
  const customer_id = req.params.id;
  const { customer_name, customer_email, customer_phone } = req.body;

  const saveCustomerData = () => {
    pool.query(
      updateCustomerQuery,
      [customer_name, customer_email, customer_phone, customer_id],
      (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (results.rowCount) {
          res.status(200).json({ message: CUSTOMER_UPDATED_SUCCESSFULLY });
        }
      }
    );
  };

  const customerDataAlreadyExists = (error, results, errorMessage) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (parseInt(results.rows?.[0]?.count)) {
      res.status(200).json({ message: errorMessage });
    } else {
      saveCustomerData();
    }
  };

  pool.query(getCustomerByIdQuery, [customer_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (!results.rows.length) {
      res.status(200).json({ message: CUSTOMER_NOT_FOUND });
    } else {
      if (
        results.rows[0].customer_email === customer_email &&
        results.rows[0].customer_phone === customer_phone
      ) {
        saveCustomerData();
      } else {
        if (results.rows[0].customer_email === customer_email) {
          pool.query(
            checkPhoneExistsQuery,
            [customer_phone],
            (error, results) => {
              customerDataAlreadyExists(error, results, PHONE_ALREADY_EXISTS);
            }
          );
        } else if (results.rows[0].customer_phone === customer_phone) {
          pool.query(
            checkEmailExistsQuery,
            [customer_email],
            (error, results) => {
              customerDataAlreadyExists(error, results, EMAIL_ALREADY_EXISTS);
            }
          );
        }
      }
    }
  });
};
