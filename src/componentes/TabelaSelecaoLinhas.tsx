import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import "./estilos.css"

type Funcionario = {
  id: number
  nome: string
  cargo: string
  salario: number
  departamento: string
}

const funcionarios: Funcionario[] = [
  { id: 1, nome: "Ana Silva", cargo: "Desenvolvedora Senior", salario: 8000, departamento: "TI" },
  { id: 2, nome: "Carlos Santos", cargo: "Designer UX/UI", salario: 6500, departamento: "Marketing" },
  { id: 3, nome: "Beatriz Costa", cargo: "Gerente de Vendas", salario: 12000, departamento: "Vendas" },
  { id: 4, nome: "Diego Oliveira", cargo: "Analista de RH", salario: 5500, departamento: "RH" },
  { id: 5, nome: "Elena Ferreira", cargo: "Coordenadora de TI", salario: 9500, departamento: "TI" },
  { id: 6, nome: "Fernando Lima", cargo: "Desenvolvedor Junior", salario: 4500, departamento: "TI" },
  { id: 7, nome: "Gabriela Rocha", cargo: "Analista de Marketing", salario: 5800, departamento: "Marketing" },
  { id: 8, nome: "Hugo Mendes", cargo: "Vendedor", salario: 4200, departamento: "Vendas" },
  { id: 9, nome: "Isabela Torres", cargo: "Gerente de RH", salario: 11000, departamento: "RH" },
  { id: 10, nome: "João Pereira", cargo: "Arquiteto de Software", salario: 15000, departamento: "TI" },
  { id: 11, nome: "Larissa Alves", cargo: "Social Media", salario: 4800, departamento: "Marketing" },
  { id: 12, nome: "Marcos Barbosa", cargo: "Supervisor de Vendas", salario: 7500, departamento: "Vendas" },
  { id: 13, nome: "Natália Cardoso", cargo: "Recrutadora", salario: 5200, departamento: "RH" },
  { id: 14, nome: "Otávio Gomes", cargo: "DevOps Engineer", salario: 10500, departamento: "TI" },
  { id: 15, nome: "Patrícia Dias", cargo: "Gerente de Marketing", salario: 13500, departamento: "Marketing" },
]

const colunas: ColumnDef<Funcionario>[] = [
  {
    id: "selecionar",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="checkbox-personalizado"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="checkbox-personalizado"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Nome",
    accessorKey: "nome",
  },
  {
    header: "Cargo",
    accessorKey: "cargo",
  },
  {
    header: "Salário",
    accessorKey: "salario",
    cell: ({ getValue }) => `R$ ${getValue().toLocaleString()}`,
  },
  {
    header: "Departamento",
    accessorKey: "departamento",
  },
]

export default function TabelaSelecaoLinhas() {
  // Estado para controlar quais linhas estão selecionadas
  const [selecaoLinhas, definirSelecaoLinhas] = useState<RowSelectionState>({})

  const tabela = useReactTable({
    data: funcionarios,
    columns: colunas,
    state: {
      rowSelection: selecaoLinhas, // Passa seleção para a tabela
    },
    onRowSelectionChange: definirSelecaoLinhas, // Função chamada quando seleção muda
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true, // Habilita seleção de linhas
  })

  // Função para obter os dados dos funcionários selecionados
  const obterFuncionariosSelecionados = () => {
    return tabela.getSelectedRowModel().rows.map(linha => linha.original)
  }

  // Função para calcular salário total dos selecionados
  const obterSalarioTotal = () => {
    return obterFuncionariosSelecionados().reduce((total, func) => total + func.salario, 0)
  }

  return (
    <div>
      {tabela.getSelectedRowModel().rows.length > 0 && (
        <div className="info-selecao">
          <h3>📊 Resumo da Seleção</h3>
          <p><strong>Selecionados:</strong> {tabela.getSelectedRowModel().rows.length} funcionários</p>
          <p><strong>Salário Total:</strong> R$ {obterSalarioTotal().toLocaleString()}</p>
        </div>
      )}

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          className="botao botao-secundario"
          onClick={() => definirSelecaoLinhas({})}
        >
          🗑️ Limpar Seleção
        </button>
        <button
          className="botao botao-primario"
          onClick={() => {
            const selecionados = obterFuncionariosSelecionados()
            alert(`Funcionários selecionados:\n${selecionados.map(func => func.nome).join('\n')}`)
          }}
          disabled={tabela.getSelectedRowModel().rows.length === 0}
        >
          📄 Mostrar Selecionados
        </button>
      </div>

      <table className="tabela-moderna">
        <thead>
          {tabela.getHeaderGroups().map(grupoHeader => (
            <tr key={grupoHeader.id}>
              {grupoHeader.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tabela.getRowModel().rows.map(linha => (
            <tr 
              key={linha.id}
              className={linha.getIsSelected() ? "linha-selecionada" : ""}
            >
              {linha.getVisibleCells().map(celula => (
                <td key={celula.id}>
                  {flexRender(celula.column.columnDef.cell, celula.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {tabela.getSelectedRowModel().rows.length > 0 && (
        <div className="lista-selecionados">
          <h3>👥 Funcionários Selecionados</h3>
          <ul>
            {obterFuncionariosSelecionados().map(func => (
              <li key={func.id}>
                <strong>{func.nome}</strong> - {func.cargo} - R$ {func.salario.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}