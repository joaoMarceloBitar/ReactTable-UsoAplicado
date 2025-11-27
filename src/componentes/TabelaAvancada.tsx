import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table"
import "./estilos.css"

type Venda = {
  id: number
  produto: string
  categoria: string
  preco: number
  quantidade: number
  total: number
  data: string
  vendedor: string
  status: string
}

const dadosVendas: Venda[] = [
  { id: 1, produto: "Notebook Dell", categoria: "Eletrônicos", preco: 2500, quantidade: 2, total: 5000, data: "2024-01-15", vendedor: "Ana Silva", status: "Concluída" },
  { id: 2, produto: "Mouse Gamer", categoria: "Eletrônicos", preco: 150, quantidade: 5, total: 750, data: "2024-01-16", vendedor: "Carlos Santos", status: "Pendente" },
  { id: 3, produto: "Cadeira Ergonômica", categoria: "Móveis", preco: 800, quantidade: 1, total: 800, data: "2024-01-17", vendedor: "Beatriz Costa", status: "Concluída" },
  { id: 4, produto: "Smartphone Samsung", categoria: "Eletrônicos", preco: 1200, quantidade: 3, total: 3600, data: "2024-01-18", vendedor: "Diego Oliveira", status: "Cancelada" },
  { id: 5, produto: "Mesa de Escritório", categoria: "Móveis", preco: 600, quantidade: 2, total: 1200, data: "2024-01-19", vendedor: "Elena Ferreira", status: "Concluída" },
  { id: 6, produto: "Fone Bluetooth", categoria: "Eletrônicos", preco: 200, quantidade: 4, total: 800, data: "2024-01-20", vendedor: "Ana Silva", status: "Pendente" },
  { id: 7, produto: "Livro Técnico", categoria: "Livros", preco: 80, quantidade: 10, total: 800, data: "2024-01-21", vendedor: "Carlos Santos", status: "Concluída" },
  { id: 8, produto: "Monitor 4K", categoria: "Eletrônicos", preco: 1800, quantidade: 1, total: 1800, data: "2024-01-22", vendedor: "Beatriz Costa", status: "Concluída" },
  { id: 9, produto: "Estante de Livros", categoria: "Móveis", preco: 400, quantidade: 2, total: 800, data: "2024-01-23", vendedor: "Diego Oliveira", status: "Pendente" },
  { id: 10, produto: "Curso Online", categoria: "Educação", preco: 300, quantidade: 5, total: 1500, data: "2024-01-24", vendedor: "Elena Ferreira", status: "Concluída" },
  { id: 11, produto: "Tablet iPad", categoria: "Eletrônicos", preco: 2000, quantidade: 1, total: 2000, data: "2024-01-25", vendedor: "Ana Silva", status: "Concluída" },
  { id: 12, produto: "Poltrona Reclinável", categoria: "Móveis", preco: 1200, quantidade: 1, total: 1200, data: "2024-01-26", vendedor: "Carlos Santos", status: "Cancelada" },
  { id: 13, produto: "E-book Reader", categoria: "Livros", preco: 400, quantidade: 3, total: 1200, data: "2024-01-27", vendedor: "Beatriz Costa", status: "Concluída" },
  { id: 14, produto: "Webcam HD", categoria: "Eletrônicos", preco: 250, quantidade: 6, total: 1500, data: "2024-01-28", vendedor: "Diego Oliveira", status: "Pendente" },
  { id: 15, produto: "Workshop Presencial", categoria: "Educação", preco: 500, quantidade: 8, total: 4000, data: "2024-01-29", vendedor: "Elena Ferreira", status: "Concluída" },
]

