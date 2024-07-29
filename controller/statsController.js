import pool from "../database.js";
import { getDashboardStats } from "../queries/statsQueries.js";

export const getStats = (req, res) => {
  pool.query(getDashboardStats, (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    res.status(200).json(results.rows);
  });
};
