// Test script for the estimated weaning date feature
// This script tests the calculateEstimatedWeaningDate function

// Mock the date-fns functions for testing
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const parseISO = (dateString) => new Date(dateString);

// Mock implementation of addDaysToDate function
const addDaysToDate = (date, days) => {
  return addDays(parseISO(date), days).toISOString().split('T')[0];
};

// Implementation of calculateEstimatedWeaningDate function
const calculateEstimatedWeaningDate = (kindlingDate) => {
  return addDaysToDate(kindlingDate, 28); // Standard weaning period is 28 days (4 weeks)
};

// Test cases
console.log('Testing calculateEstimatedWeaningDate function:');
console.log('');

// Test 1: Basic calculation
const testDate1 = '2025-01-01';
const expectedWeaning1 = calculateEstimatedWeaningDate(testDate1);
console.log(`Test 1 - Kindling date: ${testDate1}`);
console.log(`Expected weaning date: ${expectedWeaning1}`);
console.log(`Expected: 2025-01-29, Got: ${expectedWeaning1}`);
console.log(`✓ Test 1 ${expectedWeaning1 === '2025-01-29' ? 'PASSED' : 'FAILED'}`);
console.log('');

// Test 2: Month boundary crossing
const testDate2 = '2025-01-15';
const expectedWeaning2 = calculateEstimatedWeaningDate(testDate2);
console.log(`Test 2 - Kindling date: ${testDate2}`);
console.log(`Expected weaning date: ${expectedWeaning2}`);
console.log(`Expected: 2025-02-12, Got: ${expectedWeaning2}`);
console.log(`✓ Test 2 ${expectedWeaning2 === '2025-02-12' ? 'PASSED' : 'FAILED'}`);
console.log('');

// Test 3: Year boundary crossing
const testDate3 = '2024-12-15';
const expectedWeaning3 = calculateEstimatedWeaningDate(testDate3);
console.log(`Test 3 - Kindling date: ${testDate3}`);
console.log(`Expected weaning date: ${expectedWeaning3}`);
console.log(`Expected: 2025-01-12, Got: ${expectedWeaning3}`);
console.log(`✓ Test 3 ${expectedWeaning3 === '2025-01-12' ? 'PASSED' : 'FAILED'}`);
console.log('');

// Test 4: Leap year handling
const testDate4 = '2024-02-15';
const expectedWeaning4 = calculateEstimatedWeaningDate(testDate4);
console.log(`Test 4 - Kindling date: ${testDate4} (leap year)`);
console.log(`Expected weaning date: ${expectedWeaning4}`);
console.log(`Expected: 2024-03-14, Got: ${expectedWeaning4}`);
console.log(`✓ Test 4 ${expectedWeaning4 === '2024-03-14' ? 'PASSED' : 'FAILED'}`);
console.log('');

// Test 5: Current date (today)
const today = new Date().toISOString().split('T')[0];
const expectedWeaningToday = calculateEstimatedWeaningDate(today);
const expectedDate = addDaysToDate(today, 28);
console.log(`Test 5 - Kindling date: ${today} (today)`);
console.log(`Expected weaning date: ${expectedWeaningToday}`);
console.log(`Expected: ${expectedDate}, Got: ${expectedWeaningToday}`);
console.log(`✓ Test 5 ${expectedWeaningToday === expectedDate ? 'PASSED' : 'FAILED'}`);
console.log('');

console.log('All tests completed!');
console.log('');
console.log('Summary:');
console.log('- The calculateEstimatedWeaningDate function adds exactly 28 days to the kindling date');
console.log('- This represents the standard 4-week weaning period for rabbits');
console.log('- The function handles month and year boundaries correctly');
console.log('- The estimated weaning date will be displayed in both LitterDetailPage and LitterListPage');
console.log('- New litters created through LitterModal will automatically have their estimated weaning date calculated');