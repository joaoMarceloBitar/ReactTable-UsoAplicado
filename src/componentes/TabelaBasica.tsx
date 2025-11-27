import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import "./estilos.css"

// Definindo o tipo de dados que a tabela vai exibir
type Usuario = {
  id: number
  nome: string
  idade: number
  email: string
}

// Array com os dados dos usuários (normalmente viria de uma API)
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

// Configuração das colunas da tabela
const colunas: ColumnDef<Usuario>[] = [
  {
    header: "ID", // Título que aparece no cabeçalho
    accessorKey: "id", // Campo do objeto Usuario que será exibido
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
  // Criando a instância da tabela com configurações básicas
  const tabela = useReactTable({
    data: dados, // Os dados que serão exibidos
    columns: colunas, // Configuração das colunas
    getCoreRowModel: getCoreRowModel(), // Modelo básico obrigatório
  })

  return (
    <table className="tabela-moderna">
      {/* Cabeçalho da tabela */}
      <thead>
        {tabela.getHeaderGroups().map(grupoHeader => (
          <tr key={grupoHeader.id}>
            {grupoHeader.headers.map(cabecalho => (
              <th key={cabecalho.id}>
                {/* flexRender renderiza o conteúdo do cabeçalho */}
                {flexRender(cabecalho.column.columnDef.header, cabecalho.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Corpo da tabela com os dados */}
      <tbody>
        {tabela.getRowModel().rows.map(linha => (
          <tr key={linha.id}>
            {linha.getVisibleCells().map(celula => (
              <td key={celula.id}>
                {/* flexRender renderiza o conteúdo da célula */}
                {flexRender(celula.column.columnDef.cell, celula.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}