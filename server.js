const express = require('express');
const path = require('path');
const app = express();

// Configurar MIME types
app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
        if (path.endsWith('.html')) {
            res.set('Content-Type', 'text/html');
        }
    }
}));

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Servir componentes HTML
app.use('/components', express.static(path.join(__dirname, 'components'), {
    setHeaders: (res, path, stat) => {
        res.set('Content-Type', 'text/html');
    }
}));

// Servir arquivos estáticos com tratamento de erro
app.use('/', express.static(path.join(__dirname), {
    fallthrough: true
}));

app.use('/js', express.static(path.join(__dirname, 'js'), {
    setHeaders: (res, path, stat) => {
        res.set('Content-Type', 'application/javascript');
    },
    fallthrough: true
}));

app.use('/styles', express.static(path.join(__dirname, 'styles'), {
    setHeaders: (res, path, stat) => {
        res.set('Content-Type', 'text/css');
    },
    fallthrough: true
}));

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    fallthrough: true
}));

// Tratamento de erro para arquivos não encontrados
app.use((req, res, next) => {
    if (req.url.endsWith('.js') || req.url.endsWith('.css')) {
        console.error(`Arquivo não encontrado: ${req.url}`);
        res.status(404).send(`Arquivo não encontrado: ${req.url}`);
    } else {
        next();
    }
});

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Diretório base: ${__dirname}`);
}); 