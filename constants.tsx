
import { AppData, SectionType } from './types';

export const INITIAL_DATA: AppData = {
  settings: {
    companyName: 'CACU Agroindustrial',
    primaryColor: '#009E49', // Default Vibrant Green
    darkColor: '#0B3B24',    // Default Dark Green
    logoUrl: '', // Empty by default (uses SVG)
    reportTitle: 'Relatório de Sustentabilidade',
    reportSubtitle: 'Safras 2023/24 e 2024/25'
  },
  sections: [
    {
      id: 'capa',
      menuTitle: 'Início',
      items: [
        {
          id: 'cover-1',
          type: SectionType.COVER,
          title: 'Relatório de Sustentabilidade',
          subtitle: 'Safras 2023/24 e 2024/25',
          imageUrl: 'https://images.unsplash.com/photo-1530507629858-e4976987d460?q=80&w=2000&auto=format&fit=crop', // Vibrant Sugarcane
        }
      ]
    },
    {
      id: 'sumario',
      menuTitle: 'Sumário',
      items: [
        {
          id: 'summary-1',
          type: SectionType.SUMMARY,
          title: 'Sumário',
          bgColor: 'blue' // Will be rendered as Deep Green in the new CSS
        }
      ]
    },
    {
      id: 'destaques',
      menuTitle: 'Destaques',
      items: [
        {
          id: 'high-1',
          type: SectionType.STATS,
          title: 'Destaques do ano',
          bgColor: 'green', // Vibrant Green
          stats: [
            { label: 'Safra recorde', value: '+4,68 mi', description: 'toneladas de cana processada', icon: 'Leaf' },
            { label: 'Açúcar', value: '319 mil', description: 'toneladas produzidas', icon: 'Package' },
            { label: 'Etanol', value: '192 mil', description: 'm³ produzidos', icon: 'Droplets' },
            { label: 'Certificação', value: 'Bonsucro', description: 'Conquistada na safra 23/24', icon: 'Award' },
            { label: 'Empregados', value: '2.656', description: 'colaboradores diretos', icon: 'Users' },
            { label: 'Mulheres', value: '+25%', description: 'de contratação feminina', icon: 'UserPlus' },
            { label: 'Receita', value: 'R$ 1,32 bi', description: 'Receita líquida total', icon: 'TrendingUp' },
            { label: 'Redução GEE', value: '-19,3%', description: 'Emissões por tonelada', icon: 'Wind' }
          ]
        }
      ]
    },
    {
        id: 'quem-somos',
        menuTitle: 'Quem Somos',
        items: [
            {
                id: 'who-hero',
                type: SectionType.HERO,
                title: 'Quem somos',
                subtitle: 'Valdemir Castilho\nTécnico de Extração',
                imageUrl: 'https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?q=80&w=1000', // Industrial Worker
                layout: 'right',
                bgColor: 'blue'
            },
            {
                id: 'history-timeline',
                type: SectionType.TIMELINE,
                title: 'Nossa história',
                bgColor: 'blue',
                timelineEvents: [
                    { year: '2007', title: 'Início das atividades', description: 'Início em Lins (SP)' },
                    { year: '2013', title: 'Cisão', description: 'Operação independente' },
                    { year: '2020', title: 'Expansão', description: 'Escritório em Ribeirão Preto' },
                    { year: '2021', title: 'Fábrica de Leveduras', description: 'Inauguração' },
                    { year: '2023', title: 'Tanque de Etanol', description: 'Ampliação de estoque' },
                    { year: '2025', title: 'Ampliação Açúcar', description: 'Fase 1 - Mix 65%' }
                ]
            },
            {
                id: 'values-grid',
                type: SectionType.VALUES,
                title: 'Nosso compromisso',
                bgColor: 'white',
                values: [
                    { title: 'Propósito', description: 'Produzir energia que se transforma em combustível para a vida.', icon: 'Award' },
                    { title: 'Missão', description: 'Somos uma empresa em constante movimento em busca da excelência.', icon: 'Leaf' },
                    { title: 'Visão', description: 'Aumentar o resultado do negócio através da eficiência operacional e diversificação.', icon: 'Handshake' },
                    { title: 'Valores', description: 'Ética, Sustentabilidade, Segurança, Integração, Inovação e Pessoas.', icon: 'Heart' }
                ]
            },
            {
                id: 'products-grid',
                type: SectionType.GRID_CARDS,
                title: 'Nossos produtos',
                subtitle: 'GRI 2-6',
                bgColor: 'white',
                products: [
                    { title: 'Açúcar', description: 'Capacidade de 6,5 milhões de sacas. Cristal bruto e branco.', imageUrl: 'https://images.unsplash.com/photo-1626202269264-99393267db15?q=80&w=800' },
                    { title: 'Etanol', description: 'Hidratado e Anidro. Capacidade de 215 milhões de litros.', imageUrl: 'https://images.unsplash.com/photo-1612886788694-967a3752b4df?q=80&w=800' },
                    { title: 'Levedura', description: 'Fábrica inaugurada em 2021. 30 ton/dia de levedura seca.', imageUrl: 'https://images.unsplash.com/photo-1516214666242-687c77338333?q=80&w=800' },
                    { title: 'Bioenergia', description: 'Geração a partir do bagaço. Autossuficiência e exportação.', imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800' }
                ]
            }
        ]
    },
    {
        id: 'materialidade',
        menuTitle: 'Materialidade',
        items: [
            {
                id: 'materiality-map',
                type: SectionType.MATERIALITY,
                title: 'Temas materiais',
                subtitle: 'GRI 3-2',
                bgColor: 'white'
            }
        ]
    },
    {
        id: 'meio-ambiente',
        menuTitle: 'Meio Ambiente',
        items: [
            {
                id: 'env-hero',
                type: SectionType.HERO,
                title: 'Meio ambiente',
                subtitle: 'Victor Rocha Araújo\nEspecialista em Irrigação',
                imageUrl: 'https://images.unsplash.com/photo-1615811361524-68d08e361813?q=80&w=1000',
                layout: 'right',
                bgColor: 'blue'
            },
            {
                id: 'emissions-chart',
                type: SectionType.CHART,
                title: 'Emissões de GEE',
                subtitle: 'tCO2e / t cana moída',
                body: 'Redução de 19,3% nas emissões de Escopo 1 e 2 em comparação ao ano-base de 2021. A gestão eficiente e o uso de biofertilizantes contribuíram para este resultado.',
                bgColor: 'white',
                chartData: [
                    { name: '2021', value1: 0.0698 },
                    { name: '2022', value1: 0.0621 },
                    { name: '2023', value1: 0.0545 },
                    { name: '2024', value1: 0.0545 }
                ]
            }
        ]
    },
    {
        id: 'social',
        menuTitle: 'Social',
        items: [
            {
                id: 'soc-hero',
                type: SectionType.HERO,
                title: 'Social',
                subtitle: 'Valdir Moura Gil\nOperador Agrícola',
                imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000',
                layout: 'right',
                bgColor: 'blue'
            }
        ]
    },
    {
        id: 'governanca',
        menuTitle: 'Governança',
        items: [
            {
                id: 'gov-hero',
                type: SectionType.HERO,
                title: 'Governança',
                subtitle: 'Maurício Pereira\nAnalista Programador',
                imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000',
                layout: 'right',
                bgColor: 'blue'
            }
        ]
    }
  ]
};
