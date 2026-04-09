const express = require("express")
const router = nex .express.router()
const reviewsController = require("../controllers/reviewsController")
const utilities = require("../utilities/")
const { body, validationResult} = require("express-validator")

//Validation rules
const reviewValidation = [ 
    body("review_text")
        .trim()
        .notEmpty()
        .isLength({min: 10})
        .withMessage("Review must be at least 10 characteres."),
    body("review-rating")
        .notEmpty()
        .isInt({min:1, max:5})
        .withMessage("Rating must be between 1 and 5.")
]

//Route to build add review view
router.get("/add/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewsController.buildAddReview)
)

//Route to process add review 
router.post("/add",
    utilities.checkLogin,
    reviewValidation,
    utilities.handleErrors(reviewsController.addReview)
)

//Route to build my reviews view 
router.get("/my-reviews",
    utilities.checkLogin,
    utilities.handleErrors(reviewsController.buildMyReviews)
)

//Route to delete a review
router.get("/delete/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewsController.deleteReview)
)

module.exports = router