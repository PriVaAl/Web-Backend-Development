const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = utilities.handleErrors(async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
})

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = utilities.handleErrors(async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
})

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.triggerError = utilities.handleErrors(async function(req, res, next) {
  throw new Error("Intentional 500 error triggered!")
})

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
})
/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
})

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = utilities.handleErrors(async function (req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.insertClassification(classification_name)
  if (result.rowCount) {
    let nav = await utilities.getNav()
    req.flash("notice", `Classification "${classification_name}" added successfully.`)
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
})
/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
})

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = utilities.handleErrors(async function (req, res, next) {
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body
  const result = await invModel.insertInventory(
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  )
  if (result.rowCount) {
    let nav = await utilities.getNav()
    req.flash("notice", `${inv_year} ${inv_make} ${inv_model} added successfully.`)
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the inventory item could not be added.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    })
  }
})

module.exports = invCont