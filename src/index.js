const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const projects = [];

function logRequest(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    console.time(logLabel)

    next();

    console.timeEnd(logLabel)
}

function validateProjectId(request, response, next) {
    const { id } = request.params;
    
    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID.'});
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects',  (request, response)=> {
    //const { title, owner } = request.query;
    const { title } = request.query;
    //Filtro de resultado a baixo:
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;


    return response.json(results);
    //Final do fiiltro e Resultado.
});

app.post('/projects', (request, response)=> {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner, };
    
    projects.push(project);
    
    return response.json(project);
});

app.put('/projects/:id' ,  (request, response)=> {
    const { id } = request.params;
    const { title, owner } = request.body;

    const porjectIndex = projects.findIndex(project => project.id === id);

    if (porjectIndex <0) {
        return response.status(400).json({ error: 'Project not found.'})
    }

     const project = {
        id,
        title,
        owner,
     };
     
     projects[porjectIndex] = project;
    
    return response.json(project);
});

app.delete('/projects/:id', (request, response)=> {
    const { id } = request.params;

    const porjectIndex = projects.findIndex(project => project.id === id);

    if (porjectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.'})
    }

    projects.splice(porjectIndex, 1)

    return response.status(204).send();
});


app.listen(3333, ()=> {
    console.log('Back-end  started!');
});