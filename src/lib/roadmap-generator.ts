export interface Resource {
	title: string;
	url: string;
	type: 'video' | 'article' | 'course' | 'documentation';
}

export interface Step {
	id: string;
	title: string;
	description: string;
	resources: Resource[];
}

export interface Phase {
	id: string;
	title: string;
	description: string;
	steps: Step[];
}

export interface RoadmapData {
	title: string;
	description: string;
	estimatedTime: string;
	phases: Phase[];
}

// Database de recursos gratuitos organizados por categoria
const resourceDatabase: Record<string, Resource[]> = {
	// Programação Geral
	'programacao-basico': [
		{ title: 'CS50 - Introdução à Ciência da Computação (Harvard)', url: 'https://cs50.harvard.edu/x/', type: 'course' },
		{ title: 'freeCodeCamp - Curso Completo', url: 'https://www.freecodecamp.org/', type: 'course' },
		{ title: 'Codecademy - Cursos Gratuitos', url: 'https://www.codecademy.com/catalog', type: 'course' },
	],
	'logica-programacao': [
		{ title: 'Curso de Lógica de Programação - Curso em Vídeo', url: 'https://www.youtube.com/playlist?list=PLHz_AreHm4dmSj0MHol_aoNYCSGFqvfXV', type: 'video' },
		{ title: 'Visualgo - Visualização de Algoritmos', url: 'https://visualgo.net/', type: 'article' },
		{ title: 'Exercícios de Lógica - URI Online Judge', url: 'https://www.beecrowd.com.br/', type: 'article' },
	],
	// Web Development
	'html-css': [
		{ title: 'HTML & CSS - Curso em Vídeo', url: 'https://www.youtube.com/playlist?list=PLHz_AreHm4dkZ9-atkcmcBaMZdmLHft8n', type: 'video' },
		{ title: 'MDN Web Docs - HTML', url: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML', type: 'documentation' },
		{ title: 'MDN Web Docs - CSS', url: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS', type: 'documentation' },
		{ title: 'CSS Tricks - Guias e Tutoriais', url: 'https://css-tricks.com/', type: 'article' },
	],
	'javascript': [
		{ title: 'JavaScript.info - Tutorial Moderno', url: 'https://javascript.info/', type: 'documentation' },
		{ title: 'Eloquent JavaScript (Livro Gratuito)', url: 'https://eloquentjavascript.net/', type: 'article' },
		{ title: 'JavaScript - Curso em Vídeo', url: 'https://www.youtube.com/playlist?list=PLHz_AreHm4dlsK3Nr9GVvXCbpQyHQl1o1', type: 'video' },
		{ title: 'freeCodeCamp - JavaScript', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'course' },
	],
	'react': [
		{ title: 'React - Documentação Oficial', url: 'https://react.dev/', type: 'documentation' },
		{ title: 'React Tutorial for Beginners - freeCodeCamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8', type: 'video' },
		{ title: 'Full Stack Open - React', url: 'https://fullstackopen.com/en/', type: 'course' },
	],
	'typescript': [
		{ title: 'TypeScript - Documentação Oficial', url: 'https://www.typescriptlang.org/docs/', type: 'documentation' },
		{ title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'documentation' },
		{ title: 'TypeScript Course - Traversy Media', url: 'https://www.youtube.com/watch?v=BCg4U1FzODs', type: 'video' },
	],
	'nodejs': [
		{ title: 'Node.js - Documentação Oficial', url: 'https://nodejs.org/docs/latest/api/', type: 'documentation' },
		{ title: 'The Odin Project - NodeJS', url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs', type: 'course' },
		{ title: 'Node.js Crash Course - Traversy Media', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', type: 'video' },
	],
	// Python
	'python-basico': [
		{ title: 'Python - Curso em Vídeo', url: 'https://www.youtube.com/playlist?list=PLvE-ZAFRgX8hnECDn1v9HNTI71veL3oW0', type: 'video' },
		{ title: 'Python.org - Tutorial Oficial', url: 'https://docs.python.org/pt-br/3/tutorial/', type: 'documentation' },
		{ title: 'Automate the Boring Stuff with Python', url: 'https://automatetheboringstuff.com/', type: 'article' },
	],
	'python-avancado': [
		{ title: 'Real Python - Tutoriais Avançados', url: 'https://realpython.com/', type: 'article' },
		{ title: 'Python Design Patterns', url: 'https://refactoring.guru/design-patterns/python', type: 'article' },
	],
	// Data Science & ML
	'data-science': [
		{ title: 'Kaggle Learn - Data Science', url: 'https://www.kaggle.com/learn', type: 'course' },
		{ title: 'Google Data Analytics Certificate', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', type: 'course' },
		{ title: 'Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'article' },
	],
	'machine-learning': [
		{ title: 'Machine Learning - Andrew Ng (Coursera)', url: 'https://www.coursera.org/learn/machine-learning', type: 'course' },
		{ title: 'Fast.ai - Practical Deep Learning', url: 'https://www.fast.ai/', type: 'course' },
		{ title: 'Scikit-learn - Documentação', url: 'https://scikit-learn.org/stable/documentation.html', type: 'documentation' },
		{ title: 'TensorFlow - Tutoriais', url: 'https://www.tensorflow.org/tutorials', type: 'documentation' },
	],
	// Design
	'ui-design': [
		{ title: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', type: 'course' },
		{ title: 'Figma - Tutoriais Oficiais', url: 'https://help.figma.com/hc/en-us/categories/360002051613-Get-started', type: 'documentation' },
		{ title: 'Laws of UX', url: 'https://lawsofux.com/', type: 'article' },
	],
	'design-grafico': [
		{ title: 'Canva Design School', url: 'https://www.canva.com/designschool/', type: 'course' },
		{ title: 'Adobe Creative Cloud Tutorials', url: 'https://helpx.adobe.com/creative-cloud/tutorials-explore.html', type: 'video' },
	],
	// Marketing
	'marketing-digital': [
		{ title: 'Google Digital Garage', url: 'https://learndigital.withgoogle.com/digitalgarage', type: 'course' },
		{ title: 'HubSpot Academy', url: 'https://academy.hubspot.com/', type: 'course' },
		{ title: 'SEMrush Academy', url: 'https://www.semrush.com/academy/', type: 'course' },
	],
	'seo': [
		{ title: 'Google Search Central', url: 'https://developers.google.com/search/docs', type: 'documentation' },
		{ title: 'Moz - The Beginner\'s Guide to SEO', url: 'https://moz.com/beginners-guide-to-seo', type: 'article' },
		{ title: 'Ahrefs - SEO Basics', url: 'https://ahrefs.com/blog/seo-basics/', type: 'article' },
	],
	// Mobile
	'mobile-dev': [
		{ title: 'React Native - Documentação', url: 'https://reactnative.dev/docs/getting-started', type: 'documentation' },
		{ title: 'Flutter - Documentação', url: 'https://flutter.dev/docs', type: 'documentation' },
		{ title: 'The Net Ninja - React Native', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ', type: 'video' },
	],
	// DevOps
	'devops': [
		{ title: 'Docker - Documentação', url: 'https://docs.docker.com/', type: 'documentation' },
		{ title: 'Kubernetes - Tutoriais', url: 'https://kubernetes.io/docs/tutorials/', type: 'documentation' },
		{ title: 'DevOps Roadmap', url: 'https://roadmap.sh/devops', type: 'article' },
	],
	'git': [
		{ title: 'Git - Documentação Oficial', url: 'https://git-scm.com/doc', type: 'documentation' },
		{ title: 'Learn Git Branching', url: 'https://learngitbranching.js.org/', type: 'article' },
		{ title: 'GitHub Skills', url: 'https://skills.github.com/', type: 'course' },
	],
	// Databases
	'sql': [
		{ title: 'SQLBolt - Interactive SQL Tutorial', url: 'https://sqlbolt.com/', type: 'article' },
		{ title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'documentation' },
		{ title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'article' },
	],
	// Soft Skills
	'gestao-projetos': [
		{ title: 'Google Project Management Certificate', url: 'https://www.coursera.org/professional-certificates/google-project-management', type: 'course' },
		{ title: 'Agile Manifesto', url: 'https://agilemanifesto.org/', type: 'article' },
		{ title: 'Scrum Guide', url: 'https://scrumguides.org/', type: 'documentation' },
	],
	'produtividade': [
		{ title: 'Notion - Templates e Tutoriais', url: 'https://www.notion.so/templates', type: 'article' },
		{ title: 'Getting Things Done - Resumo', url: 'https://gettingthingsdone.com/', type: 'article' },
	],
	// Empreendedorismo
	'empreendedorismo': [
		{ title: 'Y Combinator Startup School', url: 'https://www.startupschool.org/', type: 'course' },
		{ title: 'Lean Startup - Eric Ries', url: 'https://theleanstartup.com/', type: 'article' },
		{ title: 'SEBRAE - Cursos Gratuitos', url: 'https://www.sebrae.com.br/sites/PortalSebrae/cursosonline', type: 'course' },
	],
	// Finanças
	'financas': [
		{ title: 'Khan Academy - Finanças', url: 'https://pt.khanacademy.org/economics-finance-domain', type: 'course' },
		{ title: 'Investopedia', url: 'https://www.investopedia.com/', type: 'article' },
	],
	// Genéricos
	'pesquisa': [
		{ title: 'Google Scholar', url: 'https://scholar.google.com/', type: 'article' },
		{ title: 'ResearchGate', url: 'https://www.researchgate.net/', type: 'article' },
	],
	'documentacao': [
		{ title: 'DevDocs - Documentação Agregada', url: 'https://devdocs.io/', type: 'documentation' },
		{ title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'documentation' },
	],
};

// Templates de roadmaps baseados em categorias
const roadmapTemplates: Record<string, (level: string, description: string) => RoadmapData> = {
	'desenvolvimento-web': (level, description) => ({
		title: 'Roadmap de Desenvolvimento Web',
		description: `Plano completo para ${level === 'iniciante' ? 'começar na' : level === 'intermediario' ? 'evoluir na' : 'dominar a'} área de desenvolvimento web.`,
		estimatedTime: level === 'iniciante' ? '6-8 meses' : level === 'intermediario' ? '4-6 meses' : '3-4 meses',
		phases: [
			{
				id: 'fase-1',
				title: 'Fundamentos',
				description: 'Domine as bases do desenvolvimento web',
				steps: [
					{
						id: 'step-1-1',
						title: 'HTML5 - Estrutura Web',
						description: 'Aprenda a criar a estrutura semântica de páginas web com HTML5.',
						resources: resourceDatabase['html-css'],
					},
					{
						id: 'step-1-2',
						title: 'CSS3 - Estilização',
						description: 'Domine CSS para criar layouts responsivos e designs atraentes.',
						resources: resourceDatabase['html-css'],
					},
					{
						id: 'step-1-3',
						title: 'Git e Controle de Versão',
						description: 'Aprenda a versionar seu código e trabalhar em equipe.',
						resources: resourceDatabase['git'],
					},
				],
			},
			{
				id: 'fase-2',
				title: 'JavaScript',
				description: 'Adicione interatividade às suas páginas',
				steps: [
					{
						id: 'step-2-1',
						title: 'JavaScript Básico',
						description: 'Fundamentos: variáveis, funções, arrays, objetos e DOM.',
						resources: resourceDatabase['javascript'],
					},
					{
						id: 'step-2-2',
						title: 'JavaScript Avançado',
						description: 'Async/await, promises, ES6+ features e APIs.',
						resources: resourceDatabase['javascript'],
					},
				],
			},
			{
				id: 'fase-3',
				title: 'Frameworks Modernos',
				description: 'Construa aplicações profissionais',
				steps: [
					{
						id: 'step-3-1',
						title: 'React.js',
						description: 'Aprenda o framework mais popular para criar interfaces de usuário.',
						resources: resourceDatabase['react'],
					},
					{
						id: 'step-3-2',
						title: 'TypeScript',
						description: 'Adicione tipagem estática ao JavaScript para código mais robusto.',
						resources: resourceDatabase['typescript'],
					},
				],
			},
			{
				id: 'fase-4',
				title: 'Backend',
				description: 'Construa o servidor da sua aplicação',
				steps: [
					{
						id: 'step-4-1',
						title: 'Node.js e APIs',
						description: 'Crie servidores e APIs RESTful com Node.js e Express.',
						resources: resourceDatabase['nodejs'],
					},
					{
						id: 'step-4-2',
						title: 'Banco de Dados SQL',
						description: 'Aprenda a armazenar e consultar dados com PostgreSQL/MySQL.',
						resources: resourceDatabase['sql'],
					},
				],
			},
		],
	}),

	'data-science': (level, description) => ({
		title: 'Roadmap de Data Science',
		description: `Plano completo para ${level === 'iniciante' ? 'iniciar em' : level === 'intermediario' ? 'avançar em' : 'especializar-se em'} ciência de dados.`,
		estimatedTime: level === 'iniciante' ? '8-12 meses' : level === 'intermediario' ? '6-8 meses' : '4-6 meses',
		phases: [
			{
				id: 'fase-1',
				title: 'Fundamentos de Programação',
				description: 'Domine Python para análise de dados',
				steps: [
					{
						id: 'step-1-1',
						title: 'Python Básico',
						description: 'Aprenda os fundamentos de Python: sintaxe, estruturas de dados e funções.',
						resources: resourceDatabase['python-basico'],
					},
					{
						id: 'step-1-2',
						title: 'Lógica de Programação',
						description: 'Desenvolva seu raciocínio lógico para resolver problemas.',
						resources: resourceDatabase['logica-programacao'],
					},
				],
			},
			{
				id: 'fase-2',
				title: 'Análise de Dados',
				description: 'Manipule e visualize dados',
				steps: [
					{
						id: 'step-2-1',
						title: 'Pandas e NumPy',
						description: 'Domine as bibliotecas essenciais para manipulação de dados.',
						resources: resourceDatabase['data-science'],
					},
					{
						id: 'step-2-2',
						title: 'SQL para Data Science',
						description: 'Aprenda a consultar e manipular dados em bancos relacionais.',
						resources: resourceDatabase['sql'],
					},
				],
			},
			{
				id: 'fase-3',
				title: 'Machine Learning',
				description: 'Crie modelos preditivos',
				steps: [
					{
						id: 'step-3-1',
						title: 'Fundamentos de ML',
						description: 'Aprenda os conceitos fundamentais de aprendizado de máquina.',
						resources: resourceDatabase['machine-learning'],
					},
					{
						id: 'step-3-2',
						title: 'Scikit-learn e TensorFlow',
						description: 'Implemente modelos com as principais bibliotecas de ML.',
						resources: resourceDatabase['machine-learning'],
					},
				],
			},
			{
				id: 'fase-4',
				title: 'Projetos e Portfólio',
				description: 'Aplique seus conhecimentos em projetos reais',
				steps: [
					{
						id: 'step-4-1',
						title: 'Kaggle Competitions',
						description: 'Participe de competições para praticar e aprender.',
						resources: resourceDatabase['data-science'],
					},
				],
			},
		],
	}),

	'marketing-digital': (level, description) => ({
		title: 'Roadmap de Marketing Digital',
		description: `Plano completo para ${level === 'iniciante' ? 'começar em' : level === 'intermediario' ? 'crescer em' : 'dominar'} marketing digital.`,
		estimatedTime: level === 'iniciante' ? '4-6 meses' : level === 'intermediario' ? '3-4 meses' : '2-3 meses',
		phases: [
			{
				id: 'fase-1',
				title: 'Fundamentos',
				description: 'Entenda os pilares do marketing digital',
				steps: [
					{
						id: 'step-1-1',
						title: 'Conceitos de Marketing Digital',
						description: 'Aprenda os fundamentos e as principais estratégias.',
						resources: resourceDatabase['marketing-digital'],
					},
					{
						id: 'step-1-2',
						title: 'SEO Básico',
						description: 'Otimize seu conteúdo para buscadores.',
						resources: resourceDatabase['seo'],
					},
				],
			},
			{
				id: 'fase-2',
				title: 'Ferramentas e Plataformas',
				description: 'Domine as principais ferramentas',
				steps: [
					{
						id: 'step-2-1',
						title: 'Google Analytics e Search Console',
						description: 'Aprenda a medir e analisar resultados.',
						resources: resourceDatabase['marketing-digital'],
					},
					{
						id: 'step-2-2',
						title: 'Gestão de Projetos',
						description: 'Organize campanhas e equipes de forma eficiente.',
						resources: resourceDatabase['gestao-projetos'],
					},
				],
			},
			{
				id: 'fase-3',
				title: 'Estratégias Avançadas',
				description: 'Escale seus resultados',
				steps: [
					{
						id: 'step-3-1',
						title: 'SEO Avançado',
						description: 'Técnicas avançadas de otimização e link building.',
						resources: resourceDatabase['seo'],
					},
					{
						id: 'step-3-2',
						title: 'Automação de Marketing',
						description: 'Automatize processos com HubSpot e outras ferramentas.',
						resources: resourceDatabase['marketing-digital'],
					},
				],
			},
		],
	}),

	'design': (level, description) => ({
		title: 'Roadmap de Design',
		description: `Plano completo para ${level === 'iniciante' ? 'iniciar em' : level === 'intermediario' ? 'evoluir em' : 'dominar'} design.`,
		estimatedTime: level === 'iniciante' ? '6-8 meses' : level === 'intermediario' ? '4-6 meses' : '3-4 meses',
		phases: [
			{
				id: 'fase-1',
				title: 'Fundamentos do Design',
				description: 'Aprenda os princípios básicos',
				steps: [
					{
						id: 'step-1-1',
						title: 'Teoria do Design',
						description: 'Cores, tipografia, composição e hierarquia visual.',
						resources: resourceDatabase['design-grafico'],
					},
					{
						id: 'step-1-2',
						title: 'Ferramentas de Design',
						description: 'Figma, Canva e outras ferramentas essenciais.',
						resources: resourceDatabase['ui-design'],
					},
				],
			},
			{
				id: 'fase-2',
				title: 'UX Design',
				description: 'Crie experiências memoráveis',
				steps: [
					{
						id: 'step-2-1',
						title: 'Pesquisa de Usuário',
						description: 'Entenda as necessidades e comportamentos dos usuários.',
						resources: resourceDatabase['ui-design'],
					},
					{
						id: 'step-2-2',
						title: 'Prototipagem',
						description: 'Crie wireframes e protótipos interativos.',
						resources: resourceDatabase['ui-design'],
					},
				],
			},
			{
				id: 'fase-3',
				title: 'UI Design',
				description: 'Crie interfaces visuais impactantes',
				steps: [
					{
						id: 'step-3-1',
						title: 'Design Systems',
						description: 'Crie e mantenha sistemas de design escaláveis.',
						resources: resourceDatabase['ui-design'],
					},
					{
						id: 'step-3-2',
						title: 'Design Responsivo',
						description: 'Adapte interfaces para diferentes dispositivos.',
						resources: resourceDatabase['html-css'],
					},
				],
			},
		],
	}),

	'empreendedorismo': (level, description) => ({
		title: 'Roadmap de Empreendedorismo',
		description: `Plano completo para ${level === 'iniciante' ? 'começar a' : level === 'intermediario' ? 'escalar seu' : 'consolidar seu'} negócio.`,
		estimatedTime: level === 'iniciante' ? '6-12 meses' : level === 'intermediario' ? '4-8 meses' : '3-6 meses',
		phases: [
			{
				id: 'fase-1',
				title: 'Validação da Ideia',
				description: 'Valide sua ideia de negócio',
				steps: [
					{
						id: 'step-1-1',
						title: 'Lean Startup',
						description: 'Aprenda a metodologia para validar ideias rapidamente.',
						resources: resourceDatabase['empreendedorismo'],
					},
					{
						id: 'step-1-2',
						title: 'Pesquisa de Mercado',
						description: 'Entenda seu público-alvo e concorrentes.',
						resources: resourceDatabase['pesquisa'],
					},
				],
			},
			{
				id: 'fase-2',
				title: 'MVP e Lançamento',
				description: 'Construa e lance seu produto mínimo',
				steps: [
					{
						id: 'step-2-1',
						title: 'Construindo o MVP',
						description: 'Crie uma versão mínima do seu produto para testar.',
						resources: resourceDatabase['empreendedorismo'],
					},
					{
						id: 'step-2-2',
						title: 'Marketing de Lançamento',
						description: 'Estratégias para atrair os primeiros clientes.',
						resources: resourceDatabase['marketing-digital'],
					},
				],
			},
			{
				id: 'fase-3',
				title: 'Crescimento',
				description: 'Escale seu negócio',
				steps: [
					{
						id: 'step-3-1',
						title: 'Gestão Financeira',
						description: 'Controle finanças e planejamento.',
						resources: resourceDatabase['financas'],
					},
					{
						id: 'step-3-2',
						title: 'Gestão de Projetos',
						description: 'Organize processos e equipe com metodologias ágeis.',
						resources: resourceDatabase['gestao-projetos'],
					},
				],
			},
		],
	}),
};

function detectCategory(topic: string, description: string): string {
	const text = `${topic} ${description}`.toLowerCase();
	
	if (text.match(/web|frontend|backend|react|javascript|html|css|node|api|site|website|aplicativo web|fullstack/)) {
		return 'desenvolvimento-web';
	}
	if (text.match(/data science|dados|machine learning|ml|ia|intelig[êe]ncia artificial|python|análise|analytics|deep learning|tensorflow/)) {
		return 'data-science';
	}
	if (text.match(/marketing|seo|tráfego|ads|anúncio|redes sociais|social media|growth|vendas|leads|funil/)) {
		return 'marketing-digital';
	}
	if (text.match(/design|figma|ui|ux|interface|visual|gráfico|ilustra|canva|adobe/)) {
		return 'design';
	}
	if (text.match(/empreend|startup|negócio|empresa|empres|mvp|produto|mercado|cliente|financ/)) {
		return 'empreendedorismo';
	}
	
	// Default to web development if no match
	return 'desenvolvimento-web';
}

function createGenericRoadmap(topic: string, description: string, level: string): RoadmapData {
	return {
		title: `Roadmap: ${topic}`,
		description: `Plano personalizado para ${description.substring(0, 100)}...`,
		estimatedTime: level === 'iniciante' ? '6-8 meses' : level === 'intermediario' ? '4-6 meses' : '3-4 meses',
		phases: [
			{
				id: 'fase-1',
				title: 'Pesquisa e Planejamento',
				description: 'Entenda o contexto e planeje sua jornada',
				steps: [
					{
						id: 'step-1-1',
						title: 'Pesquisa Inicial',
						description: 'Pesquise sobre o tema e identifique os principais conceitos.',
						resources: resourceDatabase['pesquisa'],
					},
					{
						id: 'step-1-2',
						title: 'Definição de Objetivos',
						description: 'Defina metas claras e mensuráveis para seu projeto.',
						resources: resourceDatabase['gestao-projetos'],
					},
				],
			},
			{
				id: 'fase-2',
				title: 'Aprendizado dos Fundamentos',
				description: 'Adquira os conhecimentos essenciais',
				steps: [
					{
						id: 'step-2-1',
						title: 'Estudo Teórico',
						description: 'Estude os conceitos fundamentais do tema.',
						resources: resourceDatabase['documentacao'],
					},
					{
						id: 'step-2-2',
						title: 'Prática Inicial',
						description: 'Comece a praticar com exercícios simples.',
						resources: resourceDatabase['programacao-basico'],
					},
				],
			},
			{
				id: 'fase-3',
				title: 'Desenvolvimento de Habilidades',
				description: 'Aprofunde seus conhecimentos',
				steps: [
					{
						id: 'step-3-1',
						title: 'Projetos Práticos',
						description: 'Desenvolva projetos para aplicar o que aprendeu.',
						resources: resourceDatabase['gestao-projetos'],
					},
					{
						id: 'step-3-2',
						title: 'Produtividade e Organização',
						description: 'Organize seu tempo e maximize sua produtividade.',
						resources: resourceDatabase['produtividade'],
					},
				],
			},
			{
				id: 'fase-4',
				title: 'Execução e Entrega',
				description: 'Finalize e entregue seu projeto',
				steps: [
					{
						id: 'step-4-1',
						title: 'Finalização do Projeto',
						description: 'Complete todas as etapas e faça revisões finais.',
						resources: resourceDatabase['gestao-projetos'],
					},
				],
			},
		],
	};
}

export function generateRoadmap(topic: string, description: string, level: string): RoadmapData {
	const category = detectCategory(topic, description);
	
	if (roadmapTemplates[category]) {
		const roadmap = roadmapTemplates[category](level, description);
		// Personalize o título baseado no input do usuário
		if (topic.length > 3) {
			roadmap.title = `Roadmap: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
		}
		return roadmap;
	}
	
	return createGenericRoadmap(topic, description, level);
}
