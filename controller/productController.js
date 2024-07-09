import pool from "../database.js";
import {
  getAllProductsQuery,
  getProductByIdQuery,
  checkProductNameExistsQuery,
  addProductQuery,
  deleteProductQuery,
  updateProductQuery,
} from "../queries/productQueries.js";
import { generateRandomId } from "../utils.js";
import {
  PRODUCT_NAME_ALREADY_EXISTS,
  PRODUCT_NOT_FOUND,
  PRODUCT_CREATED_SUCCESSFULLY,
  PRODUCT_DELETED_SUCCESSFULLY,
  PRODUCT_UPDATED_SUCCESSFULLY,
} from "../messages.js";

export const getProducts = (req, res) => {
  pool.query(getAllProductsQuery, (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export const getProductById = (req, res) => {
  const product_id = req.params.id;
  pool.query(getProductByIdQuery[product_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export const createProduct = (req, res) => {
  const { product_name, product_rate_per_item, product_description } = req.body;
  pool.query(checkProductNameExistsQuery, [product_name], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (parseInt(results.rows?.[0]?.count)) {
      res.status(200).json({ message: PRODUCT_NAME_ALREADY_EXISTS });
    } else {
      const newProductId = generateRandomId();
      pool.query(
        addProductQuery,
        [
          newProductId,
          product_name,
          product_rate_per_item,
          product_description,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
            throw error;
          }
          const responseJson = {
            message: PRODUCT_CREATED_SUCCESSFULLY,
            payload: { product_id: newProductId },
          };
          res.status(201).json(responseJson);
        }
      );
    }
  });
};

export const deleteProduct = (req, res) => {
  const product_id = req.params.id;
  pool.query(getProductByIdQuery, [product_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (!results.rows.length) {
      res.status(200).json({ message: PRODUCT_NOT_FOUND });
    } else {
      pool.query(deleteProductQuery, [product_id], (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (results.rowCount) {
          res.status(200).json({ message: PRODUCT_DELETED_SUCCESSFULLY });
        }
      });
    }
  });
};

export const updateProduct = (req, res) => {
  const product_id = req.params.id;
  const { product_name, product_rate_per_item, product_description } = req.body;

  const saveProductData = () => {
    pool.query(
      updateProductQuery,
      [product_name, product_rate_per_item, product_description, product_id],
      (error, results) => {
        if (error) {
          console.log(error);
          throw error;
        }
        if (results.rowCount) {
          res.status(200).json({ message: PRODUCT_UPDATED_SUCCESSFULLY });
        }
      }
    );
  };

  pool.query(getProductByIdQuery, [product_id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    if (!results.rows.length) {
      res.status(200).json({ message: PRODUCT_NOT_FOUND });
    } else {
      if (results.rows[0].product_name !== product_name) {
        pool.query(
          checkProductNameExistsQuery,
          [product_name],
          (error, results) => {
            if (error) {
              console.log(error);
              throw error;
            }
            if (parseInt(results.rows?.[0]?.count)) {
              res.status(200).json({ message: PRODUCT_NAME_ALREADY_EXISTS });
            } else {
              saveProductData();
            }
          }
        );
      } else saveProductData();
    }
  });
};
