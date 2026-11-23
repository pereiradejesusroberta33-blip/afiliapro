
import { useEffect, useState } from 'react'
import { Link as LinkIcon, Plus, ExternalLink, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

type MeuLink = {
  id: string
  title: string
  affiliate_url: string
  clicks: number
  created_at: string
}

export default function MyLinks() {
  const [links, setLinks] = useState<MeuLink[]>([])
  const [titulo, setTitulo] = useState('')
  const [url, setUrl] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function carregarLinks() {
    const { data, error } = await supabase
      .from('affiliate_links')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setMensagem('Não foi possível carregar seus links.')
    } else {
      setLinks(data ?? [])
    }

    setCarregando(false)
  }

  useEffect(() => {
    carregarLinks()
  }, [])

  async function adicionarLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSalvando(true)
    setMensagem('')

    const { data: usuarioData } = await supabase.auth.getUser()
    const usuario = usuarioData.user

    if (!usuario) {
      setMensagem('Faça login novamente para continuar.')
      setSalvando(false)
      return
    }

    const { error } = await supabase.from('affiliate_links').insert({
      user_id: usuario.id,
      title: titulo,
      affiliate_url: url,
    })

    if (error) {
      setMensagem('Não foi possível cadastrar o link.')
    } else {
      setTitulo('')
      setUrl('')
      setMensagem('Link cadastrado com sucesso!')
      await carregarLinks()
    }

    setSalvando(false)
  }

  async function excluirLink(id: string) {
    const { error } = await supabase
      .from('affiliate_links')
      .delete()
      .eq('id', id)

    if (error) {
      setMensagem('Não foi possível excluir o link.')
    } else {
      setLinks((anteriores) =>
        anteriores.filter((link) => link.id !== id),
      )
      setMensagem('Link excluído com sucesso!')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meus links</h1>
        <p className="mt-2 text-gray-500">
          Organize seus links de afiliado em um só lugar.
        </p>
      </header>

      <form
        onSubmit={adicionarLink}
        className="mb-8 space-y-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold">Adicionar novo link</h2>

        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nome do produto"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
        />

        <input
          required
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://seulinkdeafiliado.com"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-600"
        />

        <button
          disabled={salvando}
          className="flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          <Plus size={20} />
          {salvando ? 'Salvando...' : 'Adicionar link'}
        </button>
      </form>

      {mensagem && (
        <p className="mb-5 rounded-xl bg-violet-50 p-4 text-violet-800">
          {mensagem}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          Links cadastrados
        </h2>

        {carregando && <p>Carregando links...</p>}

        {!carregando && links.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500">
            <LinkIcon className="mx-auto mb-3" size={36} />
            Você ainda não cadastrou nenhum link.
          </div>
        )}

        {links.map((link) => (
          <article
            key={link.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900">{link.title}</h3>
              <a
                href={link.affiliate_url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-sm text-violet-700"
              >
                {link.affiliate_url}
              </a>
              <p className="mt-2 text-sm text-gray-500">
                {link.clicks} cliques registrados
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={link.affiliate_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-violet-50 p-3 text-violet-700"
                aria-label="Abrir link"
              >
                <ExternalLink size={20} />
              </a>

              <button
                onClick={() => excluirLink(link.id)}
                className="rounded-lg bg-red-50 p-3 text-red-600"
                aria-label="Excluir link"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
          }
      
