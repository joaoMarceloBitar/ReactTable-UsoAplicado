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
import "./styles.css"

//--------------------------------------------------------------
// 1. Tipo dos dados
//--------------------------------------------------------------
type Sale = {
  id: number
  product: string
  category: string
  price: number
  quantity: number
  total: number
  date: string
  seller: string
  status: string
}

//--------------------------------------------------------------
// 2. Dados de vendas
//--------------------------------------------------------------
const salesData: Sale[] = [
  { id: 1, product: "Notebook Dell", category: "Eletrônicos", price: 2500, quantity: 2, total: 5000, date: "2024-01-15", seller: "Ana Silva", status: "Concluída" },
  { id: 2, product: "Mouse Gamer", category: "Eletrônicos", price: 150, quantity: 5, total: 750, date: "2024-01-16", seller: "Carlos Santos", status: "Pendente" },
  { id: 3, product: "Cadeira Ergonômica", category: "Móveis", price: 800, quantity: 1, total: 800, date: "2024-01-17", seller: "Beatriz Costa", status: "Concluída" },
  { id: 4, product: "Smartphone Samsung", category: "Eletrônicos", price: 1200, quantity: 3, total: 3600, date: "2024-01-18", seller: "Diego Oliveira", status: "Cancelada" },
  { id: 5, product: "Mesa de Escritório", category: "Móveis", price: 600, quantity: 2, total: 1200, date: "2024-01-19", seller: "Elena Ferreira", status: "Concluída" },
  { id: 6, product: "Fone Bluetooth", category: "Eletrônicos", price: 200, quantity: 4, total: 800, date: "2024-01-20", seller: "Ana Silva", status: "Pendente" },
  { id: 7, product: "Livro Técnico", category: "Livros", price: 80, quantity: 10, total: 800, date: "2024-01-21", seller: "Carlos Santos", status: "Concluída" },
  { id: 8, product: "Monitor 4K", category: "Eletrônicos", price: 1800, quantity: 1, total: 1800, date: "2024-01-22", seller: "Beatriz Costa", status: "Concluída" },
  { id: 9, product: "Estante de Livros", category: "Móveis", price: 400, quantity: 2, total: 800, date: "2024-01-23", seller: "Diego Oliveira", status: "Pendente" },
  { id: 10, product: "Curso Online", category: "Educação", price: 300, quantity: 5, total: 1500, date: "2024-01-24", seller: "Elena Ferreira", status: "Concluída" },
  { id: 11, product: "Tablet iPad", category: "Eletrônicos", price: 2000, quantity: 1, total: 2000, date: "2024-01-25", seller: "Ana Silva", status: "Concluída" },
  { id: 12, product: "Poltrona Reclinável", category: "Móveis", price: 1200, quantity: 1, total: 1200, date: "2024-01-26", seller: "Carlos Santos", status: "Cancelada" },
  { id: 13, product: "E-book Reader", category: "Livros", price: 400, quantity: 3, total: 1200, date: "2024-01-27", seller: "Beatriz Costa", status: "Concluída" },
  { id: 14, product: "Webcam HD", category: "Eletrônicos", price: 250, quantity: 6, total: 1500, date: "2024-01-28", seller: "Diego Oliveira", status: "Pendente" },
  { id: 15, product: "Workshop Presencial", category: "Educação", price: 500, quantity: 8, total: 4000, date: "2024-01-29", seller: "Elena Ferreira", status: "Concluída" },
]

