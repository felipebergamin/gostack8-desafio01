const express = require("express");

const app = express();

app.use(express.json());

let projects = [];
let requestsCounter = 0;

const checkProjectExists = (req, res, next) => {
  const { id } = req.params;

  const exists = projects.find(p => p.id == id);

  if (!exists) {
    return res.status(404).json({ message: "Project not found" });
  }

  return next();
};

app.use((req, res, next) => {
  requestsCounter++;
  console.log(`total requests: ${requestsCounter}`);
  return next();
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });
  return res.json(projects);
});

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(projects);
});

app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);
  return res.send();
});

app.post("/projects/:id/tasks", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  return res.json(projects);
});

app.listen(3000);