const exportarCSV = (dados: Venda[], nomeArquivo: string) => {
  const cabecalhos = ["ID", "Produto", "Categoria", "Preço", "Quantidade", "Total", "Data", "Vendedor", "Status"]
  
  const conteudoCSV = [
    cabecalhos.join(","),
    ...dados.map(linha => [
      linha.id,
      `"${linha.produto}"`,
      `"${linha.categoria}"`,
      linha.preco,
      linha.quantidade,
      linha.total,
      linha.data,
      `"${linha.vendedor}"`,
      `"${linha.status}"`
    ].join(","))
  ].join("\n")

  const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", nomeArquivo)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

function FiltroCategoria({ coluna }: { coluna: any }) {
  const categoriasUnicas = useMemo(() => {
    const categorias = dadosVendas.map(item => item.categoria)
    return Array.from(new Set(categorias))
  }, [])

  return (
    <select
      value={coluna.getFilterValue() ?? ""}
      onChange={e => coluna.setFilterValue(e.target.value || undefined)}
      className="select-filtro"
    >
      <option value="">Todas Categorias</option>
      {categoriasUnicas.map(categoria => (
        <option key={categoria} value={categoria}>
          {categoria}
        </option>
      ))}
    </select>
  )
}

function FiltroStatus({ coluna }: { coluna: any }) {
  const statusList = ["Concluída", "Pendente", "Cancelada"]

  return (
    <select
      value={coluna.getFilterValue() ?? ""}
      onChange={e => coluna.setFilterValue(e.target.value || undefined)}
      className="select-filtro"
    >
      <option value="">Todos Status</option>
      {statusList.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

function FiltroRangePreco({ coluna }: { coluna: any }) {
  const [min, max] = coluna.getFilterValue() ?? [0, 5000]

  return (
    <div className="filtro-preco">
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={e => coluna.setFilterValue([Number(e.target.value), max])}
        className="input-preco"
      />
      <span>-</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={e => coluna.setFilterValue([min, Number(e.target.value)])}
        className="input-preco"
      />
    </div>
  )
}

const colunas: ColumnDef<Venda>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Produto",
    accessorKey: "produto",
  },
  {
    header: "Categoria",
    accessorKey: "categoria",
    filterFn: "equals",
  },
  {
    header: "Preço",
    accessorKey: "preco",
    cell: ({ getValue }) => `R$ ${getValue().toLocaleString()}`,
    filterFn: (linha, colunaId, valorFiltro) => {
      const [min, max] = valorFiltro
      const valor = linha.getValue(colunaId) as number
      return valor >= min && valor <= max
    },
  },
  {
    header: "Quantidade",
    accessorKey: "quantidade",
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: ({ getValue }) => `R$ ${getValue().toLocaleString()}`,
  },
  {
    header: "Data",
    accessorKey: "data",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("pt-BR"),
  },
  {
    header: "Vendedor",
    accessorKey: "vendedor",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string
      const classeStatus = {
        "Concluída": "status-concluido",
        "Pendente": "status-pendente", 
        "Cancelada": "status-cancelado"
      }[status]
      return <span className={`badge-status ${classeStatus}`}>{status}</span>
    },
    filterFn: "equals",
  },
]

export default function TabelaAvancada() {
  // Estados para todas as funcionalidades da tabela
  const [ordenacao, definirOrdenacao] = useState<SortingState>([]) // Ordenação
  const [filtrosColunas, definirFiltrosColunas] = useState<ColumnFiltersState>([]) // Filtros por coluna
  const [filtroGlobal, definirFiltroGlobal] = useState("") // Busca geral
  const [paginacao, definirPaginacao] = useState({
    pageIndex: 0, // Página atual (começa em 0)
    pageSize: 8, // Itens por página
  })

  // Configuração completa da tabela com todas as funcionalidades
  const tabela = useReactTable({
    data: dadosVendas,
    columns: colunas,
    state: {
      sorting: ordenacao, // Estado da ordenação
      columnFilters: filtrosColunas, // Estado dos filtros por coluna
      globalFilter: filtroGlobal, // Estado da busca global
      pagination: paginacao, // Estado da paginação
    },
    // Funções chamadas quando os estados mudam
    onSortingChange: definirOrdenacao,
    onColumnFiltersChange: definirFiltrosColunas,
    onGlobalFilterChange: definirFiltroGlobal,
    onPaginationChange: definirPaginacao,
    // Modelos que habilitam as funcionalidades
    getCoreRowModel: getCoreRowModel(), // Modelo básico
    getFilteredRowModel: getFilteredRowModel(), // Habilita filtros
    getSortedRowModel: getSortedRowModel(), // Habilita ordenação
    getPaginationRowModel: getPaginationRowModel(), // Habilita paginação
    globalFilterFn: "includesString", // Tipo de busca global
  })

  const dadosFiltrados = tabela.getFilteredRowModel().rows.map(linha => linha.original)

  return (
    <div>
      <div className="controles-tabela">
        <input
          type="text"
          placeholder="🔍 Busca geral..."
          value={filtroGlobal ?? ""}
          onChange={e => definirFiltroGlobal(e.target.value)}
          className="input-busca"
        />
        
        <div className="controles-export">
          <button
            className="botao botao-primario"
            onClick={() => exportarCSV(dadosFiltrados, "vendas-filtradas.csv")}
          >
            📊 Exportar CSV ({dadosFiltrados.length} registros)
          </button>
          <button
            className="botao botao-secundario"
            onClick={() => exportarCSV(dadosVendas, "vendas-completas.csv")}
          >
            📋 Exportar Todos
          </button>
        </div>
      </div>

      <div className="filtros-colunas">
        <div className="grupo-filtro">
          <label>Categoria:</label>
          <FiltroCategoria coluna={tabela.getColumn("categoria")} />
        </div>
        
        <div className="grupo-filtro">
          <label>Status:</label>
          <FiltroStatus coluna={tabela.getColumn("status")} />
        </div>
        
        <div className="grupo-filtro">
          <label>Preço:</label>
          <FiltroRangePreco coluna={tabela.getColumn("preco")} />
        </div>

        <button
          className="botao botao-secundario"
          onClick={() => {
            definirFiltrosColunas([])
            definirFiltroGlobal("")
          }}
        >
          🗑️ Limpar Filtros
        </button>
      </div>

      <table className="tabela-moderna">
        <thead>
          {tabela.getHeaderGroups().map(grupoHeader => (
            <tr key={grupoHeader.id}>
              {grupoHeader.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tabela.getRowModel().rows.map(linha => (
            <tr key={linha.id}>
              {linha.getVisibleCells().map(celula => (
                <td key={celula.id}>
                  {flexRender(celula.column.columnDef.cell, celula.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="controles-paginacao">
        <button
          className="botao botao-secundario"
          onClick={() => tabela.setPageIndex(0)}
          disabled={!tabela.getCanPreviousPage()}
        >
          ⏮️
        </button>
        <button
          className="botao botao-secundario"
          onClick={() => tabela.previousPage()}
          disabled={!tabela.getCanPreviousPage()}
        >
          ⬅️
        </button>
        <button
          className="botao botao-secundario"
          onClick={() => tabela.nextPage()}
          disabled={!tabela.getCanNextPage()}
        >
          ➡️
        </button>
        <button
          className="botao botao-secundario"
          onClick={() => tabela.setPageIndex(tabela.getPageCount() - 1)}
          disabled={!tabela.getCanNextPage()}
        >
          ⏭️
        </button>

        <span className="info-paginacao">
          Página <strong>{tabela.getState().pagination.pageIndex + 1}</strong> de <strong>{tabela.getPageCount()}</strong>
        </span>

        <span className="info-paginacao">
          Mostrando <strong>{dadosFiltrados.length}</strong> de <strong>{dadosVendas.length}</strong> vendas
        </span>
      </div>
    </div>
  )
}