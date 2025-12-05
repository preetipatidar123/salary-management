function calculateDeductions(gross, country) {
    let tds = 0;
  
    switch (country.toLowerCase()) {
      case 'india':
        tds = gross * 0.10; // 10%
        break;
      case 'united states':
      case 'usa':
      case 'us':
        tds = gross * 0.12; // 12%
        break;
      default:
        tds = 0; // No deductions for other countries
        break;
    }
  
    const net = gross - tds;
    return { tds, net };
  }
  
  module.exports = { calculateDeductions };
  