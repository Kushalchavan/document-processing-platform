import { chunkText } from '../../src/shared/utils/chunk';
import { describe, it, expect } from 'vitest';

describe('chunkText', () => {
  it('should split text into chunks of the specified size', () => {
    // Arrange
    const text = 'abcdefghij';

    // Act
    const chunks = chunkText(text, 3);

    // Assert
    expect(chunks).toEqual(['abc', 'def', 'ghi', 'j']);
  });
});
