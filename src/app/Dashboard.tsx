
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Link as LinkIcon,
  User,
  LogOut,
  MousePointerClick,
  TrendingUp,
  Wallet,
  ClipboardList,
  Settings,
} from 'lucide-react'

import { supabase } from '../lib/supabase'
import Products from './Products'
import MyLinks from './MyLinks'
import Applications from './Applications'
import Admin from './Admin'

type Pagina =
  | 'inicio'
  | 'produtos'
  | 'links'
  | 'solicitacoes'
  | 'admin'

export default function Dashboard() {
  const [pagina, setPagina] = useState<Pagina>('inicio')
  const [admin, setAdmin] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function verificarPerfil() {
      const { data: usuarioData } = await supabase.auth.getUser()

      if (!usuarioData.user) {
        setCarregando(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', usuarioData.user.id)
        .single()

      if (!error && data?.role === 'admin') {
        setAdmin(true)
      }

      setCarregando(false)
    }

    verificarPerfil()
  }, [])

  async function sair() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert('Não foi possível sair. Tente novamente.')
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando AfiliaPro...
      </div>
    )
  }

  function menu(
    nome: Pagina,
    texto: string,
    Icone: typeof LayoutDashboard,
  ) {
    return (
      <button
        type="button"
        onClick={() => setPagina(nome)}
        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${
          pagina === nome
            ? 'bg-white/15'
            : 'hover:bg-white/10'
        }`}
      >
        <Icone size={20} />
        {texto}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <aside className="bg-violet-800 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <h1 className="mb-6 text-2xl font-bold">AfiliaPro</h1>

        <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col">
          {menu('inicio', 'Painel inicial', LayoutDashboard)}
          {menu('produtos', 'Produtos', ShoppingBag)}
          {menu('links', 'Meus links', LinkIcon)}
          {menu('solicitacoes', 'Solicitações', ClipboardList)}

          {admin && menu('admin', 'Administração', Settings)}
        </nav>

        <button
          type="button"
          onClick={sair}
          className="mt-5 flex w-full items-center gap-3 rounded-xl p-3 hover:bg-white/10"
        >
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">
        {pagina === 'inicio' && (
          <>
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Painel inicial
              </h2>
              <p className="mt-1 text-gray-500">
                Bem-vindo ao AfiliaPro!
              </p>
            </header>

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <MousePointerClick className="mb-4 text-violet-700" size={28} />
                <p className="text-sm text-gray-500">Cliques nos links</p>
                <h3 className="mt-2 text-3xl font-bold">0</h3>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <ShoppingBag className="mb-4 text-violet-700" size={28} />
                <p className="text-sm text-gray-500">Produtos afiliados</p>
                <h3 className="mt-2 text-3xl font-bold">0</h3>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <TrendingUp className="mb-4 text-violet-700" size={28} />
                <p className="text-sm text-gray-500">Vendas registradas</p>
                <h3 className="mt-2 text-3xl font-bold">0</h3>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <Wallet className="mb-4 text-violet-700" size={28} />
                <p className="text-sm text-gray-500">Comissões registradas</p>
                <h3 className="mt-2 text-3xl font-bold">R$ 0,00</h3>
              </div>
            </section>

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Comece a divulgar
              </h3>
              <p className="mt-2 text-gray-600">
                Explore os produtos disponíveis e organize seus links de afiliado em um só lugar.
              </p>
            </section>
          </>
        )}

        {pagina === 'produtos' && <Products />}
        {pagina === 'links' && <MyLinks />}
        {pagina === 'solicitacoes' && <Applications />}

        {pagina === 'admin' && admin && <Admin />}

        {pagina === 'admin' && !admin && (
          <p className="rounded-xl bg-white p-6 text-red-600">
            Você não tem permissão para acessar esta área.
          </p>
        )}
      </main>
    </div>
  )
                }