//--------------------------------------------------------------
// 3. Função para exportar CSV
//--------------------------------------------------------------
const exportToCSV = (data: Sale[], filename: string) => {
  const headers = ["ID", "Produto", "Categoria", "Preço", "Quantidade", "Total", "Data", "Vendedor", "Status"]
  
  const csvContent = [
    headers.join(","),
    ...data.map(row => [
      row.id,
      `"${row.product}"`,
      `"${row.category}"`,
      row.price,
      row.quantity,
      row.total,
      row.date,
      `"${row.seller}"`,
      `"${row.status}"`
    ].join(","))
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

//--------------------------------------------------------------
// 4. Componente de filtro por categoria
//--------------------------------------------------------------
function CategoryFilter({ column }: { column: any }) {
  const uniqueCategories = useMemo(() => {
    const categories = salesData.map(item => item.category)
    return Array.from(new Set(categories))
  }, [])

  return (
    <select
      value={column.getFilterValue() ?? ""}
      onChange={e => column.setFilterValue(e.target.value || undefined)}
      className="filter-select"
    >
      <option value="">Todas Categorias</option>
      {uniqueCategories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}

//--------------------------------------------------------------
// 5. Componente de filtro por status
//--------------------------------------------------------------
function StatusFilter({ column }: { column: any }) {
  const statuses = ["Concluída", "Pendente", "Cancelada"]

  return (
    <select
      value={column.getFilterValue() ?? ""}
      onChange={e => column.setFilterValue(e.target.value || undefined)}
      className="filter-select"
    >
      <option value="">Todos Status</option>
      {statuses.map(status => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

//--------------------------------------------------------------
// 6. Componente de filtro por range de preço
//--------------------------------------------------------------
function PriceRangeFilter({ column }: { column: any }) {
  const [min, max] = column.getFilterValue() ?? [0, 5000]

  return (
    <div className="price-filter">
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={e => column.setFilterValue([Number(e.target.value), max])}
        className="price-input"
      />
      <span>-</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={e => column.setFilterValue([min, Number(e.target.value)])}
        className="price-input"
      />
    </div>
  )
}

//--------------------------------------------------------------
// 7. Definição das colunas com filtros
//--------------------------------------------------------------
const columns: ColumnDef<Sale>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Produto",
    accessorKey: "product",
  },
  {
    header: "Categoria",
    accessorKey: "category",
    filterFn: "equals",
  },
  {
    header: "Preço",
    accessorKey: "price",
    cell: ({ getValue }) => `R$ ${getValue().toLocaleString()}`,
    filterFn: (row, columnId, filterValue) => {
      const [min, max] = filterValue
      const value = row.getValue(columnId) as number
      return value >= min && value <= max
    },
  },
  {
    header: "Quantidade",
    accessorKey: "quantity",
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: ({ getValue }) => `R$ ${getValue().toLocaleString()}`,
  },
  {
    header: "Data",
    accessorKey: "date",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString("pt-BR"),
  },
  {
    header: "Vendedor",
    accessorKey: "seller",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string
      const statusClass = {
        "Concluída": "status-completed",
        "Pendente": "status-pending", 
        "Cancelada": "status-cancelled"
      }[status]
      return <span className={`status-badge ${statusClass}`}>{status}</span>
    },
    filterFn: "equals",
  },
]

//--------------------------------------------------------------
// 8. Componente principal
//--------------------------------------------------------------
export default function TableAdvanced() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  })

  const table = useReactTable({
    data: salesData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  })

  const filteredData = table.getFilteredRowModel().rows.map(row => row.original)

  return (
    <div>
      {/* Controles superiores */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="🔍 Busca geral..."
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          className="search-input"
        />
        
        <div className="export-controls">
          <button
            className="btn btn-primary"
            onClick={() => exportToCSV(filteredData, "vendas-filtradas.csv")}
          >
            📊 Exportar CSV ({filteredData.length} registros)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => exportToCSV(salesData, "vendas-completas.csv")}
          >
            📋 Exportar Todos
          </button>
        </div>
      </div>

      {/* Filtros por coluna */}
      <div className="column-filters">
        <div className="filter-group">
          <label>Categoria:</label>
          <CategoryFilter column={table.getColumn("category")} />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <StatusFilter column={table.getColumn("status")} />
        </div>
        
        <div className="filter-group">
          <label>Preço:</label>
          <PriceRangeFilter column={table.getColumn("price")} />
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setColumnFilters([])
            setGlobalFilter("")
          }}
        >
          🗑️ Limpar Filtros
        </button>
      </div>

      {/* Tabela */}
      <table className="modern-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="pagination-controls">
        <button
          className="btn btn-secondary"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          ⏮️
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ⬅️
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          ➡️
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          ⏭️
        </button>

        <span className="pagination-info">
          Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de <strong>{table.getPageCount()}</strong>
        </span>

        <span className="pagination-info">
          Mostrando <strong>{filteredData.length}</strong> de <strong>{salesData.length}</strong> vendas
        </span>
      </div>
    </div>
  )
}