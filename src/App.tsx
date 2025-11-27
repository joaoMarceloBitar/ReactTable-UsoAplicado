import Table from "./components/Table"
import './App.css'
import TableSortSearch from "./components/TableSortSearch"
import TableWithSelection from "./components/TableWithSelection"
import TableAdvanced from "./components/TableAdvanced"

function App() {
  return (
    <div className="app-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">React Table</h1>
        <p className="hero-subtitle">
          Demonstração prática do TanStack Table com funcionalidades avançadas
        </p>
      </div>

      {/* Tabela Básica */}
      <div className="demo-section">
        <h2 className="section-title">1. Tabela Básica</h2>
        <p className="section-description">
          Implementação simples com dados estáticos e renderização básica.
        </p>
        <Table />
      </div>

      {/* Tabela com Busca e Ordenação */}
      <div className="demo-section">
        <h2 className="section-title">2. Busca e Ordenação</h2>
        <p className="section-description">
          Funcionalidades de filtro global e ordenação por colunas com indicadores visuais.
        </p>
        <TableSortSearch />
      </div>

      {/* Tabela com Seleção */}
      <div className="demo-section">
        <h2 className="section-title">3. Seleção de Linhas</h2>
        <p className="section-description">
          Seleção múltipla com checkboxes, ações em lote e cálculos dinâmicos.
        </p>
        <TableWithSelection />
      </div>

      {/* Tabela Completa */}
      <div className="demo-section">
        <h2 className="section-title">4. Funcionalidades Completas</h2>
        <p className="section-description">
          Paginação, filtros por coluna, export CSV, formatação de células e todas as funcionalidades integradas.
        </p>
        <TableAdvanced />
      </div>
    </div>
  )
}

export default App
