/*
  Author: André Kreienbring
  Several utility functions to build generic SQL statements
*/

/*
Builds a SQL search with placeholders for the given criterias.
@param {array} searches Fields that will be used for the WHERE clause
@param {array} criterias Will only be used for a plausibility check.
@param {string} logical If more then one search fild is given. Must be:
  'AND' (default) or 'OR'
@return {string} The created search string.
*/
function buildSearchCriterias(searches, criterias, logical) {
  if (searches.length !== criterias.length) {
    console.error("Every search column needs a criteria");
    return null;
  }
  if (logical === null) logical = "AND";

  let scolumns = "";
  searches.forEach((col) => {
    if (scolumns !== "") scolumns += ` ${logical} `;
    scolumns += col + " = ?";
  });

  return scolumns;
}

/*
  Builds column and values that can be used for sqlite prepare statements.
  @param {object} fields The fields (col / value pairs) that will be updated in the table.
  @return {object} Contains the columns as string and the values as an array.
*/
function buildFieldValues(fields) {
  let columns = "";
  const values = [];
  Object.entries(fields).forEach(([col, value]) => {
    if (columns !== "") columns += ", ";
    columns += col + " = ?";
    values.push(value);
  });

  return { columns, values };
}

/*
  A helper for the insert statement. Columns, placeholder and values are
  build from a list of column/value pairs.
  @param {object} inserts An object with (multiple) column/value pairs.
  @return {object} An object with columns, placeholders, values that can be
    used to construct an insert statement
*/
function buildTableValues(inserts) {
  let columns = "";
  const values = [];
  let placeholders = "";
  Object.entries(inserts).forEach(([col, value]) => {
    if (columns !== "") columns += ", ";
    columns += col;
    values.push(value);
    if (placeholders !== "") placeholders += ", ";
    placeholders += `?`;
  });

  return { columns, placeholders, values };
}

module.exports = {
  buildSearchCriterias,
  buildFieldValues,
  buildTableValues,
};
