
import { useEffect, useState } from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Produto = {
  id: string
  name: string
  description: string | null
  commission: number | null
}

type Solicitacao = {
  id: string
  product_id: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function Applications() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState<string | null>(null)

  async function carregarDados() {
    const [produtosResult, solicitacoesResult] = await Promise.all([
      supabase.from('products').select('id, name, description, commission'),
      supabase.from('affiliate_applications').select('*'),
    ])

    if (produtosResult.error || solicitacoesResult.error) {
      setMensagem('Não foi possível carregar os dados.')
    } else {
      setProdutos(produtosResult.data ?? [])
      setSolicitacoes(solicitacoesResult.data ?? [])
    }

    setCarregando(false)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function solicitar(produtoId: string) {
    setEnviando(produtoId)
    setMensagem('')

    const { data: usuarioData } = await supabase.auth.getUser()

    if (!usuarioData.user) {
      setMensagem('Faça login novamente para continuar.')
      setEnviando(null)
      return
    }

    const { error } = await supabase
      .from('affiliate_applications')
      .insert({
        user_id: usuarioData.user.id,
        product_id: produtoId,
      })

    if (error) {
      setMensagem(
        error.code === '23505'
          ? 'Você já solicitou afiliação a este produto.'
          : 'Não foi possível enviar sua solicitação.',
      )
    } else {
      setMensagem('Solicitação enviada com sucesso!')
      await carregarDados()
    }

    setEnviando(null)
  }

  const statusTexto = {
    pending: 'Aguardando aprovação',
    approved: 'Aprovada',
    rejected: 'Recusada',
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Minhas afiliações
        </h1>
        <p className="mt-2 text-gray-500">
          Solicite autorização para divulgar os produtos.
        </p>
      </header>

      {mensagem && (
        <p className="mb-5 rounded-xl bg-violet-50 p-4 text-violet-800">
          {mensagem}
        </p>
      )}

      {carregando && <p>Carregando produtos...</p>}

      {!carregando && produtos.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
          Nenhum produto disponível no momento.
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        {produtos.map((produto) => {
          const solicitacao = solicitacoes.find(
            (item) => item.product_id === produto.id,
          )

          return (
            <article
              key={produto.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {produto.name}
              </h2>

              <p className="mt-2 text-gray-500">
                {produto.description || 'Sem descrição disponível.'}
              </p>

              <p className="mt-4 font-semibold text-green-600">
                Comissão: {produto.commission ?? 0}%
              </p>

              {solicitacao ? (
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                  {solicitacao.status === 'approved' ? (
                    <CheckCircle className="text-green-600" />
                  ) : solicitacao.status === 'rejected' ? (
                    <XCircle className="text-red-600" />
                  ) : (
                    <Clock className="text-orange-500" />
                  )}

                  <span className="text-sm font-medium">
                    {statusTexto[solicitacao.status]}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => solicitar(produto.id)}
                  disabled={enviando === produto.id}
                  className="mt-5 w-full rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {enviando === produto.id
                    ? 'Enviando...'
                    : 'Solicitar afiliação'}
                </button>
              )}
            </article>
          )
        })}
      </section>
    </main>
  )
                }
