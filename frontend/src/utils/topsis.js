/**
 * TOPSIS Algorithm implementation for PKH dataset
 */

export const calculateTopsis = (data, weights = null) => {
  if (!data || data.length === 0) return [];

  // Define criteria keys
  const criteria = ['aud', 'sd', 'smp', 'sma', 'disabilitas', 'lansia', 'hamil'];
  
  // Default weights if not provided
  const defaultWeights = {
    aud: 0.15,
    sd: 0.10,
    smp: 0.15,
    sma: 0.20,
    disabilitas: 0.20,
    lansia: 0.15,
    hamil: 0.05
  };

  const activeWeights = weights || defaultWeights;

  // 1. Create Decision Matrix
  const matrix = data.map(item => criteria.map(key => item[key] || 0));

  // 2. Normalization (R)
  // Calculate divider for each criterion: sqrt(sum(x^2))
  const dividers = criteria.map((_, colIndex) => {
    const sumSquare = matrix.reduce((sum, row) => sum + Math.pow(row[colIndex], 2), 0);
    return Math.sqrt(sumSquare) || 1; // Avoid division by zero
  });

  const normalizedMatrix = matrix.map(row => 
    row.map((val, colIndex) => val / dividers[colIndex])
  );

  // 3. Weighted Normalized Matrix (Y)
  const weightedMatrix = normalizedMatrix.map(row => 
    row.map((val, colIndex) => val * activeWeights[criteria[colIndex]])
  );

  // 4. Ideal Positive (A+) and Ideal Negative (A-) solutions
  // All criteria are "Benefit" (higher is better for priority)
  const idealPositive = criteria.map((_, colIndex) => {
    return Math.max(...weightedMatrix.map(row => row[colIndex]));
  });

  const idealNegative = criteria.map((_, colIndex) => {
    return Math.min(...weightedMatrix.map(row => row[colIndex]));
  });

  // 5. Calculate Distances (S+ and S-)
  const results = data.map((item, rowIndex) => {
    const row = weightedMatrix[rowIndex];
    
    const distancePositive = Math.sqrt(
      row.reduce((sum, val, colIndex) => sum + Math.pow(val - idealPositive[colIndex], 2), 0)
    );
    
    const distanceNegative = Math.sqrt(
      row.reduce((sum, val, colIndex) => sum + Math.pow(val - idealNegative[colIndex], 2), 0)
    );

    // 6. Preference Value (V)
    const preferenceValue = distanceNegative / (distancePositive + distanceNegative) || 0;

    return {
      ...item,
      v: preferenceValue,
      s_plus: distancePositive,
      s_minus: distanceNegative,
      raw_values: row, // This will be the weighted row for now, but we can return more if needed
    };
  });

  // Sort by preference value descending
  const sortedResults = results.sort((a, b) => b.v - a.v);

  return {
    results: sortedResults,
    matrix: matrix,
    normalizedMatrix: normalizedMatrix,
    weightedMatrix: weightedMatrix,
    idealPositive: idealPositive,
    idealNegative: idealNegative,
    criteria: criteria
  };
};
