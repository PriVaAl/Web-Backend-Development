const pool = require("../database/")

/* *****************************
 * Add a review
 * ***************************** */
async function addReview(review_text, review_rating, account_id, inv_id) {
  try {
    const sql = `INSERT INTO reviews 
      (review_text, review_rating, account_id, inv_id) 
      VALUES ($1, $2, $3, $4) RETURNING *`
    const data = await pool.query(sql, [review_text, review_rating, account_id, inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
  }
}

/* *****************************
 * Get all reviews for a vehicle
 * ***************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_rating, r.review_date,
        a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByInvId error: " + error)
  }
}

/* *****************************
 * Get all reviews by a client
 * ***************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_rating, r.review_date,
        i.inv_make, i.inv_model, i.inv_year, i.inv_id
      FROM reviews r
      JOIN inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error)
  }
}

/* *****************************
 * Delete a review
 * ***************************** */
async function deleteReview(review_id, account_id) {
  try {
    const sql = `DELETE FROM reviews 
      WHERE review_id = $1 AND account_id = $2 RETURNING *`
    const data = await pool.query(sql, [review_id, account_id])
    return data
  } catch (error) {
    console.error("deleteReview error: " + error)
  }
}

/* *****************************
 * Get average rating for a vehicle
 * ***************************** */
async function getAverageRating(inv_id) {
  try {
    const sql = `SELECT ROUND(AVG(review_rating), 1) as avg_rating, 
      COUNT(*) as review_count 
      FROM reviews WHERE inv_id = $1`
    const data = await pool.query(sql, [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getAverageRating error: " + error)
  }
}

/* *****************************
 * Check if account already reviewed vehicle
 * ***************************** */
async function checkExistingReview(account_id, inv_id) {
  try {
    const sql = `SELECT * FROM reviews 
      WHERE account_id = $1 AND inv_id = $2`
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount
  } catch (error) {
    console.error("checkExistingReview error: " + error)
  }
}
module.exports =  {addReview, getReviewsByInvId, getReviewsByAccountId, deleteReview, getAverageRating,checkExistingReview}