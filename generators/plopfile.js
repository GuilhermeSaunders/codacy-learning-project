import { singleIdActions } from './actions/singleId';

module.exports = (plop) => {
  // Gerador para controlador, repositório, rotas e DTO
  plop.setGenerator('model', {
    description: 'Create a controller, repository, routes, and DTO for a model',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Digite o nome do model (ex. User, Aviso):',
      },
    ],
    actions: singleIdActions,
  });
};
