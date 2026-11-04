import { getQuestions } from './questions';
import { GradeBand, Subject } from '../types';

describe('question bank', () => {
  const cases: [GradeBand, Subject][] = [
    ['1-3', 'math'],
    ['1-3', 'english'],
    ['4-6', 'math'],
    ['4-6', 'english'],
  ];

  cases.forEach(([gradeBand, subject]) => {
    it(`has 10 questions for grade ${gradeBand} and ${subject}`, () => {
      const questions = getQuestions(gradeBand, subject);

      expect(questions).toHaveLength(10);
      questions.forEach((question) => {
        expect(question.options.length).toBeGreaterThanOrEqual(2);
        expect(question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex).toBeLessThan(question.options.length);
      });
    });
  });
});
