<script lang="ts">
	import { fly } from 'svelte/transition';
	import { smartTrackerStore } from '$lib/stores/smartTrackerStore';
	import XmarkIcon from '$lib/icons/outline/xmarkIcon.svelte';
	import MarkdownRenderer from './MarkdownRenderer.svelte';

	interface Props {
		toggleArtifact: () => void;
		fileContent?: string;
		fileName?: string;
		fileType?: 'markdown' | 'txt' | 'doc' | 'png' | 'pdf' | 'image' | 'csv' | 'html';
		fileUrl?: string; // Para imágenes, PDFs o archivos binarios
	}

	let {
		toggleArtifact,
		fileContent = '',
		fileName = 'Documento',
		fileType = 'markdown',
		fileUrl = ''
	}: Props = $props();

	// Contenido markdown por defecto (tu contenido existente)
	const defaultMarkdownContent = `
# Encabezado Principal H1: El Título del Documento

Este es un párrafo introductorio. Aquí puedes escribir una breve descripción del contenido que sigue. El texto puede incluir **negrita** para resaltar palabras importantes, *cursiva* para enfatizar, y para referenciar comandos o variables.

## Subtítulo H2: Explorando Listas y Enlaces

Las listas son una excelente manera de organizar información.

### Listas Desordenadas (Viñetas)

* Elemento 1: Puede ser una idea o un punto clave.
    * Sub-elemento 1.1: Se pueden anidar listas para mayor detalle.
    * Sub-elemento 1.2: Útil para desglosar un punto.
* Elemento 2: Otro punto importante. Combina formato como *cursiva* o **negrita**.
* Elemento 3: Un enlace a un recurso externo, como [Google](https://www.google.com).

### Listas Ordenadas (Numeradas)

1.  **Primer paso:** Realizar la acción A.
2.  **Segundo paso:** Continuar con la acción B.
3.  **Tercer paso:** Finalizar con la acción C. Es importante seguir el orden.

## Subtítulo H2: Citas e Imágenes

Las citas son útiles para destacar texto de otras fuentes.

> "La imaginación es más importante que el conocimiento. El conocimiento es limitado, mientras que la imaginación abarca el mundo entero."
>
> — Albert Einstein
---

## Subtítulo H2: Tablas y Código

Las tablas permiten estructurar datos de manera clara.

| Encabezado 1 | Encabezado 2 | Encabezado 3 |
| :----------- | :----------: | -----------: |
| Celda 1A     |   Celda 1B   |     Celda 1C |
| Celda 2A     |   Celda 2B   |     Celda 2C |
| Celda 3A     |   Celda 3B   |     Celda 3C |

*La alineación de las columnas se define con los dos puntos*

Finalmente, aquí hay un bloque de código de ejemplo en Python:

\`\`\`python
def saludar(nombre):
  """
  Esta función imprime un saludo personalizado.
  """
  print(f"¡Hola, {nombre}! Bienvenido al mundo de Markdown.")

# Llamada a la función
saludar("Usuario de Prueba")
\`\`\`

Este es el párrafo final del documento. ¡Pruebas completadas!
`;

	// Determinar qué contenido mostrar
	const contentToShow = fileContent || defaultMarkdownContent;

	// Función para obtener el icono según el tipo de archivo
	function getFileTypeIcon(type: string): string {
		switch (type) {
			case 'markdown':
				return '📝';
			case 'txt':
				return '📄';
			case 'doc':
				return '📃';
			case 'png':
			case 'image':
				return '🖼️';
			case 'pdf':
				return '📕';
			case 'csv':
				return '📊';
			default:
				return '📄';
		}
	}

	// Función para formatear texto plano con saltos de línea
	function formatPlainText(text: string): string {
		return text.replace(/\n/g, '<br>');
	}

	// Función para procesar contenido de Word (simplificado)
	function formatWordContent(text: string): string {
		// Procesamiento básico para texto de Word extraído
		return text
			.replace(/\n\n+/g, '</p><p>')
			.replace(/\n/g, '<br>')
			.replace(/^/, '<p>')
			.replace(/$/, '</p>');
	}

	// Función para parsear contenido CSV
	function parseCSV(text: string): string[][] {
		if (!text || text.trim() === '') return [];

		const lines = text.trim().split('\n');
		const result: string[][] = [];

		for (const line of lines) {
			if (line.trim() === '') continue;

			const row: string[] = [];
			let current = '';
			let inQuotes = false;
			let i = 0;

			while (i < line.length) {
				const char = line[i];
				const nextChar = line[i + 1];

				if (char === '"') {
					if (inQuotes && nextChar === '"') {
						// Doble comilla dentro de campo entrecomillado
						current += '"';
						i += 2;
					} else {
						// Inicio o fin de campo entrecomillado
						inQuotes = !inQuotes;
						i++;
					}
				} else if (char === ',' && !inQuotes) {
					// Separador de campo
					row.push(current.trim());
					current = '';
					i++;
				} else {
					current += char;
					i++;
				}
			}

			// Agregar el último campo
			row.push(current.trim());
			result.push(row);
		}

		return result;
	}

	// Función para detectar si la primera fila son headers
	function hasHeaders(data: string[][]): boolean {
		if (data.length < 2) return false;

		const firstRow = data[0];
		const secondRow = data[1];

		// Si la primera fila tiene strings y la segunda números, probablemente son headers
		const firstRowHasStrings = firstRow.some((cell) => isNaN(Number(cell)) && cell !== '');
		const secondRowHasNumbers = secondRow.some((cell) => !isNaN(Number(cell)) && cell !== '');

		return firstRowHasStrings && (secondRowHasNumbers || data.length === 2);
	}

	let contentCsv = `id,nombre,apellido,email,departamento,puesto,salario,fecha_ingreso,edad,telefono,direccion,ciudad,estado,codigo_postal,genero,estado_civil,experiencia_anos,nivel_educacion,certificaciones,idiomas,evaluacion_desempeno,horas_semanales,modalidad_trabajo,supervisor_id,fecha_ultimo_ascenso,beneficios,seguro_medico,plan_pension,vacaciones_disponibles,proyectos_asignados
1,"María José","González Pérez","maria.gonzalez@empresa.com","Recursos Humanos","Gerente de RRHH",85000,"2019-03-15",34,"555-0123","Av. Principal 123, Apt 4B","Santa Cruz","Santa Cruz","8001","Femenino","Casada",8,"Maestría","PHR, SHRM-CP","Español, Inglés, Portugués",4.8,40,"Híbrido",NULL,"2022-01-15","Seguro médico completo, Bono anual","Sí","Sí",22,"Sistema HRIS, Capacitación empleados"
2,"Carlos Alberto","Rodríguez Lima","carlos.rodriguez@empresa.com","Tecnología","Desarrollador Senior",75000,"2020-07-22",29,"555-0124","Calle Falsa 456","Santa Cruz","Santa Cruz","8002","Masculino","Soltero",6,"Licenciatura","AWS Solutions Architect, Scrum Master","Español, Inglés",4.6,42,"Remoto",8,"2023-07-01","Seguro médico, Capacitación técnica","Sí","Sí",18,"App móvil, API Gateway, Microservicios"
3,"Ana Sofía","Martínez Vega","ana.martinez@empresa.com","Marketing","Coordinadora Digital",55000,"2021-11-08",27,"555-0125","Barrio Norte 789","Santa Cruz","Santa Cruz","8003","Femenino","Soltera",4,"Licenciatura","Google Ads, Facebook Blueprint","Español, Inglés, Francés",4.5,38,"Presencial",12,"2023-11-01","Seguro básico, Días flexibles","Sí","No",16,"Campaña Q4 2024, Redes sociales"
4,"Roberto","Fernández Castro","roberto.fernandez@empresa.com","Finanzas","Analista Financiero",62000,"2020-01-20",31,"555-0126","Zona Sur 321","Santa Cruz","Santa Cruz","8004","Masculino","Casado",5,"Maestría","CPA, CFA Level 1","Español, Inglés",4.7,40,"Híbrido",15,"2022-06-15","Seguro completo, Stock options","Sí","Sí",20,"Presupuesto 2025, Análisis de costos"
5,"Lucia Elena","Morales Quispe","lucia.morales@empresa.com","Operaciones","Supervisora de Logística",58000,"2018-09-10",36,"555-0127","Villa Primero de Mayo 654","Santa Cruz","Santa Cruz","8005","Femenino","Divorciada",9,"Técnico Superior","Six Sigma Green Belt","Español, Quechua",4.4,44,"Presencial",18,"2021-09-01","Seguro médico, Bono productividad","Sí","Sí",24,"Optimización almacén, Inventario Q1"
6,"Diego Alejandro","Vargas Moreno","diego.vargas@empresa.com","Ventas","Ejecutivo de Cuentas",48000,"2022-04-05",25,"555-0128","Equipetrol Norte 987","Santa Cruz","Santa Cruz","8006","Masculino","Soltero",2,"Licenciatura","Salesforce Admin","Español, Inglés",4.2,40,"Híbrido",22,"","Seguro básico, Comisiones","Sí","No",14,"Cliente corporativo ABC, Prospección B2B"
7,"Patricia Isabel","Mendoza Silva","patricia.mendoza@empresa.com","Legal","Abogada Corporativa",78000,"2019-12-03",38,"555-0129","Carretera Norte Km 5","Santa Cruz","Santa Cruz","8007","Femenino","Casada",12,"Maestría","Especialización en Derecho Corporativo","Español, Inglés, Italiano",4.9,40,"Presencial",NULL,"2023-01-20","Seguro premium, Club ejecutivo","Sí","Sí",25,"Contratos internacionales, Compliance"
8,"Fernando","Herrera Paz","fernando.herrera@empresa.com","Tecnología","DevOps Engineer",68000,"2021-08-17",30,"555-0130","Barrio Equipetrol 147","Santa Cruz","Santa Cruz","8008","Masculino","Casado",5,"Ingeniería","Docker Certified, Kubernetes","Español, Inglés",4.5,45,"Remoto",8,"2024-02-01","Seguro médico, Home office allowance","Sí","Sí",17,"Infraestructura cloud, CI/CD pipeline"
9,"Gabriela","Torres Mendez","gabriela.torres@empresa.com","Recursos Humanos","Especialista en Reclutamiento",52000,"2022-09-12",28,"555-0131","Plan 3000 Bloque 25","Santa Cruz","Santa Cruz","8009","Femenino","Soltera",3,"Licenciatura","LinkedIn Recruiter, DISC Assessment","Español, Inglés",4.3,38,"Híbrido",1,"","Seguro médico, Días de bienestar","Sí","No",15,"Contratación IT, Programa de pasantías"
10,"Andrés Felipe","Sánchez Rojas","andres.sanchez@empresa.com","Marketing","Diseñador Gráfico",45000,"2023-01-30",26,"555-0132","Radial 27 y 4to Anillo","Santa Cruz","Santa Cruz","8010","Masculino","Soltero",3,"Técnico","Adobe Certified Expert","Español, Inglés",4.1,40,"Presencial",12,"","Seguro básico, Capacitación creativa","Sí","No",12,"Rediseño marca, Material POP 2024"
11,"Isabella","Cruz Gutierrez","isabella.cruz@empresa.com","Finanzas","Contadora Senior",65000,"2020-05-18",33,"555-0133","Av. Alemana 852","Santa Cruz","Santa Cruz","8011","Femenino","Casada",8,"Maestría","CPA, SAP Finance","Español, Alemán, Inglés",4.6,40,"Híbrido",15,"2023-05-01","Seguro completo, Flexibilidad horaria","Sí","Sí",19,"Cierre mensual, Auditoría externa"
12,"Miguel Ángel","Jiménez Peña","miguel.jimenez@empresa.com","Operaciones","Analista de Procesos",54000,"2021-03-25",29,"555-0134","Mutualista 963","Santa Cruz","Santa Cruz","8012","Masculino","Soltero",4,"Licenciatura","Lean Six Sigma Yellow Belt","Español, Inglés",4.4,40,"Híbrido",18,"2024-01-15","Seguro médico, Bonos por mejoras","Sí","Sí",16,"Mapeo procesos, Automatización tareas"
13,"Valentina","Medina López","valentina.medina@empresa.com","Ventas","Representante de Ventas",42000,"2023-06-14",24,"555-0135","Zona El Bajío 741","Santa Cruz","Santa Cruz","8013","Femenino","Soltera",1,"Licenciatura","HubSpot Sales","Español, Inglés",3.9,40,"Presencial",22,"","Seguro básico, Comisiones por meta","No","No",10,"Cartera clientes PYME, Ferias comerciales"
14,"Sebastián","Reyes Torres","sebastian.reyes@empresa.com","Tecnología","Analista de Datos",60000,"2022-10-07",27,"555-0136","Barrio Hamacas 159","Santa Cruz","Santa Cruz","8014","Masculino","Soltero",3,"Maestría","Tableau Desktop Specialist, SQL","Español, Inglés",4.3,40,"Remoto",8,"","Seguro médico, Cursos online","Sí","No",14,"Dashboard ejecutivo, Análisis predictivo"
15,"Camila Andrea","Flores Vargas","camila.flores@empresa.com","Marketing","Community Manager",38000,"2023-09-01",23,"555-0137","Villa 1ro de Mayo 357","Santa Cruz","Santa Cruz","8015","Femenino","Soltera",1,"Licenciatura","Meta Social Media, Hootsuite","Español, Inglés, Portugués",4.0,35,"Híbrido",12,"","Seguro básico, Día libre cumpleaños","No","No",8,"Gestión RRSS, Contenido viral Q4"
16,"Juan Carlos","Moreno Díaz","juan.moreno@empresa.com","Recursos Humanos","Coordinador de Capacitación",50000,"2021-12-20",32,"555-0138","Urb. Las Palmas 753","Santa Cruz","Santa Cruz","8016","Masculino","Casado",6,"Licenciatura","Instructional Design, e-Learning","Español, Inglés",4.5,40,"Presencial",1,"2023-12-01","Seguro médico, Acceso plataformas","Sí","Sí",17,"LMS corporativo, Programa liderazgo"
17,"Sofia Alejandra","Gutiérrez Kim","sofia.gutierrez@empresa.com","Legal","Asistente Legal",35000,"2023-02-14",25,"555-0139","Av. Santos Dumont 951","Santa Cruz","Santa Cruz","8017","Femenino","Soltera",1,"Técnico Superior","Paralegal Certificate","Español, Inglés, Coreano",3.8,40,"Presencial",7,"","Seguro básico, Capacitación legal","No","No",11,"Archivo digital, Contratos menores"
18,"Ricardo Alberto","Peña Mamani","ricardo.pena@empresa.com","Operaciones","Jefe de Almacén",56000,"2019-06-11",35,"555-0140","Zona Norte Industrial","Santa Cruz","Santa Cruz","8018","Masculino","Casado",9,"Técnico","Manejo montacargas, Inventarios","Español, Aimara",4.4,48,"Presencial",18,"2022-06-01","Seguro familiar, Bono antigüedad","Sí","Sí",23,"Control stock, Sistema WMS"
19,"Nicole Daniela","Aguilar Soto","nicole.aguilar@empresa.com","Finanzas","Asistente Contable",32000,"2023-11-06",22,"555-0141","Barrio Petrolero 456","Santa Cruz","Santa Cruz","8019","Femenino","Soltera",0,"Técnico Superior","QuickBooks ProAdvisor","Español, Inglés",3.7,40,"Presencial",11,"","Seguro básico, Curso contabilidad","No","No",4,"Facturación, Conciliaciones bancarias"
20,"Esteban José","Villarroel Ríos","esteban.villarroel@empresa.com","Ventas","Gerente de Ventas",95000,"2018-04-16",40,"555-0142","Country Club 789","Santa Cruz","Santa Cruz","8020","Masculino","Casado",15,"MBA","Strategic Sales Management","Español, Inglés, Francés",4.9,45,"Híbrido",NULL,"2021-04-01","Seguro premium, Auto empresa","Sí","Sí",28,"Estrategia comercial, Expansión regional"
21,"Daniela Paola","Castro Mendoza","daniela.castro@empresa.com","Tecnología","UX/UI Designer",58000,"2022-01-10",28,"555-0143","Av. Piraí 147","Santa Cruz","Santa Cruz","8021","Femenino","Soltera",4,"Licenciatura","Google UX Certificate, Figma Expert","Español, Inglés",4.4,40,"Remoto",8,"2024-06-01","Seguro médico, Licencias software","Sí","No",15,"Rediseño app móvil, Design system"
22,"Alexander","Molina Rivera","alexander.molina@empresa.com","Marketing","Analista de Marketing","47000","2022-11-28",26,"555-0144","Radial 26 y 3er Anillo","Santa Cruz","Santa Cruz","8022","Masculino","Soltero",2,"Licenciatura","Google Analytics 4, Power BI","Español, Inglés",4.2,40,"Híbrido",12,"","Seguro médico, Conferencias marketing","Sí","No",13,"ROI campañas, Segmentación clientes"
23,"Mariela Ximena","Cortez Alvarez","mariela.cortez@empresa.com","Recursos Humanos","Coordinadora de Nóminas",53000,"2020-08-03",31,"555-0145","Villa Olímpica 852","Santa Cruz","Santa Cruz","8023","Femenino","Divorciada",7,"Licenciatura","Certified Payroll Professional","Español, Inglés",4.6,40,"Presencial",1,"2023-08-01","Seguro médico, Horario flexible","Sí","Sí",21,"Nómina 500+ empleados, Sistema RRHH"
24,"Joaquín Raúl","Espinoza Choque","joaquin.espinoza@empresa.com","Operaciones","Técnico de Mantenimiento",41000,"2021-07-19",34,"555-0146","Zona Plan 3000","Santa Cruz","Santa Cruz","8024","Masculino","Casado",8,"Técnico","Electricidad industrial, PLC","Español, Quechua",4.3,44,"Presencial",18,"2024-07-01","Seguro familiar, Capacitación técnica","Sí","Sí",18,"Mantenimiento preventivo, Equipos nuevos"
25,"Brenda Carolina","Varela Suárez","brenda.varela@empresa.com","Legal","Coordinadora Compliance","72000","2021-02-22",33,"555-0147","Condominio Las Torres","Santa Cruz","Santa Cruz","8025","Femenino","Casada",6,"Maestría","Certified Compliance Officer","Español, Inglés, Portugués",4.7,40,"Híbrido",7,"2024-02-01","Seguro completo, Capacitación legal","Sí","Sí",20,"Políticas internas, Auditoría compliance`;
</script>

