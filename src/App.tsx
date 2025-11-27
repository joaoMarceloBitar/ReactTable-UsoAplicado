import TabelaBasica from "./componentes/TabelaBasica"
import './App.css'
import TabelaBuscaOrdenacao from "./componentes/TabelaBuscaOrdenacao"
import TabelaSelecaoLinhas from "./componentes/TabelaSelecaoLinhas"
import TabelaAvancada from "./componentes/TabelaAvancada"

function Aplicacao() {
  return (
    <div className="container-aplicacao">
      <div className="secao-hero">
        <h1 className="titulo-hero">Tabelas React</h1>
        <p className="subtitulo-hero">
          Demonstração prática do TanStack Table com funcionalidades avançadas
        </p>
      </div>

      <div className="secao-demo">
        <h2 className="titulo-secao">1. Tabela Básica</h2>
        <p className="descricao-secao">
          Implementação simples com dados estáticos e renderização básica.
        </p>
        <TabelaBasica />
      </div>

      <div className="secao-demo">
        <h2 className="titulo-secao">2. Busca e Ordenação</h2>
        <p className="descricao-secao">
          Funcionalidades de filtro global e ordenação por colunas com indicadores visuais.
        </p>
        <TabelaBuscaOrdenacao />
      </div>

      <div className="secao-demo">
        <h2 className="titulo-secao">3. Seleção de Linhas</h2>
        <p className="descricao-secao">
          Seleção múltipla com checkboxes, ações em lote e cálculos dinâmicos.
        </p>
        <TabelaSelecaoLinhas />
      </div>

      <div className="secao-demo">
        <h2 className="titulo-secao">4. Funcionalidades Completas</h2>
        <p className="descricao-secao">
          Paginação, filtros por coluna, export CSV, formatação de células e todas as funcionalidades integradas.
        </p>
        <TabelaAvancada />
      </div>
    </div>
  )
}

export default Aplicacao
