import pool from "../database.js";
import {
  getAllInvoicesQuery,
  getInvoiceByIdQuery,
  getInvoiceByIdWithCustomerQuery,
  getInvoiceDetailsByIdQuery,
  addInvoiceQuery,
  addInvoiceDetailsQuery,
  deleteInvoiceQuery,
  deleteInvoiceDetailsQuery,
  updateInvoiceQuery,
} from "../queries/invoiceQueries.js";
import { generateRandomId } from "../utils.js";
import { INVOICE_DETAILS } from "../constants.js";
import {
  INVOICE_CREATED_SUCCESSFULLY,
  INVOICE_NOT_FOUND,
  INVOICE_UPDATED_SUCCESSFULLY,
  INVOICE_DELETED_SUCCESSFULLY,
} from "../messages.js";

export const getInvoices = (req, res) => {
  pool.query(getAllInvoicesQuery, (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export const getInvoiceById = (req, res) => {
  const invoice_id = req.params.id;
  pool.query(
    getInvoiceByIdWithCustomerQuery,
    [invoice_id],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      const result = {
        ...results.rows?.[0],
      };
      pool.query(getInvoiceDetailsByIdQuery, [invoice_id], (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        result[INVOICE_DETAILS] = results.rows;
        res.status(200).json([result]);
      });
    }
  );
};

export const createInvoice = (req, res) => {
  const {
    customer_id,
    invoice_details,
    invoice_total_amount,
    invoice_creation_timestamp,
    order_required_by_date,
    order_status,
  } = req.body;
  const generatedInvoiceId = generateRandomId();
  pool.query(
    addInvoiceQuery,
    [
      generatedInvoiceId,
      customer_id,
      invoice_total_amount,
      invoice_creation_timestamp,
      order_required_by_date,
      order_status,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      let recordsInserted = 0;
      invoice_details.forEach(
        ({ product_id, product_qty, product_rate, product_total_amount }) => {
          pool.query(
            addInvoiceDetailsQuery,
            [
              generatedInvoiceId,
              product_id,
              product_qty,
              product_rate,
              product_total_amount,
            ],
            (error, results) => {
              if (error) {
                console.log(error);
                throw error;
              }
              recordsInserted++;
              if (recordsInserted === invoice_details.length) {
                const responseJson = {
                  message: INVOICE_CREATED_SUCCESSFULLY,
                  payload: { invoice_id: generatedInvoiceId },
                };
                res.status(201).json(responseJson);
              }
            }
          );
        }
      );
    }
  );
};

export const deleteInvoice = (req, res) => {
  const invoice_id = req.params.id;
  pool.query(getInvoiceByIdQuery, [invoice_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (!results.rows.length) {
      res.status(200).json({ message: INVOICE_NOT_FOUND });
    } else {
      pool.query(deleteInvoiceDetailsQuery, [invoice_id], (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        pool.query(deleteInvoiceQuery, [invoice_id], (error, results) => {
          if (error) {
            console.log(error);
            throw error;
          }
          if (results.rowCount) {
            res.status(200).json({ message: INVOICE_DELETED_SUCCESSFULLY });
          }
        });
      });
    }
  });
};

export const updateInvoice = (req, res) => {
  const invoice_id = req.params.id;
  const {
    invoice_total_amount,
    order_required_by_date,
    order_status,
    invoice_details,
  } = req.body;

  pool.query(getInvoiceByIdQuery, [invoice_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (!results.rows.length) {
      res.status(200).json({ message: INVOICE_NOT_FOUND });
    } else {
      pool.query(
        updateInvoiceQuery,
        [
          invoice_total_amount,
          order_required_by_date,
          order_status,
          invoice_id,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
            throw error;
          }
          pool.query(
            deleteInvoiceDetailsQuery,
            [invoice_id],
            (error, results) => {
              if (error) {
                console.log(error);
                throw error;
              }
              let recordsInserted = 0;

              invoice_details.forEach(
                ({
                  product_id,
                  product_qty,
                  product_rate,
                  product_total_amount,
                }) => {
                  pool.query(
                    addInvoiceDetailsQuery,
                    [
                      invoice_id,
                      product_id,
                      product_qty,
                      product_rate,
                      product_total_amount,
                    ],
                    (error, results) => {
                      if (error) {
                        console.log(error);
                        throw error;
                      }
                      recordsInserted++;
                      if (recordsInserted === invoice_details.length)
                        res
                          .status(200)
                          .json({ message: INVOICE_UPDATED_SUCCESSFULLY });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  });
};