<div
	class="fixed inset-0 z-50 flex flex-col bg-light-one_d lg:relative lg:inset-auto lg:z-auto lg:h-full lg:w-1/2 lg:drop-shadow-lg dark:bg-dark-one_d"
	transition:fly={{ x: 300, duration: 300 }}
>
	<div class="flex w-full items-center justify-between bg-light-one_d px-4 py-2 dark:bg-dark-one_d">
		<div class="flex items-center gap-2">
			<h3 class="text-lg font-semibold text-light-two dark:text-dark-two">
				{fileName}
			</h3>
		</div>
		<button
			onclick={toggleArtifact}
			class="group rounded-lg p-1 transition-colors hover:bg-light-two_d dark:bg-dark-one dark:hover:bg-dark-two_d"
			aria-label="Cerrar artefacto"
		>
			<XmarkIcon
				className="w-6 h-6 text-light-two dark:text-dark-two group-hover:text-light-one dark:group-hover:text-dark-one"
			/>
		</button>
	</div>

	<div class="flex-1 overflow-auto">
		{#if fileType === 'markdown'}
			<!-- Renderizado de Markdown -->
			<div class="px-4 py-4 sm:px-8">
				<MarkdownRenderer markdownText={contentToShow} />
			</div>
		{:else if fileType === 'txt'}
			<!-- Renderizado de texto plano -->
			<div class="px-4 py-4 sm:px-8">
				<div class="rounded-lg bg-light-one p-4 dark:bg-dark-one">
					<pre
						class="overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-light-two dark:text-dark-two">
{contentToShow}
					</pre>
				</div>
			</div>
		{:else if fileType === 'doc'}
			<!-- Renderizado de contenido de Word -->
			<div class="px-4 py-4 sm:px-8">
				<div class="prose prose-sm max-w-none text-light-two dark:text-dark-two">
					<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-two_d">
						{#if contentToShow}
							{@html formatWordContent(contentToShow)}
						{:else}
							<div class="py-8 text-center text-light-three dark:text-dark-three">
								<p class="mb-4">📃 Documento de Word</p>
								<p class="text-sm">
									Para ver el contenido completo, necesitas procesar el archivo .doc/.docx
								</p>
								<p class="mt-2 text-xs">
									Sugerencia: Convierte a texto plano o PDF para mejor compatibilidad
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{:else if fileType === 'csv'}
			<!-- Renderizado de CSV -->
			<div class="px-4 py-4 sm:px-8">
				{#if contentToShow}
					{@const csvData = parseCSV(contentCsv)}
					{#if csvData.length > 0}
						{@const hasHeaderRow = hasHeaders(csvData)}
						<div class="rounded-lg bg-light-one dark:bg-dark-one">
							<div>
								<table class="w-full min-w-max">
									{#if hasHeaderRow}
										<thead class="bg-light-one dark:bg-dark-one">
											<tr>
												{#each csvData[0] as header, index}
													<th
														class="border-b border-light-three px-4 py-3 text-left text-sm font-semibold text-light-two dark:border-dark-three dark:text-dark-two"
													>
														{header || `Columna ${index + 1}`}
													</th>
												{/each}
											</tr>
										</thead>
										<tbody>
											{#each csvData.slice(1) as row, rowIndex}
												<tr
													class="border-b border-light-three transition-colors hover:bg-light-one_d dark:border-dark-three dark:hover:bg-dark-one_d"
												>
													{#each row as cell, cellIndex}
														<td class="px-4 py-3 text-sm text-light-two dark:text-dark-two">
															{cell}
														</td>
													{/each}
													{#if row.length < csvData[0].length}
														{#each Array(csvData[0].length - row.length) as _}
															<td class="px-4 py-3 text-sm text-light-three dark:text-dark-three">
																—
															</td>
														{/each}
													{/if}
												</tr>
											{/each}
										</tbody>
									{:else}
										<tbody>
											{#each csvData as row, rowIndex}
												<tr
													class="border-b border-light-three transition-colors hover:bg-light-two_d dark:border-dark-three dark:hover:bg-dark-two_d"
												>
													{#each row as cell, cellIndex}
														<td class="px-4 py-3 text-sm text-light-two dark:text-dark-two">
															{cell}
														</td>
													{/each}
												</tr>
											{/each}
										</tbody>
									{/if}
								</table>
							</div>
							<!-- <div
								class="border-t border-light-three bg-light-two_d px-4 py-2 text-xs text-light-three dark:border-dark-three dark:bg-dark-two_d dark:text-dark-three"
							>
								{csvData.length} filas × {csvData[0]?.length || 0} columnas
							</div> -->
						</div>
					{:else}
						<div class="py-8 text-center text-light-three dark:text-dark-three">
							<p class="mb-4">📊 Archivo CSV vacío</p>
							<p class="text-sm">El archivo no contiene datos válidos</p>
						</div>
					{/if}
				{:else}
					<div class="py-8 text-center text-light-three dark:text-dark-three">
						<p class="mb-4">📊 Archivo CSV</p>
						<p class="text-sm">No se proporcionó contenido CSV</p>
					</div>
				{/if}
			</div>
		{:else if fileType === 'png' || fileType === 'image'}
			<!-- Renderizado de imágenes -->
			<div class="flex h-full items-center justify-center p-4">
				{#if fileUrl}
					<div class="flex max-h-full max-w-full flex-col items-center">
						<img
							src={fileUrl}
							alt={fileName}
							class="max-h-full max-w-full rounded-lg object-contain p-8"
						/>
						<div class="hidden py-8 text-center text-light-three dark:text-dark-three">
							<p class="mb-2">🖼️ Error al cargar la imagen</p>
							<p class="text-sm">Verifica que la URL sea válida: {fileUrl}</p>
						</div>
						<!-- <p class="mt-2 text-center text-sm text-light-three dark:text-dark-three">
							{fileName}
						</p> -->
					</div>
				{:else}
					<div class="py-8 text-center text-light-three dark:text-dark-three">
						<p class="mb-4">🖼️ Imagen</p>
						<p class="text-sm">No se proporcionó URL de imagen</p>
					</div>
				{/if}
			</div>
		{:else if fileType === 'pdf' || fileType === 'html'}
			<!-- Renderizado de PDF -->
			<div class="flex h-full flex-col">
				{#if fileUrl}
					<div class="min-h-0 flex-1">
						<iframe src={fileUrl} class="h-full w-full border-0" title={fileName}></iframe>
					</div>
				{:else}
					<div
						class="flex flex-1 items-center justify-center py-8 text-center text-light-three dark:text-dark-three"
					>
						<div>
							<p class="mb-4">📕 Documento PDF</p>
							<p class="text-sm">No se proporcionó URL del PDF</p>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Tipo de archivo no soportado -->
			<div
				class="flex h-full items-center justify-center py-8 text-center text-light-three dark:text-dark-three"
			>
				<div>
					<p class="mb-4">❓ Tipo de archivo no soportado</p>
					<p class="text-sm">Tipo: {fileType}</p>
					<p class="mt-2 text-xs">Formatos soportados: Markdown, TXT, DOC, PNG, PDF, CSV</p>
				</div>
			</div>
		{/if}
	</div>
</div>
