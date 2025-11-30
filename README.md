# ArtVisionDeployFinal

Repositório que consolida frontend, backend e módulos compartilhados em
uma arquitetura TypeScript unificada. O objetivo é fornecer uma base
consistente para aplicações web modulares, com suporte nativo a
contêineres e processos de build integrados.

## Arquitetura

O projeto segue uma divisão clara de responsabilidades:

-   **client**: código da interface, incluindo assets, rotas e lógica de
    apresentação.\
-   **server**: serviços, endpoints HTTP, middlewares e lógica de
    negócio.\
-   **shared**: tipos, utilitários e definições compartilhadas entre
    client e server.

A estrutura facilita o reaproveitamento de código, evita duplicação e
mantém a tipagem consistente em todo o ecossistema.

## Componentes e Tecnologias

-   **TypeScript** em todas as camadas\
-   **Vite** para build e bundling\
-   **Node.js** no backend\
-   **Docker** para empacotamento\
-   **PostCSS** para pipeline de estilos

## Layout do Repositório

    /
    ├── client/
    ├── server/
    ├── shared/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── postcss.config.js
    └── ...

## Procedimentos de Execução

### Ambiente local

1.  Clonar:

    ``` bash
    git clone https://github.com/IchinoSanji/ArtVisionDeployFinal.git
    cd ArtVisionDeployFinal
    ```

2.  Instalar dependências:

    ``` bash
    npm install
    ```

3.  Iniciar conforme scripts do `package.json`.

### Contêiner

1.  Build:

    ``` bash
    docker build -t artvision .
    ```

2.  Execução:

    ``` bash
    docker run -p 3000:3000 artvision
    ```

## Contribuições

Pull requests devem seguir o padrão do projeto e incluir descrição clara
das alterações.

------------------------------------------------------------------------

# Licença --- MIT

    MIT License

    Copyright (c) [ano] [seu nome]

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
