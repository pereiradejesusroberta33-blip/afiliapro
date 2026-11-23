
import {
  LayoutDashboard,
  ShoppingBag,
  Link as LinkIcon,
  User,
  LogOut,
  MousePointerClick,
  TrendingUp,
  Wallet,
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="hidden min-h-screen w-64 bg-violet-800 p-6 text-white md:fixed md:block">
        <h1 className="mb-10 text-2xl font-bold">AfiliaPro</h1>

        <nav className="space-y-3">
          <a className="flex items-center gap-3 rounded-xl bg-white/15 p-3">
            <LayoutDashboard size={20} />
            Painel inicial
          </a>

          <a className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/10">
            <ShoppingBag size={20} />
            Produtos
          </a>

          <a className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/10">
            <LinkIcon size={20} />
            Meus links
          </a>

          <a className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/10">
            <User size={20} />
            Minha conta
          </a>
        </nav>
      </aside>

      <main className="p-5 md:ml-64 md:p-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Painel inicial
            </h2>
            <p className="mt-1 text-gray-500">
              Bem-vindo ao AfiliaPro!
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-gray-700 shadow-sm">
            <LogOut size={18} />
            Sair
          </button>
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
            Explore os produtos disponíveis e organize seus links de afiliado
            em um só lugar.
          </p>
        </section>
      </main>
    </div>
  )
}
