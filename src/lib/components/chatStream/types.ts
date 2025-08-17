// Define la estructura para un único mensaje en el chat
export interface ChatMessage {
	id: string;
	sender: 'user' | 'agent';
	text: string;
	// Los mensajes del agente pueden incluir botones que se vinculan a sus pasos de pensamiento
	steps?: { id: string; name: string }[];
}

// Define la estructura para un paso en el proceso de pensamiento del agente
// Inspirado en los procesos internos de frameworks como Google ADK
export interface AgentStep {
	id: string;
	type: 'tool_code' | 'observation' | 'agent_call' | 'final_thought';
	// El contenido puede ser cualquier objeto, lo renderizaremos como JSON
	content: any;
}

// Define el tipo para una persona cotizada
interface CotizacionPersona {
	edad: number;
	alias: string;
	genero: 'M' | 'F';
	nombre_plan: string;
	precio_mensual: number;
}

// Define la estructura para los datos de la cotización
interface QuotationData {
	estado: string;
	se_cotizo: boolean;
	complete_output: string;
	cobertura_planes: string[];
	cotizaciones_personas: CotizacionPersona[];
}

// Define el estado principal de la aplicación
interface State {
	quotation_data: QuotationData;
	quotation_agent_result: string;
}

// Define las partes del contenido de un evento
interface TextPart {
	text: string;
}

interface FunctionCallPart {
	functionCall: {
		id: string;
		args: {
			request: string;
		};
		name: string;
	};
}

// El 'result' es un string JSON, por lo que se puede tipificar como string
// o definir una interfaz para el contenido parseado si es necesario.
interface FunctionResponsePart {
	functionResponse: {
		id: string;
		name: string;
		response: {
			result: string; // JSON string
		};
	};
}

type Part = TextPart | FunctionCallPart | FunctionResponsePart;

// Define el contenido de un evento
interface Content {
	parts: Part[];
	role?: string;
}

// Define los cambios en el estado (StateDelta)
interface StateDelta {
	quotation_data?: QuotationData | { data: string };
	quotation_agent_result?: string;
}

// Define las acciones dentro de un evento
interface Actions {
	stateDelta: StateDelta | {};
	artifactDelta: {};
	requestedAuthConfigs: {};
}

// Define la estructura de un evento individual
interface Event {
	content: Content;
	invocationId: string;
	author: string;
	actions: Actions;
	longRunningToolIds: any[];
	id: string;
	timestamp: number;
	partial?: boolean;
}

// Define la estructura raíz del objeto JSON
export interface SessionData {
	id: string;
	appName: string;
	userId: string;
	state: State;
	events: Event[];
	lastUpdateTime: number;
}
