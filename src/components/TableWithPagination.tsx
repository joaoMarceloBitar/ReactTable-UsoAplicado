import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import "./styles.css"

//--------------------------------------------------------------
// 1. Tipo dos dados - mais produtos para demonstrar paginação
//--------------------------------------------------------------
type Product = {
  id: number
  name: string
  price: number
  stock: number
  category: string
}

//--------------------------------------------------------------
// 2. Dados expandidos para demonstrar paginação
//--------------------------------------------------------------
const products: Product[] = [
  // Frutas
  { id: 1, name: "Maçã", price: 5, stock: 120, category: "Frutas" },
  { id: 2, name: "Banana", price: 3, stock: 80, category: "Frutas" },
  { id: 3, name: "Morango", price: 10, stock: 40, category: "Frutas" },
  { id: 4, name: "Abacate", price: 7, stock: 60, category: "Frutas" },
  { id: 5, name: "Laranja", price: 4, stock: 95, category: "Frutas" },
  { id: 6, name: "Uva", price: 12, stock: 35, category: "Frutas" },
  { id: 7, name: "Manga", price: 8, stock: 50, category: "Frutas" },
  { id: 8, name: "Kiwi", price: 15, stock: 25, category: "Frutas" },
  
  // Grãos
  { id: 9, name: "Arroz Branco", price: 15, stock: 200, category: "Grãos" },
  { id: 10, name: "Feijão Preto", price: 12, stock: 150, category: "Grãos" },
  { id: 11, name: "Lentilha", price: 18, stock: 80, category: "Grãos" },
  { id: 12, name: "Grão de Bico", price: 20, stock: 65, category: "Grãos" },
  { id: 13, name: "Quinoa", price: 35, stock: 40, category: "Grãos" },
  
  // Laticínios
  { id: 14, name: "Leite Integral", price: 8, stock: 90, category: "Laticínios" },
  { id: 15, name: "Queijo Mussarela", price: 25, stock: 45, category: "Laticínios" },
  { id: 16, name: "Iogurte Natural", price: 12, stock: 70, category: "Laticínios" },
  { id: 17, name: "Manteiga", price: 16, stock: 55, category: "Laticínios" },
  { id: 18, name: "Cream Cheese", price: 22, stock: 30, category: "Laticínios" },
  
  // Padaria
  { id: 19, name: "Pão Francês", price: 6, stock: 75, category: "Padaria" },
  { id: 20, name: "Bolo de Chocolate", price: 20, stock: 30, category: "Padaria" },
  { id: 21, name: "Croissant", price: 8, stock: 25, category: "Padaria" },
  { id: 22, name: "Biscoito Integral", price: 14, stock: 40, category: "Padaria" },
  { id: 23, name: "Torrada", price: 10, stock: 35, category: "Padaria" },
  
  // Carnes
  { id: 24, name: "Carne Bovina", price: 35, stock: 25, category: "Carnes" },
  { id: 25, name: "Frango", price: 18, stock: 55, category: "Carnes" },
  { id: 26, name: "Peixe Salmão", price: 45, stock: 20, category: "Carnes" },
  { id: 27, name: "Carne Suína", price: 28, stock: 30, category: "Carnes" },
  { id: 28, name: "Linguiça", price: 22, stock: 40, category: "Carnes" },
  
  // Bebidas
  { id: 29, name: "Água Mineral", price: 3, stock: 200, category: "Bebidas" },
  { id: 30, name: "Suco de Laranja", price: 9, stock: 60, category: "Bebidas" },
  { id: 31, name: "Refrigerante Cola", price: 7, stock: 85, category: "Bebidas" },
  { id: 32, name: "Chá Verde", price: 12, stock: 45, category: "Bebidas" },
  { id: 33, name: "Café Torrado", price: 25, stock: 35, category: "Bebidas" },
]

//--------------------------------------------------------------
// 3. Definição das colunas com nova coluna categoria
//--------------------------------------------------------------
const columns: ColumnDef<Product>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Produto",
    accessorKey: "name",
  },
  {
    header: "Categoria",
    accessorKey: "category",
  },
  {
    header: "Preço",
    accessorKey: "price",
    cell: ({ getValue }) => `R$ ${getValue()}`,
  },
  {
    header: "Estoque",
    accessorKey: "stock",
  },
]

//--------------------------------------------------------------
// 4. Componente com paginação
//--------------------------------------------------------------
export default function TableWithPagination() {
  // estados existentes
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  
  // novo estado para paginação
  const [pagination, setPagination] = useState({
    pageIndex: 0,    // página atual (começa em 0)
    pageSize: 5,     // itens por página
  })

  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,  // adicionar estado de paginação
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,  // handler para paginação
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),  // modelo de paginação
    globalFilterFn: "includesString",
  })

  return (
    <div>
      <input
        type="text"
        placeholder="🔍 Buscar produto..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
        className="search-input"
        style={{ marginBottom: "1rem" }}
      />

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

        <select
          className="page-size-selector"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize} por página
            </option>
          ))}
        </select>

        <span className="pagination-info">
          Total: <strong>{table.getFilteredRowModel().rows.length}</strong> produtos
        </span>
      </div>
    </div>
  )
}