// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/") 
const invValidate = require('../utilities/inventory-validation')
//const { reconstructFieldPath } = require("express-validator/lib/field-selection")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInventoryId);

// Route to trigger intentional error
router.get("/error", utilities.handleErrors(invController.triggerError));

// Route to build inventory management view
router.get("/", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add-inventory", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", 
  utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildEditInventory)
)

//Route to process inventory update
router.post("/update/",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

//Deliver the delete confirmation view
router.get("/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.deleteView)
)

//Process the delete inventory request
router.post("/delete/",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteItem)
)

module.exports = router;