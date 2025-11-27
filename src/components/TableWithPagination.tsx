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
  { id: 1, name: "Maçã", price: 5, stock: 120, category: "Frutas" },
  { id: 2, name: "Banana", price: 3, stock: 80, category: "Frutas" },
  { id: 3, name: "Morango", price: 10, stock: 40, category: "Frutas" },
  { id: 4, name: "Abacate", price: 7, stock: 60, category: "Frutas" },
  { id: 5, name: "Arroz", price: 15, stock: 200, category: "Grãos" },
  { id: 6, name: "Feijão", price: 12, stock: 150, category: "Grãos" },
  { id: 7, name: "Leite", price: 8, stock: 90, category: "Laticínios" },
  { id: 8, name: "Queijo", price: 25, stock: 45, category: "Laticínios" },
  { id: 9, name: "Pão", price: 6, stock: 75, category: "Padaria" },
  { id: 10, name: "Bolo", price: 20, stock: 30, category: "Padaria" },
  { id: 11, name: "Carne", price: 35, stock: 25, category: "Carnes" },
  { id: 12, name: "Frango", price: 18, stock: 55, category: "Carnes" },
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
    <div style={{ padding: 20 }}>
      <h2>Tabela com Paginação</h2>
      
      {/* Input de busca */}
      <input
        type="text"
        placeholder="Buscar produto..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
        style={{ marginBottom: 15, padding: 8, width: "300px" }}
      />

      {/* Tabela */}
      <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* Indicadores de sorting */}
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

      {/* Controles de Paginação */}
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>

        <span style={{ marginLeft: 20 }}>
          Página{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </strong>
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          style={{ marginLeft: 20, padding: 5 }}
        >
          {[5, 10, 20].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>

        <span style={{ marginLeft: 20 }}>
          Total: {table.getFilteredRowModel().rows.length} produtos
        </span>
      </div>
    </div>
  )
}