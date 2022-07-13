const createNumericFiltersMapper = (fields) => (queryParams) => {
  const result = {};

  fields.forEach((field) => {
    if (queryParams[field]) {
      const fieldConditionStrings = queryParams[field].split(',');
      
      result[field] = fieldConditionStrings.reduce((res, current) => {
        const [operator, value] = current.split(':');
        res[`$${operator}`] = Number(value);
        
        return res;
      }, {});
    }    
  });

  return result;
};

module.exports = createNumericFiltersMapper;
