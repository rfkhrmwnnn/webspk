/**
 * TOPSIS Algorithm Implementation
 */
class TopsisService {
  /**
   * Calculate TOPSIS Ranking
   * @param {Array} alternatives - List of alternatives with their evaluations
   * @param {Array} criteria - List of criteria with weights and types
   * @returns {Object} { ranking, steps }
   */
  static calculate(alternatives, criteria) {
    if (!alternatives || alternatives.length === 0 || !criteria || criteria.length === 0) {
      return { ranking: [], steps: {} };
    }

    const steps = {};

    // 1. Decision Matrix (X)
    // Structure: matrix[i][j] where i is alternative index, j is criteria index
    const matrix = [];
    const altIds = [];
    alternatives.forEach(alt => {
      altIds.push(alt.id);
      const row = [];
      criteria.forEach(crit => {
        // Find evaluation for this alternative and criteria
        const evalObj = alt.evaluations.find(e => e.criteria_id === crit.id);
        row.push(evalObj ? parseFloat(evalObj.value) : 0);
      });
      matrix.push(row);
    });
    steps.decisionMatrix = matrix;

    // 2. Normalized Decision Matrix (R)
    // R_ij = X_ij / sqrt(sum(X_ij^2))
    const numAlts = matrix.length;
    const numCrits = criteria.length;
    
    const divisors = new Array(numCrits).fill(0);
    for (let j = 0; j < numCrits; j++) {
      let sumSq = 0;
      for (let i = 0; i < numAlts; i++) {
        sumSq += Math.pow(matrix[i][j], 2);
      }
      divisors[j] = Math.sqrt(sumSq);
    }

    const normalizedMatrix = [];
    for (let i = 0; i < numAlts; i++) {
      const row = [];
      for (let j = 0; j < numCrits; j++) {
        // Prevent division by zero
        const val = divisors[j] === 0 ? 0 : matrix[i][j] / divisors[j];
        row.push(val);
      }
      normalizedMatrix.push(row);
    }
    steps.normalizedMatrix = normalizedMatrix;

    // 3. Weighted Normalized Decision Matrix (Y)
    // Y_ij = R_ij * W_j
    const weightedMatrix = [];
    for (let i = 0; i < numAlts; i++) {
      const row = [];
      for (let j = 0; j < numCrits; j++) {
        row.push(normalizedMatrix[i][j] * parseFloat(criteria[j].weight));
      }
      weightedMatrix.push(row);
    }
    steps.weightedMatrix = weightedMatrix;

    // 4. Ideal Positive (A+) and Ideal Negative (A-) Solutions
    const idealPositive = new Array(numCrits).fill(0);
    const idealNegative = new Array(numCrits).fill(0);

    for (let j = 0; j < numCrits; j++) {
      const type = criteria[j].type;
      const columnValues = weightedMatrix.map(row => row[j]);
      
      if (type === 'Benefit') {
        idealPositive[j] = Math.max(...columnValues);
        idealNegative[j] = Math.min(...columnValues);
      } else { // Cost
        idealPositive[j] = Math.min(...columnValues);
        idealNegative[j] = Math.max(...columnValues);
      }
    }
    steps.idealPositive = idealPositive;
    steps.idealNegative = idealNegative;

    // 5. Calculate Distances (D+ and D-)
    const dPlus = new Array(numAlts).fill(0);
    const dMinus = new Array(numAlts).fill(0);

    for (let i = 0; i < numAlts; i++) {
      let sumPlus = 0;
      let sumMinus = 0;
      for (let j = 0; j < numCrits; j++) {
        sumPlus += Math.pow(weightedMatrix[i][j] - idealPositive[j], 2);
        sumMinus += Math.pow(weightedMatrix[i][j] - idealNegative[j], 2);
      }
      dPlus[i] = Math.sqrt(sumPlus);
      dMinus[i] = Math.sqrt(sumMinus);
    }
    steps.dPlus = dPlus;
    steps.dMinus = dMinus;

    // 6. Calculate Preference Value (V)
    // V_i = D-_i / (D-_i + D+_i)
    const preferences = new Array(numAlts).fill(0);
    for (let i = 0; i < numAlts; i++) {
      const denominator = dMinus[i] + dPlus[i];
      preferences[i] = denominator === 0 ? 0 : dMinus[i] / denominator;
    }
    steps.preferences = preferences;

    // 7. Final Ranking
    const ranking = alternatives.map((alt, i) => ({
      ...alt,
      dPlus: dPlus[i],
      dMinus: dMinus[i],
      preferenceScore: preferences[i]
    }));

    // Sort descending based on preferenceScore
    ranking.sort((a, b) => b.preferenceScore - a.preferenceScore);

    // Add rank number
    ranking.forEach((item, idx) => {
      item.rank = idx + 1;
    });

    return { ranking, steps };
  }
}

module.exports = TopsisService;
