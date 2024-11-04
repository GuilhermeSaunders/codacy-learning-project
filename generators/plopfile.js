module.exports = (plop) => {
  // Gerador para controlador, repositório, rotas e DTO
  plop.setGenerator('model', {
    description: 'Create a controller, repository, routes, and DTO for a model',
    prompts: [
      {
        type: 'input',
        name: 'model',
        message: 'Digite o nome do model (ex. User, Aviso):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/controllers/{{pascalCase model}}Controller.ts',
        templateFile: 'templates/singleId/regularController.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/repositories/{{pascalCase model}}Repository.ts',
        templateFile: 'templates/singleId/regularRepository.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/routes/{{pascalCase model}}Routes.ts',
        templateFile: 'templates/singleId/regularRoutes.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/DTOs/{{pascalCase model}}.ts',
        templateFile: 'templates/singleId/regularDTO.ts.hbs',
      },
      {
        type: 'modify',
        path: '../src/DTOs/index.ts',
        pattern: /^(import .*;\n)/,
        template:
          "import { {{pascalCase model}}, Update{{pascalCase model}} } from './{{pascalCase model}}';\n$1",
      },
      {
        type: 'modify',
        path: '../src/controllers/index.ts',
        pattern: /(export {)/,
        template:
          "import {{pascalCase model}}Controller from './{{pascalCase model}}Controller';\n\n$1",
      },
      {
        type: 'modify',
        path: '../src/repositories/index.ts',
        pattern: /(export {)/,
        template:
          "import {{pascalCase model}}Repository from './{{pascalCase model}}Repository';\n\n$1",
      },

      {
        type: 'append',
        path: '../src/controllers/index.ts',
        template: 'export { {{pascalCase model}}Controller };\n',
        skipIfExists: true,
      },
      {
        type: 'append',
        path: '../src/repositories/index.ts',
        template: 'export { {{pascalCase model}}Repository };\n',
        skipIfExists: true,
      },
      {
        type: 'append',
        path: '../src/DTOs/index.ts',
        template:
          'export { {{pascalCase model}}, Update{{pascalCase model}} };\n',
        skipIfExists: true,
      },
      {
        type: 'modify',
        path: '../src/routes/index.ts', // O mesmo arquivo
        pattern: /\n/, // Localização específica
        template:
          "\n\nimport {{pascalCase model}}Routes from './{{pascalCase model}}Routes';",
      },
      {
        type: 'modify',
        path: '../src/routes/index.ts', // O mesmo arquivo
        pattern: /const router = Router\(\);/, // Padrão para encontrar a linha do router.use
        template:
          "const router = Router();\n\nrouter.use('/{{camelCase model}}', {{pascalCase model}}Routes);",
      },
    ],
  });
};
