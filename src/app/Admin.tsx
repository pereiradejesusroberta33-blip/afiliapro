
import { useEffect, useState } from 'react'
import {
  PackagePlus,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

type Produto = {
  id: string
  name: string
  description: string | null
  price: number | null
  commission: number | null
  affiliate_url: string | null
}

type Solicitacao = {
  id: string
  status: string
  product_id: string
  user_id: string
}

export default function Admin() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [comissao, setComissao] = useState('')
  const [link, setLink] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  async function carregarDados() {
    const [produtosResult, solicitacoesResult] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('affiliate_applications').select('*').order('created_at', { ascending: false }),
    ])

    if (produtosResult.error || solicitacoesResult.error) {
      setMensagem('Erro ao carregar os dados administrativos.')
    } else {
      setProdutos(produtosResult.data ?? [])
      setSolicitacoes(solicitacoesResult.data ?? [])
    }

    setCarregando(false)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function cadastrarProduto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSalvando(true)
    setMensagem('')

    const { error } = await supabase.from('products').insert({
      name: nome,
      description: descricao,
      price: preco ? Number(preco) : null,
      commission: comissao ? Number(comissao) : 0,
      affiliate_url: link || null,
    })

    if (error) {
      setMensagem('Não foi possível cadastrar o produto.')
    } else {
      setNome('')
      setDescricao('')
      setPreco('')
      setComissao('')
      setLink('')
      setMensagem('Produto cadastrado com sucesso!')
      await carregarDados()
    }

    setSalvando(false)
  }

  async function excluirProduto(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      setMensagem('Não foi possível excluir o produto.')
    } else {
      setMensagem('Produto excluído.')
      await carregarDados()
    }
  }

  async function atualizarSolicitacao(
    id: string,
    status: 'approved' | 'rejected',
  ) {
    const { error } = await supabase
      .from('affiliate_applications')
      .update({ status })
      .eq('id', id)

    if (error) {
      setMensagem('Não foi possível atualizar a solicitação.')
    } else {
      setMensagem('Solicitação atualizada.')
      await carregarDados()
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Administração
        </h1>
        <p className="mt-2 text-gray-500">
          Gerencie os produtos e as solicitações do AfiliaPro.
        </p>
      </header>

      {mensagem && (
        <p className="mb-5 rounded-xl bg-violet-50 p-4 text-violet-800">
          {mensagem}
        </p>
      )}

      <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
          <PackagePlus className="text-violet-700" />
          Cadastrar produto
        </h2>

        <form onSubmit={cadastrarProduto} className="space-y-4">
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do produto"
            className="w-full rounded-xl border p-3"
          />

          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição do produto"
            className="w-full rounded-xl border p-3"
            rows={3}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Preço em R$"
              className="w-full rounded-xl border p-3"
            />

            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={comissao}
              onChange={(e) => setComissao(e.target.value)}
              placeholder="Comissão em %"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link de afiliado (opcional)"
            className="w-full rounded-xl border p-3"
          />

          <button
            disabled={salvando}
            className="rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Cadastrar produto'}
          </button>
        </form>
      </section>

      <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold">Produtos cadastrados</h2>

        {produtos.map((produto) => (
          <article
            key={produto.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b py-4"
          >
            <div>
              <h3 className="font-bold">{produto.name}</h3>
              <p className="text-sm text-gray-500">
                Comissão: {produto.commission ?? 0}%
              </p>
            </div>

            <button
              onClick={() => excluirProduto(produto.id)}
              className="rounded-lg bg-red-50 p-3 text-red-600"
              aria-label="Excluir produto"
            >
              <Trash2 size={20} />
            </button>
          </article>
        ))}

        {!carregando && produtos.length === 0 && (
          <p className="text-gray-500">Nenhum produto cadastrado.</p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
          <Users className="text-violet-700" />
          Solicitações de afiliação
        </h2>

        {solicitacoes.map((solicitacao) => (
          <article
            key={solicitacao.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b py-4"
          >
            <div>
              <p className="font-semibold">
                Solicitação de afiliado
              </p>
              <p className="text-sm text-gray-500">
                Produto: {solicitacao.product_id}
              </p>
              <p className="text-sm text-gray-500">
                Usuário: {solicitacao.user_id}
              </p>
              <p className="text-sm text-gray-500">
                Status: {solicitacao.status}
              </p>
            </div>

            {solicitacao.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    atualizarSolicitacao(solicitacao.id, 'approved')
                  }
                  className="rounded-lg bg-green-50 p-3 text-green-700"
                  aria-label="Aprovar solicitação"
                >
                  <CheckCircle size={20} />
                </button>

                <button
                  onClick={() =>
                    atualizarSolicitacao(solicitacao.id, 'rejected')
                  }
                  className="rounded-lg bg-red-50 p-3 text-red-600"
                  aria-label="Recusar solicitação"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}
          </article>
        ))}

        {!carregando && solicitacoes.length === 0 && (
          <p className="text-gray-500">
            Nenhuma solicitação recebida.
          </p>
        )}
      </section>
    </main>
  )
      }
      
