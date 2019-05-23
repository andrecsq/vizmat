# Índice
* [Estrutura Básica](#estrutura-básica)
  * [Modelo padrão de uma visualização](#modelo-padrão-de-uma-visualização)
  * [A classe View](#a-classe-view)
  * [Importando bibliotecas externas](#importando-bibliotecas-externas)
  * [Recursos Herdados](#recursos-herdados)
      * [Propriedades Herdadas](#propriedades-herdadas)
      * [Métodos Herdados](#métodos-herdados)
* [Criei minha visualização, e agora?](#criei-minha-visualização-e-agora)
* [Recursos](#recursos)
  * [Bibliotecas](#bibliotecas)
  * [Helpers](#helpers)
* [Recomendações](#recomendações)

# Estrutura Básica

As visualizações possuem uma pasta correta para sua localização. esta pasta é [/scripts/views](/script/views).

Se sua visualização precisar de mais de um arquivo para funcionar (como html's ou css's), crie uma pasta com o nome de sua visualização e dentro crie um arquivo javascript com o mesmo nome. 

Se sua visualização precisar de apenas um arquivo para funcionar, apenas crie um arquivo javascript com o nome de sua visualização.

Este javascript criado será sua classe de visualização. Nele que todas as funcionalidades de sua visualização serão inseridas.

## Modelo padrão de uma visualização

As visualizações são partes cruciais do projeto. Elas são a cara do que se quer ver no webapp e por isso precisam de um certo cuidado ao serem criadas. Por isso existe uma forma correta de construí-las.
Abaixo você pode ver um exemplo de classe de visualização. Observe que a classe estende uma outra classe chamada View (falaremos sobre a classe View depois).
Todas as visualizações recebem muitos dados de parâmetros e estes dados devem ser repassados para a View, por isso no construtor de sua classe você deve, antes de qualquer outro comando, inserir o comando ``super(params)``, sendo *"params"* o parâmetro do construtor.

```javascript
class ExampleView extends View{
  constructor(params){
    super(params);
  }

}

//Ao final do seu arquivo, você deve adicionar o método define.
define(()=>ExampleView);
```

Para que sua classe seja devidamente reconhecida pelo sistema, é necessário que você coloque ao final do seu arquivo o comando define recebendo como parâmetro um callback que retorne **sua classe** (como exemplificado acima);


## A classe View

A classe view é uma classe que serve para o sistema fazer o "dirty work" das visualizações. Ela inicializa objetos e propriedades que serão de extrema importância para serem usados por sua visualização. Todos os dados que o sistema passa através do parâmetro no construtor de sua classe são manipulados e refinados pela classe view para que fiquem utilizáveis pela visualização que você pretende construir, por isso é importante chamar a diretiva super passando o parâmetro do seu construtor.

### Importando bibliotecas externas

### Recursos Herdados
A partir da classe view o desenvolvedor de visualizações tem acesso a uma série de propriedades e métodos do sistema que serão úteis para o desenvolvimento.

#### Propriedades Herdadas
São dados do sistema que informam coisas importantes, como os nomes das matrizes usadas na célula, os valores das matrizes, etc. Abaixo estão listados todas estas propriedades.

***_matrixNames***:  
Array com nomes das matrizes (A, B, C ...) que serão representadas pela visualização. Isto é calculado baseado na posição inicial da célula somado ao tamanho horizontal(colspan) dela.

Você pode acessar esta propriedades em qualquer parte da sua visualização (se ela estender View) através de ``this._matrixNames``.

***_matrixes***:  
A estrutura de dados contendo todas as matrizes. Maiores detalhes desta estrutura podem ser encontrados na seção de [Recursos](#recursos).

Você pode acessar esta propriedades em qualquer parte da sua visualização (se ela estender View) através de ``this._matrixes``.

***_container***:
Objeto que contem os seguintes elementos.

  - *header*: Elemento html do header da célula de visualização.

  - *body*: Elemento html do "inner container"

  - *modal*:

***_out***:


#### Métodos Herdados
* onMatrixChange
* onResize

# Criei minha visualização, e agora?

# Recursos

## Bibliotecas

## Helpers
# Recomendações
