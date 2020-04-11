const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  if(!repositories){
    return response.status(400).json({error: "repository null."})
  }
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const r_id = uuid();
  const r_title = title;
  const r_url = url;
  const r_techs = techs;
  const r_like = 0;
  const repository = {id: r_id, title: r_title, url: r_url,
                      techs: r_techs, likes: r_like}
  
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const r_title = title;
  const r_url = url;
  const r_techs = techs;
  const idRepository = repositories.findIndex(
        repository => repository.id === id  
      );

  if (idRepository === -1) {
    return response.status(400).json({ error: 'Repository does not exists.' });
  }
  const updateRepository = repositories[idRepository];

  const repository = {
    id: id,
    title: r_title,
    url: r_url,
    techs: r_techs,
    likes: updateRepository.likes
  };

  repositories[idRepository] = repository;

  return response.json(repositories[idRepository]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const ERRO_NOT_EXIST = 400;
  const SUCESS = 204;
  const ERROR_REPOSITORY_NOEXIST = 'Repository does not exists.';
  const idRepository = repositories.findIndex(repository => 
    repository.id === id  
  );

  if (idRepository >= 0) {
    repositories.splice(idRepository, 1);
  } else {
    return response.status(ERRO_NOT_EXIST).json({ error: ERROR_REPOSITORY_NOEXIST });
  }

  return response.status(SUCESS).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const ERRO_NOT_EXIST = 400;
  const ERROR_REPOSITORY_NOEXIST = 'Repository does not exists.';
  const idRepository = repositories.findIndex(repository => 
    repository.id === id  
  );

  if (idRepository === -1) {
    return response.status(ERRO_NOT_EXIST).json({ error: ERROR_REPOSITORY_NOEXIST });
  }

  repositories[idRepository].likes++;

  return response.json(repositories[idRepository]);
});

module.exports = app;
