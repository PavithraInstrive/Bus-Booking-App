// utils/seatUtils.js

/**
 * Generate seat names based on the bus capacity.
 * Example: If capacity is 40, generate seats like "1A", "1B", ..., "5D"
 * 
 * @param {number} capacity - Total number of seats in the bus
 * @returns {Array} - An array of seat names
 */
const generateSeatNames = (capacity) => {
    const seatRows = ['A', 'B', 'C', 'D']; // Example seat rows
    const seatNames = [];
  
    for (let row = 1; row <= Math.ceil(capacity / seatRows.length); row++) {
      for (let col = 0; col < seatRows.length; col++) {
        const seatName = `${row}${seatRows[col]}`;
        seatNames.push(seatName);
        if (seatNames.length === capacity) break;
      }
      if (seatNames.length === capacity) break;
    }
  
    return seatNames;
  };
  
  module.exports = {
    generateSeatNames,
  };
  