# VisMat - Projeto ALA (Álgebra Linear Aplicada)

![VisMat Logo](images/VisMat-logo.svg)

> **Uma ferramenta educacional interativa para visualização e manipulação de operações de álgebra linear**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.txt)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Math.js](https://img.shields.io/badge/Math.js-Powered-blue.svg)](https://mathjs.org/)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Instalação e Uso](#instalação-e-uso)
- [Componentes do Sistema](#componentes-do-sistema)
- [Guias para Desenvolvedores](#guias-para-desenvolvedores)
- [Bibliotecas Utilizadas](#bibliotecas-utilizadas)
- [Contribuindo](#contribuindo)
- [Exemplos de Uso](#exemplos-de-uso)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **VizMat (Projeto ALA)** é uma aplicação web educacional desenvolvida por estudantes de Ciência da Computação da UFRJ, com o objetivo de auxiliar professores e alunos no ensino e aprendizado de Álgebra Linear. A ferramenta oferece uma interface intuitiva para visualizar operações matriciais e transformações geométricas em tempo real.

### 🎨 Principais Características

- **Interface Web Responsiva**: Funciona em qualquer navegador moderno
- **Visualizações Interativas**: Representações gráficas 2D/3D de transformações matriciais
- **Extensibilidade**: Sistema modular que permite adicionar novas fórmulas e visualizações
- **Tempo Real**: Atualizações instantâneas nas visualizações conforme os dados mudam
- **Educacional**: Projetado especificamente para fins pedagógicos

## ✨ Funcionalidades

### 🔢 Operações Matriciais
- **Soma de Matrizes**: Adição elemento por elemento
- **Multiplicação**: Produto matricial e multiplicação escalar
- **Decomposição LU**: Fatoração de matrizes
- **Sistemas Lineares**: Resolução usando diferentes métodos

### 📊 Visualizações Disponíveis
- **NumericView**: Representação numérica editável das matrizes
- **Geometric2dView**: Visualização 2D de transformações geométricas
- **Geometric3dView**: Representação tridimensional
- **GraphView**: Visualização em grafo para múltiplas matrizes
- **FunctionView**: Representação de funções matemáticas

### 📦 Datasets Pré-configurados
- **Identidade (2x2)**: Matriz identidade básica
- **Senoide**: Dados para visualização de funções trigonométricas
- **Rotação 90°**: Transformação de rotação 2D
- **Reflexão em X**: Transformação de reflexão
```

## 🚀 Instalação e Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (recomendado para desenvolvimento)

### Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd vizmat
```

2. **Inicie um servidor local**:
```bash
# Usando Python 3
python -m http.server 8000

# Usando Python 2
python -m SimpleHTTPServer 8000

# Usando Node.js
npx http-server
```

3. **Acesse a aplicação**:
Abra seu navegador e vá para `http://localhost:8000`

### Como Usar

1. **Selecione um Dataset**: Use o botão "DataSets" para carregar dados pré-configurados
2. **Escolha uma Fórmula**: Selecione a operação matemática desejada no dropdown
3. **Configure as Visualizações**: Cada célula pode ter diferentes tipos de visualização
4. **Edite os Dados**: Use a visualização numérica para modificar valores
5. **Observe os Resultados**: As visualizações são atualizadas automaticamente

## 🧩 Componentes do Sistema

### 1. 📊 Estrutura de Dados (Matrizes)

As matrizes são implementadas usando a biblioteca **Math.js**, fornecendo:
- Operações matemáticas robustas
- Suporte a diferentes tipos de dados
- Validação automática de dimensões

```javascript
// Estrutura básica das matrizes
matrixes = {
    A: math.matrix([[1, 2], [3, 4]]),
    B: math.matrix([[5, 6], [7, 8]]),
    C: math.matrix()  // Resultado das operações
}
```

### 2. 🧮 Fórmulas (Operações Matemáticas)

Sistema extensível de operações matemáticas:

**Estrutura Básica de uma Fórmula**:
```javascript
define(() => function(matrixes) {
    try {
        matrixes.C = math.add(matrixes.A, matrixes.B);
    } catch(e) {
        Messages.error(e);
    }
});
```

**Fórmulas Disponíveis**:
- `Soma`: Adição de matrizes A + B = C
- `Multiplicação`: Produto matricial A × B = C
- `LU`: Decomposição LU da matriz A
- `Solve`: Resolução de sistemas lineares

### 3. 👁️ Visualizações (Interface)

Sistema modular de visualizações baseado na classe `View`:

**Visualizações Disponíveis**:

#### NumericView
- Edição direta dos valores matriciais
- Validação de entrada
- Formatação automática de números

#### Geometric2dView
- Visualização de vetores 2D
- Interação por arrastar e soltar
- Grade de coordenadas configurável
- Animações em tempo real

#### Geometric3dView
- Representação tridimensional
- Rotação e zoom interativos
- Suporte a transformações 3D

#### GraphView
- Visualização de relações entre múltiplas matrizes
- Layout automático usando D3.js
- Representação de grafos direcionados

#### FunctionView
- Plotagem de funções matemáticas
- Suporte a funções paramétricas
- Zoom e navegação

## 👩‍💻 Guias para Desenvolvedores

### Criando uma Nova Fórmula

1. **Crie o arquivo da fórmula** em `scripts/formulas/`:
```javascript
define(() => function(matrixes) {
    try {
        // Sua operação matemática aqui
        matrixes.C = suaOperacao(matrixes.A, matrixes.B);
    } catch(e) {
        Messages.error(e);
    }
});
```

2. **Registre a fórmula** em `scripts/formulas/registry.js`:
```javascript
{
    name: "Nome da Sua Fórmula",
    file: "arquivo-da-formula",
    out: ["C"]  // Matrizes de saída
}
```

### Criando uma Nova Visualização

1. **Crie a classe da visualização**:
```javascript
class MinhaVisualizacao extends View {
    constructor(params) {
        super(params);
        // Inicialização
    }
    
    onMatrixChange() {
        // Atualizar visualização quando dados mudam
    }
    
    onResize(w, h) {
        // Redimensionar visualização
    }
}

define(() => MinhaVisualizacao);
```

2. **Registre a visualização** em `scripts/views/registry.js`:
```javascript
{
    name: "Minha Visualização",
    file: "MinhaVisualizacao",
    colspan: 1  // Número de colunas que ocupa
}
```

### API da Classe View

#### Propriedades Herdadas
- `_matrixNames`: Array com nomes das matrizes (["A", "B", "C"])
- `_matrixes`: Objeto proxy com acesso às matrizes
- `_container`: Elementos DOM (header, body, modal)
- `_out`: Array com matrizes de saída da fórmula atual

#### Métodos Disponíveis
- `onMatrixChange()`: Chamado quando matrizes são atualizadas
- `onResize(w, h)`: Chamado quando célula é redimensionada
- `onOutChange()`: Chamado quando fórmula muda
- `getModalMatrix(matrixName)`: Retorna elemento do modal para configuração
- `insertCssFile(path)`: Insere arquivo CSS na visualização
- `insertHtmlFile(path)`: Insere arquivo HTML na visualização

## 📚 Bibliotecas Utilizadas

### Principais Dependências

| Biblioteca | Versão | Propósito |
|------------|--------|-----------|
| **Math.js** | Última | Operações matemáticas e estruturas de dados |
| **jQuery** | 3.3.1 | Manipulação DOM e eventos |
| **D3.js** | v5 | Visualizações de dados |
| **P5.js** | Última | Gráficos 2D/3D e animações |
| **RequireJS** | Última | Sistema modular AMD |

### Bibliotecas de Suporte

- **D3-Graphviz**: Visualização de grafos
- **Viz.js**: Renderização Graphviz no navegador

## 🤝 Contribuindo

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Diretrizes

- Siga as convenções de código existentes
- Documente novas funcionalidades
- Teste thoroughly antes de submeter
- Use mensagens de commit descritivas

### Reportando Bugs

Abra uma issue incluindo:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do navegador

## 💡 Exemplos de Uso

### Exemplo 1: Visualização de Rotação 2D

1. Carregue o dataset "Rotação 90º 2d"
2. Selecione a fórmula "Multiplicação"
3. Use Geometric2dView para ver a transformação
4. Arraste os vetores para ver como a rotação afeta diferentes pontos

### Exemplo 2: Análise de Sistema Linear

1. Configure matrizes A e B manualmente
2. Use a fórmula "Solve" para resolver Ax = B
3. Visualize o resultado em NumericView
4. Use GraphView para ver relações entre variáveis

### Exemplo 3: Visualização de Funções

1. Carregue o dataset "Senoide"
2. Use FunctionView para plotar a função
3. Modifique parâmetros e observe mudanças em tempo real

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE.txt](LICENSE.txt) para detalhes.

```
MIT License

Copyright (c) [2019] [André Cordeiro Santos de Queiroz, Filipe José Maciel Ramalho]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
