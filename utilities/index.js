const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="nav-menu">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ***************************
 *  Build vehicle detail HTML
 * ************************** */
Util.buildVehicleDetail = async function(data) {
  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img 
          src="${data.inv_image}" 
          alt="Image of ${data.inv_year} ${data.inv_make} ${data.inv_model} on CSE Motors"
        />
      </div>
      <div class="vehicle-detail__info">
        <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <ul class="vehicle-detail__list">
          <li>
            <span class="detail-label">Price:</span>
            <span class="detail-value price">
              $${new Intl.NumberFormat('en-US').format(data.inv_price)}
            </span>
          </li>
          <li>
            <span class="detail-label">Year:</span>
            <span class="detail-value">${data.inv_year}</span>
          </li>
          <li>
            <span class="detail-label">Make:</span>
            <span class="detail-value">${data.inv_make}</span>
          </li>
          <li>
            <span class="detail-label">Model:</span>
            <span class="detail-value">${data.inv_model}</span>
          </li>
          <li>
            <span class="detail-label">Mileage:</span>
            <span class="detail-value">
              ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles
            </span>
          </li>
          <li>
            <span class="detail-label">Color:</span>
            <span class="detail-value">${data.inv_color}</span>
          </li>
          <li>
            <span class="detail-label">Description:</span>
            <span class="detail-value">${data.inv_description}</span>
          </li>
        </ul>
      </div>
    </section>
  `
}

/* ***************************
 *  Build classification select list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = Util