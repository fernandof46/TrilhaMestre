import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Rocket, BookOpen, CheckCircle, Map, Target, Lightbulb, FileText } from 'lucide-react';
import RoadmapForm from '@/components/RoadmapForm';

export default function Index() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (topic: string, description: string, level: string) => {
    setIsGenerating(true);

    // Simular tempo de processamento da IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Navegar para página de visualização com os dados
    navigate('/roadmap', {
      state: { topic, description, level }
    });
  };

  return (
    <div data-ev-id="ev_e436f418fc" className="min-h-screen bg-background">
			{/* Hero Section */}
			<div data-ev-id="ev_d7f8d51bf9" className="relative overflow-hidden">
				{/* Background Gradient */}
				<div data-ev-id="ev_75e05d9ba0" className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
				<div data-ev-id="ev_b0196ec8d0" className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl" />
				<div data-ev-id="ev_81ba6282f5" className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/20 rounded-full blur-3xl" />
				
				<div data-ev-id="ev_db6a1b3a12" className="relative max-w-6xl mx-auto px-4 py-10 sm:py-16 lg:py-24">
					{/* Header */}
					<div data-ev-id="ev_50c19854a3" className="text-center mb-8 sm:mb-12">
						<div data-ev-id="ev_1a8e17a6f3" className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
							<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							<span data-ev-id="ev_5e6354d545">Powered by AI</span>
						</div>
						
						<h1 data-ev-id="ev_3010f34d2c" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-text mb-4 sm:mb-6 text-balance px-2">
							Crie <span data-ev-id="ev_782b60b331" className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Roadmaps</span> de Projetos com IA
						</h1>
						
						<p data-ev-id="ev_b2f6c0840a" className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto text-pretty px-2">
							Descreva seu projeto e deixe a inteligência artificial criar um plano de execução completo, 
							com etapas detalhadas e materiais de estudo gratuitos.
						</p>
					</div>

					{/* Form Section */}
					<div data-ev-id="ev_219d857ca3" className="max-w-2xl mx-auto">
						<RoadmapForm onGenerate={handleGenerate} isGenerating={isGenerating} />
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div data-ev-id="ev_791f0337c3" className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
				<h2 data-ev-id="ev_b72f4c3849" className="text-xl sm:text-2xl lg:text-3xl font-bold text-text text-center mb-8 sm:mb-12">
					Como funciona?
				</h2>
				
				<div data-ev-id="ev_840636359f" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
					<FeatureCard
            icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="1. Descreva seu Projeto"
            description="Conte sobre o tema, seus objetivos e o que você precisa aprender ou desenvolver."
            color="primary" />

					<FeatureCard
            icon={<Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="2. IA Gera o Roadmap"
            description="Nossa IA analisa seu projeto e cria um plano de execução completo e personalizado."
            color="secondary" />

					<FeatureCard
            icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
            title="3. Acesse Materiais Gratuitos"
            description="Receba links para cursos, tutoriais e documentações gratuitas para cada etapa."
            color="accent" />

				</div>
			</div>

			{/* Benefits Section */}
			<div data-ev-id="ev_912822ed01" className="bg-surface border-y border-border">
				<div data-ev-id="ev_d85deda9b3" className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
					<div data-ev-id="ev_ff3fe0c93d" className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<div data-ev-id="ev_ee723de347">
							<h2 data-ev-id="ev_c0f6daa130" className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-4 sm:mb-6">
								Por que usar o RoadmapAI?
							</h2>
							<div data-ev-id="ev_73d7ec2da1" className="flex flex-col gap-3 sm:gap-4">
								<BenefitItem text="Economize horas de planejamento" />
								<BenefitItem text="Roadmaps personalizados para seu nível" />
								<BenefitItem text="Materiais de estudo 100% gratuitos" />
								<BenefitItem text="Etapas claras e organizadas" />
								<BenefitItem text="Salve em PDF para consultar offline" />
								<BenefitItem text="Funciona perfeitamente no celular" />
							</div>
						</div>
						<div data-ev-id="ev_bf7c3f42f7" className="relative">
							<div data-ev-id="ev_e0632ecd4a" className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl p-4 sm:p-8">
								<div data-ev-id="ev_d781c41420" className="bg-surface rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
									<div data-ev-id="ev_f323076dbd" className="flex items-center gap-3 mb-4">
										<div data-ev-id="ev_9c17fa9e58" className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<Map className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
										</div>
										<div data-ev-id="ev_b7b72a135e">
											<h4 data-ev-id="ev_e0e4e5c9fd" className="font-semibold text-text text-sm sm:text-base">Seu Roadmap</h4>
											<p data-ev-id="ev_cda9661a66" className="text-xs sm:text-sm text-text-muted">Criado com IA</p>
										</div>
									</div>
									<div data-ev-id="ev_0119b37cd9" className="flex flex-col gap-3">
										<div data-ev-id="ev_e2ea5c461b" className="h-2.5 sm:h-3 bg-success/20 rounded-full overflow-hidden">
											<div data-ev-id="ev_1cf36beecf" className="h-full w-3/4 bg-success rounded-full" />
										</div>
										<p data-ev-id="ev_78f36988ee" className="text-xs sm:text-sm text-text-secondary">75% concluído</p>
									</div>
									<div data-ev-id="ev_e57fba213f" className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-text-muted">
										<FileText className="w-4 h-4" />
										<span data-ev-id="ev_5c280d5c32" className="text-xs sm:text-sm">Disponível para download em PDF</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer data-ev-id="ev_2adfbbba94" className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
				<div data-ev-id="ev_2d64fe2528" className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-text-muted text-xs sm:text-sm">
					<div data-ev-id="ev_72de571ee4" className="flex items-center gap-2">
						<Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
						<span data-ev-id="ev_e0538f42b7" className="font-semibold text-text">RoadmapAI</span>
					</div>
					<p data-ev-id="ev_5ea01eab54" className="text-center">Crie roadmaps inteligentes para seus projetos</p>
				</div>
			</footer>
		</div>);

}

function FeatureCard({ icon, title, description, color }: {icon: React.ReactNode;title: string;description: string;color: string;}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent'
  };

  return (
    <div data-ev-id="ev_20c5af2eb1" className="bg-surface rounded-xl p-4 sm:p-6 border border-border hover:border-primary/30 transition-colors">
			<div data-ev-id="ev_eee1ce6555" className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
				{icon}
			</div>
			<h3 data-ev-id="ev_a5ec0d270b" className="text-base sm:text-lg font-semibold text-text mb-1.5 sm:mb-2">{title}</h3>
			<p data-ev-id="ev_ea06a570ca" className="text-text-secondary text-sm sm:text-base">{description}</p>
		</div>);

}

function BenefitItem({ text }: {text: string;}) {
  return (
    <div data-ev-id="ev_626d892cb2" className="flex items-center gap-2.5 sm:gap-3">
			<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
			<span data-ev-id="ev_35f702f929" className="text-text-secondary text-sm sm:text-base">{text}</span>
		</div>);

}