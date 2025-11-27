import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import "./estilos.css"

type Usuario = {
  id: number
  nome: string
  idade: number
  email: string
}

const dados: Usuario[] = [
  { id: 1, nome: "João Silva", idade: 22, email: "joao.silva@email.com" },
  { id: 2, nome: "Maria Santos", idade: 19, email: "maria.santos@email.com" },
  { id: 3, nome: "Pedro Costa", idade: 30, email: "pedro.costa@email.com" },
  { id: 4, nome: "Ana Oliveira", idade: 25, email: "ana.oliveira@email.com" },
  { id: 5, nome: "Carlos Ferreira", idade: 28, email: "carlos.ferreira@email.com" },
  { id: 6, nome: "Beatriz Lima", idade: 24, email: "beatriz.lima@email.com" },
  { id: 7, nome: "Rafael Souza", idade: 32, email: "rafael.souza@email.com" },
  { id: 8, nome: "Juliana Rocha", idade: 27, email: "juliana.rocha@email.com" },
]

const colunas: ColumnDef<Usuario>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nome",
    accessorKey: "nome",
  },
  {
    header: "Idade",
    accessorKey: "idade",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
]

export default function TabelaBasica() {
  const tabela = useReactTable({
    data: dados,
    columns: colunas,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="tabela-moderna">
      <thead>
        {tabela.getHeaderGroups().map(grupoHeader => (
          <tr key={grupoHeader.id}>
            {grupoHeader.headers.map(cabecalho => (
              <th key={cabecalho.id}>
                {flexRender(cabecalho.column.columnDef.header, cabecalho.getContext())}
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
  )
}