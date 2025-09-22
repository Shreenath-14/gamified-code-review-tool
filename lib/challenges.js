export const challenges = [
  {
    id: 1,
    title: "Add Two Numbers",
    description: "Write a function add(a, b) that returns the sum of a and b.",
    points: 20,
    tests: [
      { input: [2, 3], expected: 5 },
      { input: [10, 20], expected: 30 },
      { input: [-1, 1], expected: 0 },
    ],
  },
  {
    id: 2,
    title: "Find Maximum",
    description: "Write a function max(a, b) that returns the greater of two numbers.",
    points: 40,
    tests: [
      { input: [2, 3], expected: 3 },
      { input: [10, 20], expected: 20 },
      { input: [-1, -5], expected: -1 },
    ],
  },
  {
    id: 3,
    title: "Factorial",
    description: "Write a function factorial(n) that returns the factorial of n.",
    points: 60,
    tests: [
      { input: [3], expected: 6 },
      { input: [5], expected: 120 },
      { input: [0], expected: 1 },
    ],
  },
]
