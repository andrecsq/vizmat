
# Índice

* [Como criar uma fórmula](#como-criar-uma-fórmula)
    * [Estrutura de diretórios](#estrutura-de-diretórios)
    * [Escrevendo uma fórmula](#escrevendo-uma-fórmula)
        * [Informação Importante sobre atualização das matrizes](#informação-importante-sobre-atualização-das-matrizes)
        * [A estrutura das matrizes](#a-estrutura-das-matrizes)
        * [Adicionar bibliotecas externas com a lib require.js](#adicionar-bibliotecas-externas-com-a-lib-require.js)
* [Escrevi minha fórmula, e agora?](#escrevi-minha-fórmula-e-agora?)


# Como criar uma Fórmula

Ao criar uma fórmula, você deve estar ciente de que toda a estrutura de dados das matrizes estão feitas em cima da biblioteca
math.js (Documentação disponível em [https://mathjs.org/docs/index.html](https://mathjs.org/docs/index.html)) e que qualquer alteração nestas estruturas exigirá algum conhecimeto
desta biblioteca.

## Estrutura de diretórios
Na estrutura de diretórios do projeto, você encontrará todas as fórmulas em [/scripts/formulas](/scripts/formulas), e é nesta pasta onde o arquivo criado para sua fórmula deve ficar.

Além do arquivo da fórmula propriamente dito, você deve também perceber que existe um arquivo chamado [registry.js](/scripts/formulas/registry.js). Este arquivo será muito útil, falaremos sobre ele depois.

## Escrevendo uma fórmula

Todos os arquivos de fórmula devem ter a seguinte estrutura básica.

```javascript
define(()=>function(matrixes){
    try{
        //Código da fórmula aqui
    }catch(e){
        //Você pode personalizar esta parte, mas sempre deve ter Messages.error sendo lançada ao final.
        Messages.error(e)
    }
});
```
### Informação importante sobre atualização das matrizes

Sempre que você escrever um código para a fórmula, tenha em mente que as visualizações só irão "saber" que você alterou os dados nas matrizes se você fizer uma atribuição direta na estrutura.

```javascript
matrixes.<<MATRIZ_DESEJADA>> = resultado_da_sua_formula;
```

Exemplo: 

```javascript
matrixes.C = math.add(matrixes.A,matrixes.B);
```

Caso nenhuma atribuição direta seja feita, você deve forçar que isto aconteça, Atribuindo, ao final da fórmula, a matriz a ela mesma, da seguinte forma.

```javascript
matrixes.<<MATRIZ_DESEJADA>> = matrixes.<<MATRIZ_DESEJADA>>
```
Exemplo:
```javascript
matrixes.C = matrixes.C
```
### A estrutura das matrizes

As matrizes, como você ja deve ter notado, ficam na estrutura passada como parâmetro para a fórmula ("matrixes"). Esta estrutura é um objeto [Proxy](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Proxy) com os índices (chaves) sendo o nome de cada matriz (A,B,C, etc. - Até o presente momento há apenas as matrizes A,B e C). Cada matriz é um objeto matrix da biblioteca math.js.

A estrutura pode ser definida da seguinte forma:

```javascript
matrixes= {
    A: math.matrix([/*conteudo da matriz*/]),
    B: math.matrix([/*conteudo da matriz*/]),
    C: math.matrix([/*conteudo da matriz*/]),
}
```

### Adicionar bibliotecas externas com a lib require.js

O projeto já inclui uma série de bibliotecas por padrão em seu escopo, como a math.js que já contempla uma gama bem grande de funcionalidades, mas se ainda assim você precisar de uma biblioteca que não está presente no projeto, você pode incluí-la na sua fórmula.

Você ja deve ter percebido que sua fórmula está dentro de uma função chamado ``define()``. Esta função é característica da lib [require.js](https://requirejs.org/) e é importante para que a lib consiga carregar qualquer código dentro do projeto.

Para introduzir uma biblioteca nova à sua formula, adicione um array de urls contendo os códigos das suas bibliotecas como primeiro argumento da ``define()`` e adicione referências as bibliotecas como argumentos da função de callback no segundo argumento, ficando o seu código da seguinde forma:

```javascript
define(["http://lib1.com","http://lib2.com",...],(lib1,lib2,...)=>function(matrixes){
    try{
        /*
        lib1.func(args);
        lib2.func(args);
        restante do código da fórmula aqui
        */
    }catch(e){
        //Você pode personalizar esta parte, mas sempre deve ter Messages.error sendo lançada ao final.
        Messages.error(e)
    }
});
```

# Escrevi minha fórmula, e agora?
Ao terminar de escrever sua fórmula, você ainda precisa realizar um último passo, utilizando o arquivo [registry.js](/scripts/formulas/registry.js).

Ao abrir o arquivo registry.js você perceberá que ele contém em sua função ``define()`` um array de objetos. Este array de objetos contém informações básicas sobre sua fórmula.

Para adicionar um novo registro você precisa adicionar um novo objeto neste array com as seguintes propriedades:

- name: (Atributo obrigatório) Nome usado para ser exibido 
- file: (Atributo opcional) nome ou path (sem extensão) do arquivo da fórmula. Caso não seja especificado, o atributo name será usado no lugar.
- out: (Opcional) Array contendo o nome de todas as matrizes que serão consideradas como resultados da sua formula. Caso não seja especificado, a matriz C será usada como saída.

Seu objeto ficaria como em um dos casos abaixo, por exemplo:

* Especificando todos os atributos:
```
{name:"Nome da sua formula",file:"path/sem/extensão",out:["A","C"]}
```
* Especificando apenas o nome e as saídas (deixando o path ser o nome)
```
{name:"Nome da sua formula",out:["A","C"]}
```
* Especificando apenas o nome e o path (deixando a saída ser a matriz C)
```
{name:"Nome da sua formula",file:"path/sem/extensão"}
```
* Especificando apenas o nome (deixando a saída ser C e o path ser o nome)
```
{name:"Nome da sua formula"}
```