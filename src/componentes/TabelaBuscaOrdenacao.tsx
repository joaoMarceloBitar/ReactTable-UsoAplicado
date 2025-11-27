import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import "./estilos.css"

type Produto = {
  id: number
  nome: string
  preco: number
  estoque: number
}

const produtos: Produto[] = [
  { id: 1, nome: "Maçã", preco: 5, estoque: 120 },
  { id: 2, nome: "Banana", preco: 3, estoque: 80 },
  { id: 3, nome: "Morango", preco: 10, estoque: 40 },
  { id: 4, nome: "Abacate", preco: 7, estoque: 60 },
  { id: 5, nome: "Laranja", preco: 4, estoque: 95 },
  { id: 6, nome: "Uva", preco: 12, estoque: 35 },
  { id: 7, nome: "Manga", preco: 8, estoque: 50 },
  { id: 8, nome: "Kiwi", preco: 15, estoque: 25 },
  { id: 9, nome: "Abacaxi", preco: 9, estoque: 30 },
  { id: 10, nome: "Melão", preco: 6, estoque: 45 },
  { id: 11, nome: "Melancia", preco: 11, estoque: 20 },
  { id: 12, nome: "Pêssego", preco: 13, estoque: 28 },
]

const colunas: ColumnDef<Produto>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Produto",
    accessorKey: "nome",
  },
  {
    header: "Preço",
    accessorKey: "preco",
  },
  {
    header: "Estoque",
    accessorKey: "estoque",
  },
]

export default function TabelaBuscaOrdenacao() {
  const [filtroGlobal, definirFiltroGlobal] = useState("")
  const [ordenacao, definirOrdenacao] = useState<SortingState>([])

  const tabela = useReactTable({
    data: produtos,
    columns: colunas,
    state: {
      globalFilter: filtroGlobal,
      sorting: ordenacao,
    },
    onGlobalFilterChange: definirFiltroGlobal,
    onSortingChange: definirOrdenacao,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
  })

  const linhasFiltradas = tabela.getFilteredRowModel().rows
  
  return (
    <div>
      <input
        type="text"
        placeholder="🔍 Buscar produto..."
        value={filtroGlobal ?? ""}
        onChange={e => definirFiltroGlobal(e.target.value)}
        className="input-busca"
        style={{ marginBottom: "1rem" }}
      />
      
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Mostrando {linhasFiltradas.length} de {produtos.length} produtos
      </p>

      <table className="tabela-moderna">
        <thead>
          {tabela.getHeaderGroups().map(grupoHeader => (
            <tr key={grupoHeader.id}>
              {grupoHeader.headers.map(cabecalho => (
                <th
                  key={cabecalho.id}
                  onClick={cabecalho.column.getToggleSortingHandler()}
                >
                  {flexRender(cabecalho.column.columnDef.header, cabecalho.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[cabecalho.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {linhasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                Nenhum produto encontrado
              </td>
            </tr>
          ) : (
            linhasFiltradas.map(linha => (
              <tr key={linha.id}>
                {linha.getVisibleCells().map(celula => (
                  <td key={celula.id}>
                    {flexRender(celula.column.columnDef.cell, celula.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}