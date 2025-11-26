import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"

import type { ColumnDef, SortingState } from "@tanstack/react-table"

//--------------------------------------------------------------
// 1. Tipo dos dados
//--------------------------------------------------------------
type Product = {
  id: number
  name: string
  price: number
  stock: number
}

//--------------------------------------------------------------
// 2. Dados de exemplo
//--------------------------------------------------------------
const products: Product[] = [
  { id: 1, name: "Maçã", price: 5, stock: 120 },
  { id: 2, name: "Banana", price: 3, stock: 80 },
  { id: 3, name: "Morango", price: 10, stock: 40 },
  { id: 4, name: "Abacate", price: 7, stock: 60 },
]

//--------------------------------------------------------------
// 3. Definição das colunas
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
    header: "Preço",
    accessorKey: "price",
  },
  {
    header: "Estoque",
    accessorKey: "stock",
  },
]

//--------------------------------------------------------------
// 4. Componente avançado com search + sorting
//--------------------------------------------------------------
export default function TableSortSearch() {
  // estado do filtro global
  const [globalFilter, setGlobalFilter] = useState("")

  // estado de ordenação
const [sorting, setSorting] = useState<SortingState>([])
  //----------------------------------------------------------
  // criação da tabela com funcionalidades adicionais:
  //
  // ✔ globalFilter (busca geral)
  // ✔ sorting (ordenar colunas)
  // ✔ filteredRowModel (filtrar linha)
  // ✔ sortedRowModel (ordenar linha)
  //----------------------------------------------------------
  const table = useReactTable({
    data: products,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),         // render básico
    getFilteredRowModel: getFilteredRowModel(), // habilita search
    getSortedRowModel: getSortedRowModel(),     // habilita sort
    globalFilterFn: "includesString",           // modo de busca (string)
  })

  return (
    <div style={{ padding: 20 }}>
      {/*--------------------------------------------------------
          Input para Search Global
      --------------------------------------------------------*/}
      <input
        type="text"
        placeholder="Buscar produto..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
        style={{ marginBottom: 15, padding: 6, width: "300px" }}
      />

      <table border={5} cellPadding={13}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: "pointer" }}
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
    </div>
  )
}
