const reviewsModel = require("../models/reviews-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const revCont = {}

/* *****************************
 * Build add review view
 * ***************************** */
revCont.buildAddReview = async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`
  res.render("reviews/add-review", {
    title: "Review " + itemName,
    nav,
    errors: null,
    inv_id,
    itemName,
  })
}

/* *****************************
 * Process add review
 * ***************************** */
revCont.addReview = async function(req, res, next) {
  const { review_text, review_rating, inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  let nav = await utilities.getNav()

  // Check if already reviewed
  const alreadyReviewed = await reviewsModel.checkExistingReview(account_id, inv_id)
  if (alreadyReviewed) {
    req.flash("notice", "You have already reviewed this vehicle.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }

  const result = await reviewsModel.addReview(
    review_text, 
    review_rating, 
    account_id, 
    inv_id
  )
  if (result) {
    req.flash("notice", "Your review has been added successfully!")
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    const itemData = await invModel.getInventoryById(inv_id)
    const itemName = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`
    req.flash("notice", "Sorry, the review could not be added.")
    res.status(501).render("reviews/add-review", {
      title: "Review " + itemName,
      nav,
      errors: null,
      inv_id,
      itemName,
      review_text,
      review_rating,
    })
  }
}

/* *****************************
 * Build my reviews view
 * ***************************** */
revCont.buildMyReviews = async function(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const reviews = await reviewsModel.getReviewsByAccountId(account_id)
  res.render("reviews/my-reviews", {
    title: "My Reviews",
    nav,
    errors: null,
    reviews,
  })
}

/* *****************************
 * Delete review
 * ***************************** */
revCont.deleteReview = async function(req, res, next) {
  const account_id = res.locals.accountData.account_id
  const review_id = parseInt(req.params.review_id)
  const result = await reviewsModel.deleteReview(review_id, account_id)
  if (result.rowCount) {
    req.flash("notice", "Your review has been deleted.")
  } else {
    req.flash("notice", "Sorry, the review could not be deleted.")
  }
  res.redirect("/reviews/my-reviews")
}

module.exports = revCont