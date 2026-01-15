/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' cria uma pasta .next/standalone contendo apenas o necessário para produção.
  // Isso resolve problemas de memória e caminhos na Hostinger.
  output: 'standalone',
  
  // Hostinger não possui as libs nativas para otimização de imagem do Next.js.
  // Isso evita erros 500 ao carregar imagens.
  images: {
    unoptimized: true,
  },
  
  // Garante que headers de segurança básicos sejam aplicados
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

export default nextConfig;