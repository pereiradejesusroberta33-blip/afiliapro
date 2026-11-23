
import { useEffect, useState } from 'react'
import { ShoppingBag, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Produto = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  price: number | null
  commission: number | null
}

export default function Products() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarProdutos() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setErro('Não foi possível carregar os produtos.')
      } else {
        setProdutos(data ?? [])
      }

      setCarregando(false)
    }

    carregarProdutos()
  }, [])

  const produtosFiltrados = produtos.filter((produto) =>
    produto.name.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Produtos
        </h1>
        <p className="mt-2 text-gray-500">
          Encontre produtos para divulgar e ganhar comissões.
        </p>
      </header>

      <div className="mb-8 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
        <Search className="text-gray-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar produtos..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      {carregando && (
        <p className="text-gray-500">Carregando produtos...</p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 p-4 text-red-700">{erro}</p>
      )}

      {!carregando && !erro && produtosFiltrados.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 text-violet-700" size={40} />
          <h2 className="text-xl font-bold text-gray-800">
            Nenhum produto encontrado
          </h2>
          <p className="mt-2 text-gray-500">
            Os produtos cadastrados pela administração aparecerão aqui.
          </p>
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtosFiltrados.map((produto) => (
          <article
            key={produto.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            {produto.image_url ? (
              <img
                src={produto.image_url}
                alt={produto.name}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-violet-50">
                <ShoppingBag size={48} className="text-violet-400" />
              </div>
            )}

            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900">
                {produto.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {produto.description || 'Sem descrição disponível.'}
              </p>

              <div className="mt-5 flex justify-between border-t pt-4">
                <div>
                  <p className="text-xs text-gray-500">Preço</p>
                  <p className="font-bold text-gray-900">
                    {produto.price != null
                      ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}`
                      : 'Não informado'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Comissão</p>
                  <p className="font-bold text-green-600">
                    {produto.commission ?? 0}%
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
            }
                        
