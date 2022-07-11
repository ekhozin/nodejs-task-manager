const createNumericFiltersMapper = (fields) => (queryParams) => {
  return fields.reduce((acc, field) => {
    if (queryParams[field]) {
      const fieldConditionStrings = queryParams[field].split(',');
      
      acc[field] = fieldConditionStrings.reduce((res, current) => {
        const [operator, value] = current.split(':');
        res[`$${operator}`] = Number(value);
        
        return res;
      }, {});
    }
    
    return acc;    
  }, {});
};

module.exports = createNumericFiltersMapper;
