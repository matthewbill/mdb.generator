describe('exports', () => {
  test('exports work correctly', () => {

      const { <%= componentNameClass %> } = require('../index.js');
      expect(<%= componentNameClass %>).toBeDefined();
      
  });
});
