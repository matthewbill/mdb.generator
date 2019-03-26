describe('exports', () => {
  test('exports work correctly', () => {

      const { MyModule } = require('../index');
      expect(MyModule).toBeDefined();
      
  });
});
