const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkIfIsUUID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID!" });
  }

  return next();
}

app.use("/repositories/:id", checkIfIsUUID);
app.use("/repositories/:id/like", checkIfIsUUID);

app.get("/repositories", (_, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository does not exist!" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository does not exist!" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository does not exist!" });
  }

  const repository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
