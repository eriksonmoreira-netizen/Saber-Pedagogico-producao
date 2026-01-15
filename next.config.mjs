/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera uma pasta 'standalone' otimizada para VPS e hospedagens Node.js (como Hostinger)
  output: 'standalone',
  
  // Desativa a otimização de imagem padrão que requer bibliotecas nativas adicionais
  images: {
    unoptimized: true,
  },
  
  // Headers de segurança básicos
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