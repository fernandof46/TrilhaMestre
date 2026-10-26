import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router';
import { ArrowLeft, Rocket, BookOpen, ExternalLink, CheckCircle2, Circle, Clock, Sparkles, Download, FileText, Loader2 } from 'lucide-react';
import { generateRoadmap, type RoadmapData } from '@/lib/roadmap-generator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function RoadmapView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = location.state as {topic: string;description: string;level: string;} | null;

    if (!state) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      const generated = generateRoadmap(state.topic, state.description, state.level);
      setRoadmap(generated);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const exportToPDF = async () => {
    if (!roadmapRef.current || !roadmap) return;

    setIsExporting(true);

    try {
      const element = roadmapRef.current;

      // Criar canvas do elemento
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc'
      });

      const imgData = canvas.toDataURL('image/png');

      // Configurar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Se a imagem for maior que uma página, dividir em múltiplas páginas
      const scaledHeight = imgHeight * ratio;
      let heightLeft = scaledHeight;
      let position = 0;

      // Primeira página
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
      heightLeft -= pdfHeight;

      // Páginas adicionais se necessário
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
        heightLeft -= pdfHeight;
      }

      // Salvar PDF
      const fileName = `roadmap-${roadmap.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const progress = roadmap ?
  Math.round(completedSteps.size / roadmap.phases.reduce((acc, p) => acc + p.steps.length, 0) * 100) :
  0;

  if (isLoading) {
    return (
      <div data-ev-id="ev_86b6bcd02f" className="min-h-screen bg-background flex items-center justify-center p-4">
				<div data-ev-id="ev_995413a043" className="text-center">
					<div data-ev-id="ev_72cfe6cb51" className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p data-ev-id="ev_bf2e5ea99d" className="text-text-secondary animate-pulse text-sm sm:text-base">Gerando seu roadmap personalizado...</p>
				</div>
			</div>);

  }

  if (!roadmap) return null;

  return (
    <div data-ev-id="ev_df3068424e" className="min-h-screen bg-background">
			{/* Header - Fixed no mobile */}
			<header data-ev-id="ev_ace5583e3e" className="bg-surface border-b border-border sticky top-0 z-20">
				<div data-ev-id="ev_e0ad501faa" className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
					<div data-ev-id="ev_05d7efa029" className="flex items-center justify-between">
						<Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-text-secondary hover:text-text transition-colors">
							<ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
							<span data-ev-id="ev_6ad0ce6831" className="text-sm sm:text-base">Voltar</span>
						</Link>
						<div data-ev-id="ev_a2b8a9a929" className="flex items-center gap-2">
							<Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
							<span data-ev-id="ev_7eed6e079d" className="font-semibold text-text text-sm sm:text-base">RoadmapAI</span>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main data-ev-id="ev_70edc1fc85" className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
				{/* Conteúdo para PDF */}
				<div data-ev-id="ev_67cc0a31a8" ref={roadmapRef}>
					{/* Roadmap Header */}
					<div data-ev-id="ev_a220d99d83" className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8">
						<div data-ev-id="ev_bcf7b628e6" className="flex flex-col gap-4 mb-4 sm:mb-6">
							<div data-ev-id="ev_dd4941b61b" className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
								<div data-ev-id="ev_c0aec0cd38" className="flex-1">
									<div data-ev-id="ev_d49d470c39" className="flex items-center gap-2 mb-2">
										<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
										<span data-ev-id="ev_e57716229d" className="text-xs sm:text-sm font-medium text-primary">Roadmap Gerado por IA</span>
									</div>
									<h1 data-ev-id="ev_6e47cd9cab" className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-1 sm:mb-2">{roadmap.title}</h1>
									<p data-ev-id="ev_dd790d0985" className="text-text-secondary text-sm sm:text-base">{roadmap.description}</p>
								</div>
								<div data-ev-id="ev_ce041dc930" className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-border self-start">
									<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted" />
									<span data-ev-id="ev_fba44a0232" className="text-xs sm:text-sm text-text-secondary">{roadmap.estimatedTime}</span>
								</div>
							</div>

							{/* Botão de Download PDF */}
							<button data-ev-id="ev_3d21cf051b"
              onClick={exportToPDF}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base">

								{isExporting ?
                <>
										<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
										<span data-ev-id="ev_441003e19f">Gerando PDF...</span>
									</> :

                <>
										<Download className="w-4 h-4 sm:w-5 sm:h-5" />
										<span data-ev-id="ev_c6c5e1c49e">Baixar PDF</span>
									</>
                }
							</button>
						</div>

						{/* Progress Bar */}
						<div data-ev-id="ev_ab963d6487" className="bg-surface rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border">
							<div data-ev-id="ev_372616a6ec" className="flex items-center justify-between mb-2">
								<span data-ev-id="ev_6dd199b3f3" className="text-xs sm:text-sm font-medium text-text">Seu Progresso</span>
								<span data-ev-id="ev_d0f5ca2d5c" className="text-xs sm:text-sm font-semibold text-primary">{progress}%</span>
							</div>
							<div data-ev-id="ev_4fcf35e722" className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
								<div data-ev-id="ev_28a1b82322"
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }} />

							</div>
						</div>
					</div>

					{/* Phases */}
					<div data-ev-id="ev_584a5089cc" className="flex flex-col gap-4 sm:gap-8">
						{roadmap.phases.map((phase, phaseIndex) =>
            <PhaseCard
              key={phase.id}
              phase={phase}
              phaseNumber={phaseIndex + 1}
              completedSteps={completedSteps}
              onToggleStep={toggleStep} />

            )}
					</div>
				</div>

				{/* Footer Actions */}
				<div data-ev-id="ev_87168827b5" className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
					<button data-ev-id="ev_be16891e51"
          onClick={exportToPDF}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-surface border border-border text-text font-semibold rounded-xl hover:border-primary/30 disabled:opacity-50 transition-colors text-sm sm:text-base">

						<FileText className="w-4 h-4 sm:w-5 sm:h-5" />
						<span data-ev-id="ev_e0b0e60aa2">Salvar como PDF</span>
					</button>
					<Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm sm:text-base">

						<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
						Criar Novo Roadmap
					</Link>
				</div>
			</main>

			{/* Bottom Safe Area para mobile */}
			<div data-ev-id="ev_354451ee0c" className="h-6 sm:h-0" />
		</div>);

}

interface Phase {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

interface Step {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
}

interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
}

function PhaseCard({ phase, phaseNumber, completedSteps, onToggleStep




}: {phase: Phase;phaseNumber: number;completedSteps: Set<string>;onToggleStep: (stepId: string) => void;}) {
  const phaseColors = [
  'from-primary to-primary-dark',
  'from-secondary to-purple-600',
  'from-accent to-cyan-600',
  'from-success to-emerald-600',
  'from-warning to-orange-600'];


  const completedInPhase = phase.steps.filter((s) => completedSteps.has(s.id)).length;

  return (
    <div data-ev-id="ev_109aa41d4b" className="bg-surface rounded-xl sm:rounded-2xl border border-border overflow-hidden">
			{/* Phase Header */}
			<div data-ev-id="ev_f0a82c77eb" className={`bg-gradient-to-r ${phaseColors[(phaseNumber - 1) % phaseColors.length]} p-3 sm:p-4 lg:p-6`}>
				<div data-ev-id="ev_2e256350ab" className="flex items-start justify-between gap-3">
					<div data-ev-id="ev_352753ce41" className="flex-1 min-w-0">
						<span data-ev-id="ev_e27ffd36e0" className="text-white/80 text-xs sm:text-sm font-medium">Fase {phaseNumber}</span>
						<h2 data-ev-id="ev_78b95a5d82" className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{phase.title}</h2>
						<p data-ev-id="ev_dddbd206f0" className="text-white/80 mt-0.5 sm:mt-1 text-sm sm:text-base line-clamp-2">{phase.description}</p>
					</div>
					<div data-ev-id="ev_557ad93150" className="bg-white/20 px-2.5 py-1 rounded-full text-white text-xs sm:text-sm whitespace-nowrap">
						{completedInPhase}/{phase.steps.length}
					</div>
				</div>
			</div>

			{/* Steps */}
			<div data-ev-id="ev_21f82c924d" className="p-3 sm:p-4 lg:p-6">
				<div data-ev-id="ev_bfd7fd845d" className="flex flex-col gap-3 sm:gap-4">
					{phase.steps.map((step, stepIndex) =>
          <StepCard
            key={step.id}
            step={step}
            stepNumber={stepIndex + 1}
            isCompleted={completedSteps.has(step.id)}
            onToggle={() => onToggleStep(step.id)} />

          )}
				</div>
			</div>
		</div>);

}

function StepCard({ step, stepNumber, isCompleted, onToggle




}: {step: Step;stepNumber: number;isCompleted: boolean;onToggle: () => void;}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const resourceIcons = {
    video: '🎬',
    article: '📄',
    course: '🎓',
    documentation: '📚'
  };

  return (
    <div data-ev-id="ev_345e2c72f3" className={`rounded-lg sm:rounded-xl border transition-all ${
    isCompleted ? 'bg-success/5 border-success/30' : 'bg-background border-border'}`
    }>
			<div data-ev-id="ev_adcebf9208" className="p-3 sm:p-4">
				<div data-ev-id="ev_457dd03bbf" className="flex items-start gap-2.5 sm:gap-3">
					<button data-ev-id="ev_88f6aebbdb"
          onClick={onToggle}
          className="mt-0.5 flex-shrink-0 touch-manipulation"
          aria-label={isCompleted ? 'Marcar como não concluído' : 'Marcar como concluído'}>

						{isCompleted ?
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success" /> :

            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-text-muted hover:text-primary transition-colors" />
            }
					</button>
					<div data-ev-id="ev_86ca7c4ce0" className="flex-1 min-w-0">
						<div data-ev-id="ev_e3c70e82c5" className="flex items-center gap-2 mb-0.5 sm:mb-1">
							<span data-ev-id="ev_0a0187de7f" className="text-[10px] sm:text-xs font-medium text-text-muted">Passo {stepNumber}</span>
						</div>
						<h3 data-ev-id="ev_2d8bca9c1b" className={`font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base ${isCompleted ? 'text-success line-through' : 'text-text'}`}>
							{step.title}
						</h3>
						<p data-ev-id="ev_ce7ebc90d5" className="text-xs sm:text-sm text-text-secondary mb-2 sm:mb-3">{step.description}</p>
						
						{/* Resources Toggle */}
						<button data-ev-id="ev_10d242c6e7"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary hover:text-primary-dark transition-colors touch-manipulation">

							<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							<span data-ev-id="ev_f4d10672c4">{isExpanded ? 'Ocultar' : 'Ver'} materiais ({step.resources.length})</span>
						</button>

						{/* Resources List */}
						{isExpanded &&
            <div data-ev-id="ev_a25e20f7ce" className="mt-2.5 sm:mt-3 flex flex-col gap-2">
								{step.resources.map((resource, index) =>
              <a data-ev-id="ev_42858e2a1a"
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-surface rounded-lg border border-border hover:border-primary/30 active:bg-muted transition-colors group">

										<span data-ev-id="ev_9e8a6f7925" className="text-base sm:text-lg">{resourceIcons[resource.type]}</span>
										<div data-ev-id="ev_13ae89aec9" className="flex-1 min-w-0">
											<p data-ev-id="ev_f19d8318b9" className="text-xs sm:text-sm font-medium text-text group-hover:text-primary transition-colors line-clamp-2">
												{resource.title}
											</p>
											<p data-ev-id="ev_770c3e1945" className="text-[10px] sm:text-xs text-text-muted capitalize">{resource.type}</p>
										</div>
										<ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
									</a>
              )}
							</div>
            }
					</div>
				</div>
			</div>
		</div>);

}