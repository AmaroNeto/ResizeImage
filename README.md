# ResizeImage

- Autor: Amaro
- Linguagem: Java Script
- Lib: Node JS / Express

Este git é a resposta para o desafio da Resize Photos, ele foi feito em Node JS.

# Execução

Para execultar é só baixar o arquivo, acessar a pasta via terminal

e colocar os comandos:

$ npm install ```para baixar dependencias```

$ npm start

PS: tenha certesa de ter instalado o Mongo DB e Node JS.

depois que estiver rodando siga os seguintes passos (nessa ordem):

1. acesse via GET esse endereço: http://127.0.0.1:3000/images/savingImagesFromInternet

ele baixa as fotos de exemplo e salva no banco de dados Mongo DB

e depois:

2. acesse via GET esse endereço: http://localhost:3000/images/showAllImages/

nele traz um json com todas as imagens nos formatos small, medium e big.

PS: pode execultar isso diretamente no browser, basta colocar esses endereços na url do navegador.

# Explicação

Foram utilizadas alguns modulos para esse desafio:

- Mongoose: que é o conector do Mongo DB.

- Request: para fazer acesso http e baixar as fotos online.

- Jimp: ele faz o Resize das fotos.


A ideia do codigo é:

primeiramente é necessario salvar as fotos dadas:

essa função é feita através dessa url: http://127.0.0.1:3000/images/savingImagesFromInternet

as fotos são salvas com um id único no Mongo DB.

Depois vc pode localizar essas fotos pelo id e o tamanho exemplo:
```
http://localhost:3000/images/showImage/{size}/{id}

size é o tamanho da foto (small, medium ou big)
id  o id único dela.

exemplo:
http://localhost:3000/images/showImage/small/1

aqui se obtem a foto 1 do tamanho pequeno.
```
Todas as fotos são salvas no BD do tamanho original e só são convertidas na hora de mostrar para o usuário.


por último tem a função que retorna todas as fotos em todos os tamanhos:

http://localhost:3000/images/showAllImages/

JSON:

```
{
"images":
[{"url_small":"http://localhost:3000/images/showImage/small/0",
"url_medium":"http://localhost:3000/images/showImage/medium/0",
"url_big":"http://localhost:3000/images/showImage/big/0"}
...
```

Sendo como tag url_small,url_medium, url_big


Pode ser visto mais no código onde tem comentario sobre a execulção no arquivo routes/images.js
